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
const postsRender = (posts) => {
  const postsHtml = posts.map((post) => {
    const {
      linkClass, link, id, title,
    } = post;
    return (
      `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
        <a href="${link}" class="${linkClass}" data-id="${id}" target="_blank" rel="noopener noreferrer">
        ${title}
        </a>
        <button type="button" class="btn btn-outline-primary btn-sm" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>
      </li>`
    );
  }).join('');
  return `<div class="card-body">
      <h2 class="card-title h4">Посты</h2>
      </div>
      <ul class="list-group border-0 rounded-0">${postsHtml}</ul>`;
};

const formRender = (elements, value, i18next) => {
  elements.feedback.classList.remove('text-danger', 'text-success');
  switch (value) {
    case 'parsing':
    case 'notOneOf':
    case 'invalid':
    case 'network':
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = i18next.t(value);
      break;
    case 'success':
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18next.t(value);
      break;
    case 'failure':
      elements.feedback.classList.add('text-danger');
      break;
    default:
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = i18next.t('unknown');
  }
};

const modalRender = (elements, value) => {
  const {
    title, link, description, id,
  } = value;
  elements.modalTitle.textContent = title;
  elements.modalBody.textContent = description;
  elements.readFullPost.href = link;
  document.querySelector(`a[data-id="${id}"]`).classList.remove('fw-bold');
  document.querySelector(`a[data-id="${id}"]`).classList.add('fw-normal');
};
const render = (elements, i18next) => (path, value) => {
  switch (path) {
    case 'status':
    case 'error':
      if (value === 'done') {
        elements.input.readOnly = false;
        elements.formButton.disabled = false;
        elements.input.focus();
        elements.input.value = '';
      } else if (value === 'pending') {
        elements.input.readOnly = true;
        elements.formButton.disabled = true;
      } else {
        formRender(elements, value, i18next);
      }
      break;
    case 'feeds':
      elements.feeds.innerHTML = feedRender(value);
      break;
    case 'posts':
      elements.posts.innerHTML = postsRender(value);
      break;
    case 'UIState.currentPost':
      modalRender(elements, value);
      break;
    case path.match(/posts\.\d\.linkClass/).input:
      break;
    default:
      throw new Error(`Unknown path: ${path}`);
  }
};
export default render;
