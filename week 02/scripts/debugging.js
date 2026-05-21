// The original code contained four bugs. Each one is documented below with
// the type of error it represents and how it was fixed.
// ─────────────────────────────────────────────────────────────────────────────

// BUG 1 — Runtime Error
// Original:  document.querySelector('area')
// Problem:   'area' matches the HTML <area> element tag, not our #area span.
//            querySelector found nothing, so areaOutput was null and later
//            assignments to areaOutput.textContent would throw a TypeError.
// Fix:       Use '#area' (ID selector) to target the correct <span> element,
//            matching the same pattern used for radiusOutput above it.
const radiusOutput = document.getElementById('radius');
const areaOutput = document.querySelector('#area');

// BUG 2 — Syntax Error
// Original:  const PI == 3.14159;
// Problem:   == is a comparison operator, not an assignment operator.
//            This causes a SyntaxError and prevents the entire script from
//            running at all.
// Fix:       Use a single = to assign the value.
let area = 0;
const PI = 3.14159;

// First calculation — radius 10
const radius = 10;
area = PI * radius * radius;

// BUG 3 — Runtime Error (TypeError: Assignment to constant variable)
// Original:  radiusOutput = radius;
// Problem:   radiusOutput is a DOM element reference stored in a const.
//            Assigning a new value directly to it tries to overwrite the
//            const binding, which throws a TypeError at runtime.
// Fix:       Write to the .textContent property of the element instead,
//            which updates what is displayed on the page without touching
//            the const binding itself. Same fix applied to areaOutput.
radiusOutput.textContent = radius;
areaOutput.textContent = area;

// Second calculation — radius 20
// BUG 4 — Runtime Error (TypeError: Assignment to constant variable)
// Original:  radius = 20;
// Problem:   radius was declared with const, so it cannot be reassigned.
//            This throws a TypeError at runtime.
// Fix:       Declare a new variable with let so it can hold a different value,
//            or use a separate variable name. Here we use let for the second
//            radius value so both calculations can coexist independently.
let radius2 = 20;
area = PI * radius2 * radius2;
radiusOutput.textContent = radius2;
areaOutput.textContent = area;