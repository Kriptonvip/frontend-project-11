const feedRender = (feeds) => {
  const feedsHtml = feeds.map((feed) => `
  <li class="list-group-item border-0 border-end-0">
  <h3 class="h6 m-0">${feed.title}</h3>
  <p class="m-0 small text-black-50">${feed.description}</p>
  </li>`).join('');
  return `<div class="card border-0">
            <div class="card-body">
                <h2 class="card-title h4">Фиды</h2>
            </div>
            <ul class="list-group border-0 rounded-0">
                ${feedsHtml}
            </ul>
        </div>`;
};
const postsRender = (feeds) => {
  const postsHtml = feeds.map((feed) => feed.items.map((post) => `
      <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
        <a href="${post.link}" class="fw-bold" data-id="12" target="_blank" rel="noopener noreferrer">
        ${post.title}
        </a>
        <button type="button" class="btn btn-outline-primary btn-sm" data-id="12" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button></li>`).join('')).join('');
  return `<div class="card-body">
      <h2 class="card-title h4">Посты</h2>
      </div>
      <ul class="list-group border-0 rounded-0">${postsHtml}</ul>`;
};
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
    case 'feedsUrls':
      elements.input.focus();
      elements.input.value = '';
      break;
    case 'feeds':
      elements.feeds.innerHTML = feedRender(value);
      elements.posts.innerHTML = postsRender(value);
      break;
    default:
      throw new Error(`Unknown path: ${path}`);
  }
};
export default render;
