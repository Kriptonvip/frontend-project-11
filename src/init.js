import onChange from 'on-change';
import i18next from 'i18next';
import * as yup from 'yup';
import ru from './locales/ru.js';
import render from './view';
import parser from './utils/parser';
import updater from './utils/updater';

export default async () => {
  // создание экземпляра i18next
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'ru',
    resources: { ru },
  });

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };
    // Model
  const state = onChange({
    inputIsValid: null,
    feedsUrls: [],
    feeds: [],
    posts: [],
    inputValue: '',
  }, render(elements, i18nextInstance));

  // Controller
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const schema = yup.string()
      .url()
      .notOneOf(state.feedsUrls);
    const url = formData.get('url');
    state.inputValue = url;

    schema.isValid(url).then((valid) => {
      if (valid) {
        state.inputIsValid = true;
        state.feedsUrls.push(url);
        parser(url).then((data) => {
          state.feeds.unshift(data);
          state.posts = [...data.items, ...state.posts];
        }).then(() => {
          setTimeout(updater(state), 5000);
        });
      } else {
        state.inputIsValid = false;
      }
    });
    state.inputValue = '';
  });
};
