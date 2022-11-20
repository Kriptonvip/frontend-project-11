import onChange from 'on-change';

const feedRender = (elements, feeds) => {
  elements.feeds.classList.remove('d-none');
  const feedsUl = elements.feeds.querySelector('#feedsUl');
  feedsUl.textContent = '';
  feeds.forEach((feed) => {
    const { title, description } = feed;
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3El = document.createElement('h3');
    h3El.classList.add('h6', 'm-0');
    h3El.textContent = title;
    const pEl = document.createElement('p');
    pEl.textContent = description;
    pEl.classList.add('m-0', 'small', 'text-black-50');
    liEl.append(h3El, pEl);
    feedsUl.append(liEl);
  });
};
const postsRender = (elements, posts, i18next, state) => {
  elements.posts.classList.remove('d-none');
  const postsUl = elements.posts.querySelector('#postsUl');
  postsUl.textContent = '';
  posts.forEach((post) => {
    const { link, id, title } = post;
    const isViewed = state.UIState.viewedPosts.has(post.id);
    const li = document.createElement('li');
    li.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'mb-3');
    const linkClass = isViewed ? 'fw-normal' : 'fw-bold';
    const linkEl = document.createElement('a');
    linkEl.classList.add(linkClass);
    linkEl.href = link;
    linkEl.textContent = title;
    linkEl.dataset.id = id;
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.setAttribute('type', 'button');
    button.textContent = i18next.t('viewData.preview');
    button.dataset.id = id;
    li.append(linkEl, button);
    postsUl.append(li);
  });
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
  } = value.currentPost;
  elements.modalTitle.textContent = title;
  elements.modalBody.textContent = description;
  elements.readFullPost.href = link;
  document.querySelector(`a[data-id="${id}"]`).classList.remove('fw-bold');
  document.querySelector(`a[data-id="${id}"]`).classList.add('fw-normal');
};

const createWatchedState = (state, elements, i18next) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'getingDataStatus':
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
        feedRender(elements, value);
        break;
      case 'posts':
        postsRender(elements, value, i18next, state);
        break;
      case 'UIState':
        modalRender(elements, value);
        break;
      default:
        throw new Error(`Unknown path: ${path}`);
    }
  });
  return watchedState;
};

export default createWatchedState;
