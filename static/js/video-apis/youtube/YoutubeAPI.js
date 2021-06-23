import YoutubePlayer from './YoutubePlayer';

/**
 * Interacts with the Youtube Iframe API.
 * See https://developers.google.com/youtube/iframe_api_reference
 */
export default class YoutubeAPI {
  /**
   * @param {YT} YT the youtube iframe api
   */
  constructor(YT) {
    this.YT = YT;
  }

  /**
   * Adds a new YT iframe player using the given element.
   *
   * @param {HTMLElement} el
   * @param {Object} param1
   * @param {Function} param1.onPlay
   */
  addPlayer(el, { onPlay }) {
    new YoutubePlayer(this.YT, el, onPlay);
  }
}
