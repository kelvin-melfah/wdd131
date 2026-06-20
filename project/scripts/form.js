// ============================================================
// form.js — Product Review Form
// This one file ends up doing four jobs depending on which page
// loads it:
//   1. Filling the product <select> on form.html from the products array
//   2. Running client-side validation with inline error messages
//   3. Bumping the localStorage review counter on review.html
//   4. Showing what the user actually submitted on the confirmation page
// ============================================================

// ------------------------------------------------------------
// PRODUCT DATA
// This is the source of truth for the product dropdown — just
// a plain array of objects with id, name, and averagerating.
// ------------------------------------------------------------
const products = [
  { id: "fc-1888", name: "flux capacitor", averagerating: 4.5 },
  { id: "fc-2050", name: "power laces", averagerating: 4.7 },
  { id: "fs-1987", name: "time circuits", averagerating: 3.5 },
  { id: "ac-2000", name: "low voltage reactor", averagerating: 3.9 },
  { id: "jj-1969", name: "warp equalizer", averagerating: 5.0 },
];

// ------------------------------------------------------------
// UTILITY — capitalize the first letter of each word
// Small helper so product names look tidy in the dropdown
// instead of all lowercase.
// ------------------------------------------------------------
function toTitleCase(str) {
  return str
    .split(' ')
    .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

// ------------------------------------------------------------
// UTILITY — escape HTML before injecting it
// Anything coming from the URL query string is user input, so
// I'm running it through this before it ever touches innerHTML.
// Keeps things safe from XSS.
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
// POPULATE PRODUCT SELECT
// This only matters on form.html — it grabs the <select id="product-name">
// and loops through the products array to build out the option list.
// ------------------------------------------------------------
function populateProductSelect() {
  const selectEl = document.getElementById('product-name');
  if (!selectEl) return;   // not on form.html, so just bail out quietly

  products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = toTitleCase(product.name);
    selectEl.appendChild(option);
  });
}

// ------------------------------------------------------------
// FOOTER YEAR — so I don't have to manually update the copyright
// year in the footer every January
// ------------------------------------------------------------
function setFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ------------------------------------------------------------
// CLIENT-SIDE VALIDATION
// Checks the three required fields before letting the form
// actually submit. Errors show up inline using the .field-error
// spans I placed next to each field. Returns true if everything's
// good, false if something's missing (which stops the navigation).
// ------------------------------------------------------------
function showError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
  });
}

function validateForm() {
  clearErrors();
  let isValid = true;

  // Check 1 — a product has to be picked, not just left on the placeholder
  const product = document.getElementById('product-name');
  if (!product || !product.value) {
    showError('product-error', 'Please select a product.');
    isValid = false;
  }

  // Check 2 — one of the star radios needs to be checked
  const ratingChecked = document.querySelector('input[name="rating"]:checked');
  if (!ratingChecked) {
    showError('rating-error', 'Please select a star rating.');
    isValid = false;
  }

  // Check 3 — installation date can't be left blank
  const dateEl = document.getElementById('install-date');
  if (!dateEl || !dateEl.value) {
    showError('date-error', 'Please enter the installation date.');
    isValid = false;
  }

  return isValid;
}

// Hooking the validation up to the form's submit event
function setupFormValidation() {
  const form = document.getElementById('review-form');
  if (!form) return;   // not on form.html, nothing to do here

  form.addEventListener('submit', (event) => {
    if (!validateForm()) {
      event.preventDefault();   // only stop the page from navigating if something's invalid
    }
    // If everything checks out, the browser just follows action="review.html"
    // on its own and tacks all the field values onto the URL as query params.
  });
}

// ------------------------------------------------------------
// REVIEW COUNTER (localStorage)
// This runs on review.html — it reads whatever count is already
// stored, adds one, saves it back, and shows the new total in
// the <p id="review-count"> element.
// ------------------------------------------------------------
function handleReviewCounter() {
  const counterEl = document.getElementById('review-count');
  if (!counterEl) return;   // not on review.html, skip it

  // Pull the current count out of storage — default to 0 if it's the first time
  const currentCount = parseInt(localStorage.getItem('reviewCount') || '0', 10);
  const newCount = currentCount + 1;

  // Save the updated count back to localStorage
  localStorage.setItem('reviewCount', newCount);

  // Show the new total on the page
  counterEl.textContent = newCount;
}

// ------------------------------------------------------------
// DISPLAY SUBMITTED DETAILS
// Also runs on review.html — reads the URL's query string with
// URLSearchParams and turns it into a readable summary so the
// user can see exactly what they just sent in.
// ------------------------------------------------------------
function displaySubmittedDetails() {
  const detailsContainer = document.getElementById('submitted-details');
  if (!detailsContainer) return;   // not on review.html, skip it

  const params = new URLSearchParams(window.location.search);

  // If there's nothing recognizable in the query string, the user probably
  // just navigated here directly rather than coming from a real submission
  if (!params.has('product') && !params.has('rating')) {
    detailsContainer.style.display = 'none';
    return;
  }

  const productId = params.get('product') || '—';
  const rating = params.get('rating') || '—';
  const installDate = params.get('installDate') || '—';
  const review = params.get('writtenReview') || '(no written review provided)';
  const userName = params.get('userName') || 'Anonymous';

  // Looking up the friendly product name from the array using the id from the URL
  const matchedProduct = products.find(p => p.id === productId);
  const productName = matchedProduct ? toTitleCase(matchedProduct.name) : productId;

  // Turning the numeric rating into filled/empty star characters
  const ratingNum = parseInt(rating, 10);
  const starDisplay = isNaN(ratingNum)
    ? '—'
    : `${'★'.repeat(ratingNum)}${'☆'.repeat(5 - ratingNum)}`;

  // Features come through as multiple values under the same "feature" key,
  // so getAll() grabs every one of them at once
  const features = params.getAll('feature');
  const featuresText = features.length > 0
    ? features.map(f => `${f.charAt(0).toUpperCase()}${f.slice(1)}`).join(', ')
    : '(none selected)';

  // The date input gives back YYYY-MM-DD, so I'm parsing it with T00:00:00
  // tacked on to dodge any timezone shifting, then formatting it nicely
  let formattedDate = installDate;
  if (installDate !== '—') {
    const parsed = new Date(`${installDate}T00:00:00`);
    if (!isNaN(parsed)) {
      formattedDate = parsed.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  }

  // Building the whole summary with template literals and dropping it in
  detailsContainer.innerHTML = `
    <h3>Your Submission</h3>
    <dl>
      <dt>Reviewer</dt>
      <dd>${escapeHtml(userName)}</dd>

      <dt>Product</dt>
      <dd>${escapeHtml(productName)}</dd>

      <dt>Rating</dt>
      <dd class="star-summary">${starDisplay} (${isNaN(ratingNum) ? '—' : ratingNum}/5)</dd>

      <dt>Installed</dt>
      <dd>${escapeHtml(formattedDate)}</dd>

      <dt>Features Used</dt>
      <dd>${escapeHtml(featuresText)}</dd>

      <dt>Review</dt>
      <dd>${escapeHtml(review)}</dd>
    </dl>
  `;
}

// ------------------------------------------------------------
// INIT — wiring everything up once the DOM is ready
// Every function here has its own guard clause, so it's safe to
// just call all five on every page load — only the relevant ones
// will actually do anything.
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();           // runs on both pages
  populateProductSelect();   // form.html only (guard handles the rest)
  setupFormValidation();     // form.html only (guard handles the rest)
  handleReviewCounter();     // review.html only (guard handles the rest)
  displaySubmittedDetails(); // review.html only (guard handles the rest)
});