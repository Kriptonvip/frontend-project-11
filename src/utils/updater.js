import parser from './parser';

const getLastUpdateTime = (state) => {
  const pubTimeArr = state.posts.map((post) => post.pubDate);
  return Math.max(...pubTimeArr);
};
const iter = (state) => state.feeds.forEach((feed) => {
  parser(feed.url).then((data) => {
    const postsArr = data.items.filter((post) => {
      const postTime = new Date(post.pubDate).getTime();
      const LastUpdateTime = getLastUpdateTime(state);
      return postTime > LastUpdateTime;
    });
    state.posts = [...postsArr, ...state.posts];
  });
});

const updater = (state) => {
  new Promise((resolve) => {
    iter(state);
    resolve();
  }).then(setTimeout(() => updater(state), 5000));
};

export default updater;
