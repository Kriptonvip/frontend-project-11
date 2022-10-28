const render = (elements, i18nextInstance) => (path, value) => {
  console.log('elements', elements);
  console.log('path', path);
  console.log('value', value);
  switch (path) {
    case 'inputIsValid':
      elements.feedback.classList.remove('text-danger', 'text-success');
      if (value) {
        elements.feedback.classList.add('text-success');
        elements.feedback.textContent = i18nextInstance.t('sucsess');
      } else {
        elements.feedback.classList.add('text-danger');
        elements.feedback.textContent = i18nextInstance.t('validateErrors');
      }
      break;
    case 'inputValue':
    case 'feeds':
      elements.input.focus();
      elements.input.value = '';
      break;
    default:
      throw new Error(`Unknown path: ${path}`);
  }
  console.log(path);
};
export default render;
