import YoutubeAPI from './YoutubeAPI';

/**
 * Loads the youtube iframe_api.
 */
function loadYoutubeIframeAPI() {
  return new Promise(resolve => {
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  });
}

const youtubeApiPromise =
  loadYoutubeIframeAPI().then(YT => new YoutubeAPI(YT));
export default youtubeApiPromise;