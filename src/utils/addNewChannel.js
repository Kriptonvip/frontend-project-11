import parse from './parser';
import { postsNormalize } from '../app';

export default (url, state) => {
  parse(url).then((data) => {
    const { feed, posts } = data;
    state.feeds.unshift(feed);
    const postsWithId = postsNormalize(posts);
    state.posts = [...postsWithId, ...state.posts];
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
