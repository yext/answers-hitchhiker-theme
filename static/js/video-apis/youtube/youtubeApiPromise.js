import YoutubeAPI from './YoutubeAPI';

/**
 * Loads the youtube iframe_api, and when
 * the API is ready wraps it with YoutubeAPI.
 *
 * @type {Promise<YoutubeAPI>}
 */
export default new Promise(resolve => {
  window.onYouTubeIframeAPIReady = () => {
    const youtubeAPI = new YoutubeAPI(window.YT);
    resolve(youtubeAPI);
  };
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

