import onChange from 'on-change';
import i18next from 'i18next';
// import axios from 'axios';
import * as yup from 'yup';
import ru from './locales/ru.js';
import render from './view';

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
  };
    // Model
  const state = onChange({
    inputIsValid: null,
    rssUrls: [],
    inputValue: '',
  }, render(elements, i18nextInstance));

  // Controller

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const schema = yup.string()
      .url()
      .notOneOf(state.rssUrls);
    const url = formData.get('url');
    state.inputValue = url;
    if (await schema.isValid(url)) {
      state.inputIsValid = true;
      state.rssUrls.push(url);
    } else {
      state.inputIsValid = false;
    }
    state.inputValue = '';
  });
};
