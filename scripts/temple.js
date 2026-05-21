// temples.js — Temple Album JavaScript

// ── Footer: dynamic copyright year and last modified date ────────────────────
const currentYearSpan = document.getElementById('currentYear');
const lastModifiedSpan = document.getElementById('lastModified');

if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

if (lastModifiedSpan) {
  lastModifiedSpan.textContent = document.lastModified;
}

// ── Hamburger menu: responsive navigation toggle ─────────────────────────────
const hamButton = document.querySelector('#menu');
const navList = document.querySelector('.navigation');

if (hamButton && navList) {
  hamButton.addEventListener('click', () => {
    // Toggle 'open' on the nav list to show/hide menu items (via CSS max-height)
    navList.classList.toggle('open');
    // Toggle 'open' on the button to swap ☰ ↔ ✕ via ::before pseudo-element
    hamButton.classList.toggle('open');

    // Update aria-expanded for accessibility
    const isOpen = navList.classList.contains('open');
    hamButton.setAttribute('aria-expanded', isOpen);
  });

  // Close the menu if user clicks a nav link (good UX on mobile)
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      hamButton.classList.remove('open');
      hamButton.setAttribute('aria-expanded', false);
    });
  });
}