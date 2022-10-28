import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
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
    feeds: [],
    posts: [],
    inputValue: '',

  }, render(elements, i18nextInstance));

  // Controller

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const schema = yup.string()
      .url()
      .notOneOf(state.feeds);
    const url = formData.get('url');
    state.inputValue = url;
    const allOriginUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;
    axios({
      method: 'get',
      url: allOriginUrl,
      responseType: 'stream',
    })
      .then((response) => {
        const data = JSON.parse(response.data).contents;
        const parser = new DOMParser();
        const doc1 = parser.parseFromString(data, 'application/xml');
        console.log(doc1);
        const posts = doc1.querySelectorAll('item');
        const titles = doc1.querySelectorAll('title');
        console.log(posts, titles);
      })
      .catch((error) => {
        console.log(error);
      });
    schema.isValid(url).then(((valid) => {
      // valid ? (state.inputIsValid = true, state.feeds.push(url)) : state.inputIsValid = false;
      if (valid) {
        state.inputIsValid = true;
        state.feeds.push(url);
      } else {
        state.inputIsValid = false;
      }
    }));
    state.inputValue = '';
  });
};
