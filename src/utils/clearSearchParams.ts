export const clearAllParams = () => {
  const url = new URL(window.location.href);
  url.search = "";
  window.history.replaceState({}, "", url);
};
