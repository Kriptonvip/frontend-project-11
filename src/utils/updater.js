import { uniqueId } from 'lodash';
import parser from './parser';

const postsNormalize = (posts) => posts.map((post) => {
  post.id = uniqueId();
  post.linkClass = 'fw-bold';
  return post;
});

const iter = (state) => state.feeds.forEach((feed) => {
  parser(feed.url).then((data) => {
    if (data instanceof Error) {
      throw new Error(data);
    }
    const newPostsList = data.posts.filter((item) => {
      const { link } = item;
      const postsUrlList = state.posts.map((post) => post.link);
      return !postsUrlList.includes(link);
    });
    const postsWithId = postsNormalize(newPostsList);
    state.posts = [...postsWithId, ...state.posts];
  }).catch((error) => {
    console.log(`Updater error ${error}`);
  });
});

const updater = (state) => {
  new Promise(() => {
    iter(state);
  }).then(setTimeout(() => updater(state), 5000));
};

export { updater, postsNormalize };
