/**
 * place.js — Ghana Country Page
 * Handles:
 *  1. Footer current year
 *  2. Footer last-modified date
 *  3. Wind chill calculation (metric / °C)
 */

"use strict";

/* ─── 1. FOOTER DATES ──────────────────────────────────────── */
const yearEl = document.getElementById("current-year");
const lastModifiedEl = document.getElementById("last-modified");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (lastModifiedEl) {
  const modified = new Date(document.lastModified);
  lastModifiedEl.textContent = modified.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/* ─── 2. WIND CHILL CALCULATION ────────────────────────────── */

/**
 * Calculate wind chill using the Environment Canada / WMO metric formula.
 * Valid for: temperature <= 10 °C  AND  wind speed > 4.8 km/h
 *
 * Formula (°C, km/h):
 *   WC = 13.12 + 0.6215·T − 11.37·V^0.16 + 0.3965·T·V^0.16
 *
 * @param {number} tempC      - Air temperature in degrees Celsius
 * @param {number} windKmh    - Wind speed in km/h
 * @returns {string}          - Wind chill in °C (rounded to one decimal)
 */
function calculateWindChill(tempC, windKmh) {
  return (13.12 + 0.6215 * tempC - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * tempC * Math.pow(windKmh, 0.16)).toFixed(1);
}

/* Static weather values that match what's displayed in the HTML */
const temperature = 32;   // °C
const windSpeed = 14;   // km/h

const windChillEl = document.getElementById("wind-chill");

if (windChillEl) {
  /* Only calculate if conditions are met */
  if (temperature <= 10 && windSpeed > 4.8) {
    const chill = calculateWindChill(temperature, windSpeed);
    windChillEl.textContent = `${chill} °C`;
  } else {
    /* Conditions not met — wind chill is not applicable */
    windChillEl.textContent = "N/A";
  }
}