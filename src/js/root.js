const hintField = document.querySelector('.hint-field');
const hintText = document.querySelector('.hint-field .hint');

function notify({ type = '', message = '' }) {
  if (hintField.classList.length === 1) {
    hintText.textContent = message;
    if (type === 'success') {
      hintText.classList.add('hint_success');
      hintField.classList.add('hint-field_visible');
      setTimeout(function () {
        hintField.classList.remove('hint-field_visible');
        hintText.classList.remove('hint_success');
      }, 1e3);
    } else {
      hintText.classList.add('hint_error');
      hintField.classList.add('hint-field_visible');
      setTimeout(function () {
        hintField.classList.remove('hint-field_visible');
        hintText.classList.remove('hint_error');
      }, 1e3);
    }
  }
}
