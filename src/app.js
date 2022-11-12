import onChange from 'on-change';
import i18next from 'i18next';
import * as yup from 'yup';
import ru from './locales/ru';
import render from './view';
import addNewChannel from './utils/addNewChannel';
import writeToModal from './utils/modal';

export default async () => {
  // создание экземпляра i18next
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
    // Model
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
  // Controller
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
        // console.log('ERRORS schema', err);
        state.status = 'done';
      });
  });
  elements.posts.addEventListener('click', (e) => {
    if (e.target.type === 'button') {
      const { id } = e.target.dataset;
      writeToModal(id, state);
    }
  });
};
