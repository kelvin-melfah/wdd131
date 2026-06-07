// ============================================================
// form.js — Product Review Form
// Handles four responsibilities:
//   1. Populating the product <select> from the products array
//   2. Client-side validation with inline error messages
//   3. Incrementing and displaying the localStorage review counter
//   4. Showing submitted form values on the confirmation page
// ============================================================

// ------------------------------------------------------------
// PRODUCT DATA
// Source of truth for the product dropdown.
// Each object has id, name, and averagerating.
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
// ------------------------------------------------------------
function toTitleCase(str) {
  return str
    .split(' ')
    .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

// ------------------------------------------------------------
// UTILITY — escape HTML to prevent XSS in injected content
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
// Targets <select id="product-name"> on form.html.
// Uses the products array + forEach + template literals.
// ------------------------------------------------------------
function populateProductSelect() {
  const selectEl = document.getElementById('product-name');
  if (!selectEl) return;   // guard: not on form.html

  products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = toTitleCase(product.name);
    selectEl.appendChild(option);
  });
}

// ------------------------------------------------------------
// FOOTER YEAR — keeps the copyright current automatically
// ------------------------------------------------------------
function setFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ------------------------------------------------------------
// CLIENT-SIDE VALIDATION
// Checks the three required fields before the form submits.
// Shows inline error messages using the .field-error spans.
// Returns true (valid) or false (invalid — prevent navigation).
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

  // Check 1 — product must be selected (not the disabled placeholder)
  const product = document.getElementById('product-name');
  if (!product || !product.value) {
    showError('product-error', 'Please select a product.');
    isValid = false;
  }

  // Check 2 — a star rating must be chosen
  const ratingChecked = document.querySelector('input[name="rating"]:checked');
  if (!ratingChecked) {
    showError('rating-error', 'Please select a star rating.');
    isValid = false;
  }

  // Check 3 — installation date must be filled
  const dateEl = document.getElementById('install-date');
  if (!dateEl || !dateEl.value) {
    showError('date-error', 'Please enter the installation date.');
    isValid = false;
  }

  return isValid;
}

// Attach the validation to the form's submit event
function setupFormValidation() {
  const form = document.getElementById('review-form');
  if (!form) return;   // guard: not on form.html

  form.addEventListener('submit', (event) => {
    if (!validateForm()) {
      event.preventDefault();   // stop navigation only when invalid
    }
    // If valid, the browser follows action="review.html" naturally,
    // appending all field values to the URL as query parameters.
  });
}

// ------------------------------------------------------------
// REVIEW COUNTER (localStorage)
// Runs on review.html — reads stored count, increments, saves,
// and displays the new total in <p id="review-count">.
// ------------------------------------------------------------
function handleReviewCounter() {
  const counterEl = document.getElementById('review-count');
  if (!counterEl) return;   // guard: not on review.html

  // Read current count — default to 0 if nothing stored yet
  const currentCount = parseInt(localStorage.getItem('reviewCount') || '0', 10);
  const newCount = currentCount + 1;

  // Persist the updated count
  localStorage.setItem('reviewCount', newCount);

  // Display the new total
  counterEl.textContent = newCount;
}

// ------------------------------------------------------------
// DISPLAY SUBMITTED DETAILS
// Runs on review.html — parses the URL query string with
// URLSearchParams and renders a human-readable summary.
// ------------------------------------------------------------
function displaySubmittedDetails() {
  const detailsContainer = document.getElementById('submitted-details');
  if (!detailsContainer) return;   // guard: not on review.html

  const params = new URLSearchParams(window.location.search);

  // If no recognizable params exist the user navigated here directly
  if (!params.has('product') && !params.has('rating')) {
    detailsContainer.style.display = 'none';
    return;
  }

  const productId = params.get('product') || '—';
  const rating = params.get('rating') || '—';
  const installDate = params.get('installDate') || '—';
  const review = params.get('writtenReview') || '(no written review provided)';
  const userName = params.get('userName') || 'Anonymous';

  // Look up the human-readable product name from the array
  const matchedProduct = products.find(p => p.id === productId);
  const productName = matchedProduct ? toTitleCase(matchedProduct.name) : productId;

  // Build a star-character display string from the numeric rating
  const ratingNum = parseInt(rating, 10);
  const starDisplay = isNaN(ratingNum)
    ? '—'
    : `${'★'.repeat(ratingNum)}${'☆'.repeat(5 - ratingNum)}`;

  // Collect all checked feature checkboxes (multiple values, same key)
  const features = params.getAll('feature');
  const featuresText = features.length > 0
    ? features.map(f => `${f.charAt(0).toUpperCase()}${f.slice(1)}`).join(', ')
    : '(none selected)';

  // Format the date string — raw value is YYYY-MM-DD from the date input
  let formattedDate = installDate;
  if (installDate !== '—') {
    const parsed = new Date(`${installDate}T00:00:00`);   // T00:00:00 avoids timezone shift
    if (!isNaN(parsed)) {
      formattedDate = parsed.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  }

  // Inject the summary — template literals build every string
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
// INIT — wire everything up once the DOM is ready
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();           // both pages
  populateProductSelect();   // form.html only (guard inside)
  setupFormValidation();     // form.html only (guard inside)
  handleReviewCounter();     // review.html only (guard inside)
  displaySubmittedDetails(); // review.html only (guard inside)
});