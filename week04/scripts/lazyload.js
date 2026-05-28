// Display last modified date in footer
const lastModified = document.getElementById('last-modified');
if (lastModified) {
  const date = new Date(document.lastModified);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  lastModified.textContent = date.toLocaleDateString('en-US', options);
}

// IntersectionObserver: triggers the CSS fade-from-black animation
// only when an image scrolls into the viewport
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1
});

lazyImages.forEach(img => observer.observe(img));