import axios from 'axios';
import { uniqueId } from 'lodash';
import parser from './parser';

const addPosts = (posts, state) => {
  const newPosts = posts.map((post) => {
    post.id = uniqueId();
    post.isViewed = false;
    return post;
  });
  state.posts = [...newPosts, ...state.posts];
};

const getProxyUrl = (url) => {
  const proxiedUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxiedUrl.searchParams.set('disableCache', 'true');
  proxiedUrl.searchParams.set('url', url);
  return proxiedUrl;
};
const getData = (url) => {
  const allOriginUrl = getProxyUrl(url);
  return axios({
    method: 'get',
    url: allOriginUrl,
    responseType: 'text',
  }).then((response) => parser(response, url));
};

const addNewFeed = (url, state) => {
  getData(url).then((data) => {
    const { feed, posts } = data;
    state.feeds.unshift(feed);
    addPosts(posts, state);
    state.getingDataStatus = 'success';
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
      state.getingDataStatus = 'done';
    });
};

export const updater = (state) => {
  const promises = state.feeds.map((feed) => getData(feed.url));
  const promise = Promise.all(promises);
  promise.then((contents) => {
    contents.forEach((data) => {
      const newPostsList = data.posts.filter((item) => {
        const { link } = item;
        const postsUrlList = state.posts.map((post) => post.link);
        return !postsUrlList.includes(link);
      });
      addPosts(newPostsList, state);
    });
  });

  setTimeout(() => updater(state), 5000);
};

export default addNewFeed;
