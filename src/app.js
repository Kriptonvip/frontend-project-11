import onChange from 'on-change';
import i18next from 'i18next';
import * as yup from 'yup';
import ru from './locales/ru';
import render from './view';
import addNewChannel from './utils/addNewChannel';
import { updater } from './utils/updater';

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

  const state = onChange({
    status: null,
    feeds: [],
    posts: [],
    error: null,
    UIState: { currentPost: null },
  }, render(elements, i18nextInstance));

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
    state.status = 'pending';
    const formData = new FormData(e.target);
    const urls = state.feeds.map((feed) => feed.url);
    const schema = yup.string().required().url().notOneOf(urls);
    const url = formData.get('url');
    schema.validate(url).then((value) => {
      addNewChannel(value, state);
    })
      .catch((err) => {
        const { errors } = err;
        [state.error] = errors;
        state.status = 'done';
      });
  });
  elements.posts.addEventListener('click', (e) => {
    if (e.target.type === 'button') {
      const { id } = e.target.dataset;
      const currentPostIndex = state.posts.findIndex((post) => post.id === id);
      state.UIState.currentPost = state.posts[currentPostIndex];
      state.posts[currentPostIndex].linkClass = 'fw-normal';
    }
  });
  updater(state);
};
