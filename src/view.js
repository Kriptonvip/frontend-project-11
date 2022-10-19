const render = (elements, i18nextInstance) => (path, value) => {
  switch (path) {
    case 'inputIsValid':
      if (value) {
        elements.feedback.classList.remove('text-danger');
        elements.feedback.classList.add('text-success');
        elements.feedback.textContent = i18nextInstance.t('sucsess');
      } else {
        elements.feedback.classList.remove('text-success');
        elements.feedback.classList.add('text-danger');
        elements.feedback.textContent = i18nextInstance.t('validateErrors');
      }
      break;
    case 'inputValue':
      elements.input.focus();
      elements.input.value = '';
      break;
    case 'rssUrls':
      elements.input.focus();
      elements.input.value = '';
      break;
    default:
      throw new Error(`Unknown path: ${path}`);
  }
  console.log(path);
};
export default render;
