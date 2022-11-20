import i18next from 'i18next';
import * as yup from 'yup';

import ru from './locales/ru';
import createWatchedState from './view';
import addNewFeed, { updater } from './utils/getData';

export default async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'ru',
    resources: { ru },
  });

  const elements = {
    form: document.querySelector('.rss-form'),
    formButton: document.querySelector('.rss-form button'),
    input: document.getElementById('url-input'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    readFullPost: document.querySelector('.full-article'),
  };

  const state = {
    getingDataStatus: 'stoped',
    feeds: [],
    posts: [],
    error: null,
    UIState: { currentPost: null, viewedPosts: new Set() },
  };

  const watchedState = createWatchedState(state, elements, i18nextInstance);
  yup.setLocale({
    mixed: {
      required: () => 'required',
      notOneOf: () => 'notOneOf',
    },
    string: {
      url: () => 'invalid',
    },
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    watchedState.getingDataStatus = 'pending';
    const formData = new FormData(e.target);
    const urls = watchedState.feeds.map((feed) => feed.url);
    const schema = yup.string().required().url().notOneOf(urls);
    const url = formData.get('url');
    schema.validate(url).then((value) => {
      addNewFeed(value, watchedState);
    })
      .catch((err) => {
        const { errors } = err;
        [watchedState.error] = errors;
        watchedState.getingDataStatus = 'done';
      });
  });
  elements.posts.addEventListener('click', (e) => {
    if (e.target.type === 'button') {
      const { id } = e.target.dataset;
      const currentPostIndex = watchedState.posts.findIndex((post) => post.id === id);
      const viewedPosts = new Set([...watchedState.UIState.viewedPosts]).add(id);
      const currentPost = watchedState.posts[currentPostIndex];
      watchedState.UIState = { currentPost, viewedPosts };
    }
  });
  updater(watchedState);
};
