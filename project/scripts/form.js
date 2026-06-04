// ============================================================
// form.js — Product Review Form
// Handles three responsibilities:
//   1. Populating the product <select> from the products array
//   2. Incrementing and displaying the localStorage review counter
//   3. Showing submitted form values on the confirmation page
// ============================================================

// ------------------------------------------------------------
// PRODUCT DATA
// This array is the source of truth for the product dropdown.
// Normally this would come from an API or a database — for this
// assignment it lives right here in the JS file as instructed.
// ------------------------------------------------------------
const products = [
  {
    id: "fc-1888",
    name: "flux capacitor",
    averagerating: 4.5
  },
  {
    id: "fc-2050",
    name: "power laces",
    averagerating: 4.7
  },
  {
    id: "fs-1987",
    name: "time circuits",
    averagerating: 3.5
  },
  {
    id: "ac-2000",
    name: "low voltage reactor",
    averagerating: 3.9
  },
  {
    id: "jj-1969",
    name: "warp equalizer",
    averagerating: 5.0
  }
];

// ------------------------------------------------------------
// UTILITY — capitalize the first letter of each word in a string
// Used to display product names in title case in the dropdown.
// ------------------------------------------------------------
function toTitleCase(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ------------------------------------------------------------
// POPULATE PRODUCT SELECT
// Runs on form.html — looks for the <select id="product-name">
// element. If it finds it, it loops through the products array
// and creates an <option> for each one.
//
// Per the assignment:
//   - option display text  → product.name  (formatted as title case)
//   - option value         → product.id
// ------------------------------------------------------------
function populateProductSelect() {
  const selectEl = document.getElementById('product-name');

  // Guard: if this element doesn't exist we're on the wrong page — bail out
  if (!selectEl) return;

  products.forEach(product => {
    // Create a fresh <option> element for each product
    const option = document.createElement('option');

    // value = the product's id field, as instructed
    option.value = product.id;

    // Display text = the product's name, prettified with title case
    option.textContent = toTitleCase(product.name);

    // Append the new option to the select element — the placeholder
    // option (disabled, selected) that was already in the HTML stays
    // at the top because we're appending, not prepending.
    selectEl.appendChild(option);
  });
}

// ------------------------------------------------------------
// FOOTER YEAR — keeps the copyright year current automatically
// ------------------------------------------------------------
function setFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ------------------------------------------------------------
// REVIEW COUNTER (localStorage)
// Each time review.html loads we pull the stored count, add 1,
// save it back, and display the new total.
//
// localStorage key: 'reviewCount'
// Value stored: a plain integer as a string (localStorage only
// stores strings, so we parse it back to a number when reading).
// ------------------------------------------------------------
function handleReviewCounter() {
  const counterEl = document.getElementById('review-count');

  // Guard: only run this on review.html where the counter element exists
  if (!counterEl) return;

  // Read the current count — default to 0 if nothing is stored yet
  const currentCount = parseInt(localStorage.getItem('reviewCount') || '0', 10);

  // Add one for this submission
  const newCount = currentCount + 1;

  // Persist the updated count so it survives browser refreshes
  localStorage.setItem('reviewCount', newCount);

  // Show the updated number in the counter card
  counterEl.textContent = newCount;
}

// ------------------------------------------------------------
// DISPLAY SUBMITTED DETAILS
// The form uses method="get" so the submitted values land in the
// URL query string. We parse them here and render a summary so
// the user can confirm what they actually sent.
// ------------------------------------------------------------
function displaySubmittedDetails() {
  const detailsContainer = document.getElementById('submitted-details');

  // Guard: only run on review.html
  if (!detailsContainer) return;

  // URLSearchParams makes reading query string values very clean
  const params = new URLSearchParams(window.location.search);

  // If there are no params at all (e.g. someone navigated here directly)
  // hide the details section entirely — nothing meaningful to show
  if (!params.has('product') && !params.has('rating')) {
    detailsContainer.style.display = 'none';
    return;
  }

  // Pull individual values from the query string
  const productId = params.get('product') || '—';
  const rating = params.get('rating') || '—';
  const installDate = params.get('installDate') || '—';
  const review = params.get('writtenReview') || '(no written review provided)';
  const userName = params.get('userName') || 'Anonymous';

  // Find the matching product name from the array so we display the
  // human-readable name instead of the raw id string.
  const matchedProduct = products.find(p => p.id === productId);
  const productName = matchedProduct
    ? toTitleCase(matchedProduct.name)
    : productId;

  // Build the star display string — convert the numeric rating to actual
  // filled star characters so the summary is easy to read at a glance.
  const ratingNum = parseInt(rating, 10);
  const starDisplay = isNaN(ratingNum)
    ? '—'
    : '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);

  // Collect all checked "feature" checkboxes — these come through as
  // multiple values with the same key, so getAll() grabs them all.
  const features = params.getAll('feature');
  const featuresText = features.length > 0
    ? features.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')
    : '(none selected)';

  // Format the date for display — the raw value is YYYY-MM-DD from the
  // date input; toLocaleDateString makes it friendlier to read.
  let formattedDate = installDate;
  if (installDate !== '—') {
    // Adding 'T00:00:00' avoids timezone off-by-one issues when parsing
    const parsed = new Date(installDate + 'T00:00:00');
    if (!isNaN(parsed)) {
      formattedDate = parsed.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  }

  // Build the HTML to inject into the details container
  detailsContainer.innerHTML = `
    <h3>Your Submission</h3>
    <dl>
      <dt>Reviewer</dt>
      <dd>${escapeHtml(userName)}</dd>

      <dt>Product</dt>
      <dd>${escapeHtml(productName)}</dd>

      <dt>Rating</dt>
      <dd>${starDisplay} (${isNaN(ratingNum) ? '—' : ratingNum}/5)</dd>

      <dt>Installed</dt>
      <dd>${escapeHtml(formattedDate)}</dd>

      <dt>Features</dt>
      <dd>${escapeHtml(featuresText)}</dd>

      <dt>Review</dt>
      <dd>${escapeHtml(review)}</dd>
    </dl>
  `;
}

// ------------------------------------------------------------
// ESCAPE HTML — safety helper
// Prevents user-supplied text from being interpreted as HTML.
// Simple but effective for this use case.
// ------------------------------------------------------------
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ------------------------------------------------------------
// INIT — run everything once the DOM is fully loaded
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();        // works on both pages
  populateProductSelect();    // only does something on form.html
  handleReviewCounter();      // only does something on review.html
  displaySubmittedDetails();  // only does something on review.html
});