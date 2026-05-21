const DAYS = 6;
const LIMIT = 30;
let studentReport = [11, 42, 33, 64, 29, 37, 44];

// ── Task 1: for loop ──────────────────────────────────────────────────────────
console.log("--- for loop ---");
for (let i = 0; i < studentReport.length; i++) {
  if (studentReport[i] < LIMIT) {
    console.log(studentReport[i]);
  }
}

// ── Task 2: while loop ────────────────────────────────────────────────────────
console.log("--- while loop ---");
let i = 0;
while (i < studentReport.length) {
  if (studentReport[i] < LIMIT) {
    console.log(studentReport[i]);
  }
  i++;
}

// ── Task 3: forEach loop ──────────────────────────────────────────────────────
console.log("--- forEach loop ---");
studentReport.forEach(function (item) {
  if (item < LIMIT) {
    console.log(item);
  }
});

// ── Task 4: for...in loop ─────────────────────────────────────────────────────
console.log("--- for...in loop ---");
for (let index in studentReport) {
  if (studentReport[index] < LIMIT) {
    console.log(studentReport[index]);
  }
}

// ── Task 5: Next DAYS day names starting today ────────────────────────────────
// Uses a for loop to calculate and print the next 6 day names.
// Date.getDay() returns 0 (Sunday) through 6 (Saturday).
// I used the Intl.DateTimeFormat API to get the full weekday name automatically,
// which handles locale and avoids a hard-coded names array.

console.log(`--- Next ${DAYS} days starting today ---`);

const today = new Date();
const formatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });

for (let d = 0; d < DAYS; d++) {
  const futureDate = new Date(today);          // clone today's date
  futureDate.setDate(today.getDate() + d);     // advance by d days
  console.log(formatter.format(futureDate));   // e.g. "Thursday", "Friday" …
}

// ── Bonus: same day loop re-written with while (demonstrates a different loop) ─
console.log(`--- Next ${DAYS} days (while loop version) ---`);

let dayCount = 0;
while (dayCount < DAYS) {
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + dayCount);
  console.log(formatter.format(futureDate));
  dayCount++;
}
