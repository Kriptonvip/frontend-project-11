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
    return {
      title,
      link,
      description,
    };
  });
  return posts;
};

export default (response, url) => {
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
};
