
// DOM Events Activity: adds click event handling, delete functionality,
// input validation, and UI cleanup to the previous DOM manipulation activity.

const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list');

// ── Add Chapter button click event listener ───────────────────────────────────
button.addEventListener('click', function () {

  // .trim() removes leading and trailing whitespace before checking.
  if (input.value.trim() !== '') {

    // Element that will hold the chapter and delete button.
    const li = document.createElement('li');

    // The delete <button> element.
    const deleteButton = document.createElement('button');

    // This sets the li's text content to what the user typed.
    li.textContent = input.value;

    // This sets the delete button label and aria-label for accessibility.
    deleteButton.textContent = '❌';
    deleteButton.setAttribute('aria-label', `Remove ${input.value}`);

    li.append(deleteButton);

    list.append(li);

    // Adding a click event listener to the delete button (Event Delegation).
    // Each delete button gets its own listener as it is dynamically created.
    // When clicked, it removes its parent li from the list and returns focus.
    deleteButton.addEventListener('click', function () {
      list.removeChild(li);
      input.focus();
    });

    // This clears the input field so the UI is ready for the next entry.
    input.value = '';

    input.focus();
  }
});