// filtered-temples.js — Temple Album JavaScript

// ── Temple Data Array ────────────────────────────────────────────────────────
const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
  },
  {
    templeName: "Manti Utah",
    location: "Manti, Utah, United States",
    dedicated: "1888, May, 21",
    area: 74792,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
  },
  {
    templeName: "Payson Utah",
    location: "Payson, Utah, United States",
    dedicated: "2015, June, 7",
    area: 96630,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
  },
  {
    templeName: "Yigo Guam",
    location: "Yigo, Guam",
    dedicated: "2020, May, 2",
    area: 6861,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
  },
  {
    templeName: "Washington D.C.",
    location: "Kensington, Maryland, United States",
    dedicated: "1974, November, 19",
    area: 156558,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
  },
  {
    templeName: "Lima Perú",
    location: "Lima, Perú",
    dedicated: "1986, January, 10",
    area: 9600,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
  },
  {
    templeName: "Mexico City Mexico",
    location: "Mexico City, Mexico",
    dedicated: "1983, December, 2",
    area: 116642,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
  },
  // Three additional temple objects
  {
    templeName: "Salt Lake",
    location: "Salt Lake City, Utah, United States",
    dedicated: "1893, April, 6",
    area: 253015,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/salt-lake-city-utah/400x250/salt-lake-temple-37762.jpg"
  },
  {
    templeName: "London England",
    location: "Newchapel, Surrey, England",
    dedicated: "1958, September, 7",
    area: 42652,
    imageUrl:
      "https://churchofjesuschristtemples.org/assets/img/temples/london-england-temple/london-england-temple-56886-main.jpg"
  },
  {
    templeName: "Accra Ghana",
    location: "Accra, Ghana",
    dedicated: "2004, January, 11",
    area: 17500,
    imageUrl:
      "https://churchofjesuschristtemples.org/assets/img/temples/accra-ghana-temple/accra-ghana-temple-13760-main.jpg"
  },
];

// ── Helper: extract the dedication year from "YYYY, Month, D" ────────────────
function getDedicationYear(dedicated) {
  return parseInt(dedicated.split(",")[0].trim(), 10);
}

// ── Create a single temple <figure> card element ─────────────────────────────
function createTempleCard(temple) {
  const figure = document.createElement("figure");

  const img = document.createElement("img");
  img.src = temple.imageUrl;
  img.alt = temple.templeName + " Temple";
  img.loading = "lazy";
  img.width = 400;
  img.height = 250;

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = temple.templeName;

  const details = document.createElement("ul");
  details.classList.add("card-details");

  const detailItems = [
    { label: "Location", value: temple.location },
    { label: "Dedicated", value: temple.dedicated },
    { label: "Area", value: temple.area.toLocaleString() + " sq ft" }
  ];

  detailItems.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.label}:</span> ${item.value}`;
    details.appendChild(li);
  });

  figure.appendChild(img);
  figure.appendChild(figcaption);
  figure.appendChild(details);

  return figure;
}

// ── Render a filtered or full list of temples into the gallery ────────────────
function displayTemples(filteredList) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  if (filteredList.length === 0) {
    const msg = document.createElement("p");
    msg.classList.add("no-results");
    msg.textContent = "No temples match this filter.";
    gallery.appendChild(msg);
    return;
  }

  filteredList.forEach(temple => {
    gallery.appendChild(createTempleCard(temple));
  });
}

// ── Filter logic ─────────────────────────────────────────────────────────────
function filterTemples(filter) {
  switch (filter) {
    case "old":
      // Built before 1900
      return temples.filter(t => getDedicationYear(t.dedicated) < 1900);
    case "new":
      // Built after 2000
      return temples.filter(t => getDedicationYear(t.dedicated) > 2000);
    case "large":
      // Larger than 90,000 sq ft
      return temples.filter(t => t.area > 90000);
    case "small":
      // Smaller than 10,000 sq ft
      return temples.filter(t => t.area < 10000);
    case "home":
    default:
      return temples;
  }
}

// ── Navigation: filter on link click ─────────────────────────────────────────
const navLinks = document.querySelectorAll(".navigation a");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Update active state
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    // Close mobile menu
    const navList = document.querySelector(".navigation");
    const hamButton = document.querySelector("#menu");
    navList.classList.remove("open");
    hamButton.classList.remove("open");
    hamButton.setAttribute("aria-expanded", false);

    // Filter and display
    const filter = link.getAttribute("data-filter");
    displayTemples(filterTemples(filter));
  });
});

// ── Hamburger menu toggle ─────────────────────────────────────────────────────
const hamButton = document.querySelector("#menu");
const navList = document.querySelector(".navigation");

if (hamButton && navList) {
  hamButton.addEventListener("click", () => {
    navList.classList.toggle("open");
    hamButton.classList.toggle("open");
    const isOpen = navList.classList.contains("open");
    hamButton.setAttribute("aria-expanded", isOpen);
  });
}

// ── Footer: dynamic copyright year and last modified date ────────────────────
const currentYearSpan = document.getElementById("currentYear");
const lastModifiedSpan = document.getElementById("lastModified");

if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}
if (lastModifiedSpan) {
  lastModifiedSpan.textContent = document.lastModified;
}

// ── Initial render: show all temples on page load ─────────────────────────────
displayTemples(temples);