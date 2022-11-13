import parser from './parser';
import postsNormalize from './postsNormalize';

const getLastUpdateTime = (state) => {
  const pubTimeList = state.posts.map((post) => post.pubDate);
  return Math.max(...pubTimeList);
};
const iter = (state) => state.feeds.forEach((feed) => {
  parser(feed.url).then((data) => {
    if (data instanceof Error) {
      throw new Error(data);
    }
    const postsArr = data.posts.filter((post) => {
      const postTime = new Date(post.pubDate).getTime();
      const lastUpdateTime = getLastUpdateTime(state);
      return postTime > lastUpdateTime;
    });
    const postsWithId = postsNormalize(postsArr);
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

export default updater;
