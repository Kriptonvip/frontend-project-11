import parse from './parser';
import updater from './updater';

export default (url, state) => {
  parse(url).then((data) => {
    const { feed, posts } = data;
    state.feeds.unshift(feed);
    state.posts = [...posts, ...state.posts];
    state.status = 'success';
  })
    .then(() => {
      if (state.feeds.length === 1) {
        setTimeout(updater(state), 5000);
      }
    })
    .catch((err) => {
        console.log('AXIOS ERROR', err )
        console.log(err.isAxiosError)
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
