import { uniqueId } from 'lodash';

export default (posts) => posts.map((post) => {
  post.id = uniqueId();
  post.linkClass = 'fw-bold';
  return post;
});
