import axios from 'axios';

const getProxyUrl = (url) => {
  const proxiedUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxiedUrl.searchParams.set('disableCache', 'true');
  proxiedUrl.searchParams.set('url', url);
  return proxiedUrl;
};

const getResponse = (url) => {
  const allOriginUrl = getProxyUrl(url);
  return axios({
    method: 'get',
    url: allOriginUrl,
    responseType: 'text',
  });
};
const getFeedDescriptoin = (doc) => {
  const feedName = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  return { title: feedName, description };
};

const getPosts = (doc) => {
  const items = doc.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    const pubDate = item.querySelector('pubDate').textContent;
    return {
      title,
      link,
      description,
      // pubDate: new Date(pubDate).getTime(),
    };
  });
  return posts;
};

export default (url) => getResponse(url).then((response) => {
  const data = JSON.parse(response.data).contents;
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  if (doc.querySelector('parsererror')) {
    const error = new Error();
    error.isParsingError = true;
    throw error;
  }
  const posts = getPosts(doc);
  const feed = getFeedDescriptoin(doc);
  feed.url = url;

  return { feed, posts };
});
