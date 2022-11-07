import axios from 'axios';

export default (url) => {
  const allOriginUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;
  const result = axios({
    method: 'get',
    url: allOriginUrl,
    responseType: 'stream',
  })
    .then((response) => {
      const data = JSON.parse(response.data).contents;
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'application/xml');
      const feedName = doc.querySelector('title').textContent;
      const description = doc.querySelector('description').textContent;
      const items = doc.querySelectorAll('item');
      const posts = Array.from(items).map((item) => {
        const title = item.querySelector('title').textContent;
        const link = item.querySelector('link').textContent;
        const guid = item.querySelector('guid').textContent;
        const description = item.querySelector('description').textContent;
        return {
          title,
          link,
          guid,
          description,
        };
      });
      const feed = {
        title: feedName,
        description,
        items: posts,
      };
      return feed;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
};
