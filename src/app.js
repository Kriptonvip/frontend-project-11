import onChange from 'on-change';
import i18next from 'i18next';
import * as yup from 'yup';
import { uniqueId } from 'lodash';
import ru from './locales/ru';
import render from './view';
import parser from './utils/parser';

const addPosts = (posts, state) => {
  const newPosts = posts.map((post) => {
    post.id = uniqueId();
    post.isViewed = false;
    return post;
  });
  const markViwedPosts = state.posts.map((post) => {
    post.isViewed = state.UIState.viewedPosts.has(post.id);
    return post;
  });
  state.posts = [...newPosts, ...markViwedPosts];
};

const addNewFeed = (url, state) => {
  parser(url).then((data) => {
    const { feed, posts } = data;
    state.feeds.unshift(feed);
    addPosts(posts, state);
    state.status = 'success';
  })
    .catch((err) => {
      if (err.isAxiosError) {
        state.error = 'network';
      } else if (err.isParsingError) {
        state.error = 'parsing';
      } else {
        state.error = 'unknown';
      }
      state.error = 'failure';
    })
    .finally(() => {
      state.status = 'done';
    });
};

const updateIter = (state) => state.feeds.forEach((feed) => {
  parser(feed.url).then((data) => {
    if (data instanceof Error) {
      throw new Error(data);
    }
    const newPostsList = data.posts.filter((item) => {
      const { link } = item;
      const postsUrlList = state.posts.map((post) => post.link);
      return !postsUrlList.includes(link);
    });
    addPosts(newPostsList, state);
  }).catch((error) => {
    console.log(`Updater error ${error}`);
  });
});

const updater = (state) => {
  new Promise(() => {
    updateIter(state);
  }).then(setTimeout(() => updater(state), 5000));
};

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
    UIState: { currentPost: null, viewedPosts: new Set() },
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
      addNewFeed(value, state);
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
      state.UIState.viewedPosts.add(id);
    }
  });
  updater(state);
};
