export default (id, state) => {
  const currentPostIndex = state.posts.findIndex((post) => post.id === id);
  state.UIState.currentPost = state.posts[currentPostIndex];
  state.posts[currentPostIndex].linkClass = 'fw-normal';
};
