import axios from 'axios';

const getProxyUrl = (url) => {
    const proxiedUrl = new URL('/get', 'https://allorigins.hexlet.app');
    proxiedUrl.searchParams.set('disableCache', 'true');
    proxiedUrl.searchParams.set('url', url);
    return proxiedUrl;
  };
  
  export default (url) => {
    const allOriginUrl = getProxyUrl(url);
    return axios({
      method: 'get',
      url: allOriginUrl,
      responseType: 'text',
    });
  };
