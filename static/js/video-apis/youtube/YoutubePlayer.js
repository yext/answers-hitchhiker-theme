/**
 * Manages the state and interactions for an instance
 * of the Youtube Iframe player.
 */
export default class YoutubePlayer {
  /**
   * @param {YT} YT the youtube iframe api
   * @param {HTMLElement} el element to create the player for 
   * @param {Function} onPlay runs when the play button is hit
   */
  constructor(YT, el, onPlay) {
    this.YT = YT;
    this.player = new YT.Player(el, {
      events: {
        onStateChange: event => this.handleStateChange(event)
      }
    });
    this.playerState = YT.PlayerState.UNSTARTED;
    this.onPlay = onPlay;
  }

  /**
   * @param {Object} param0 
   * @param {PlayerState} param0.data
   */
   handleStateChange({ data }) {
    const isPlayingVideo = this.videoIsPlayingForState(data);
    const wasAlreadyPlayingVideo = this.videoIsPlayingForState(this.playerState);
    if (isPlayingVideo && !wasAlreadyPlayingVideo) {
      this.onPlay();
    }
    this.playerState = data;
  }

  /**
   * Whether the given player state has video playing.
   *
   * @param {PlayerState} playerState 
   * @returns {boolean}
   */
  videoIsPlayingForState(playerState) {
    return [
      this.YT.PlayerState.PLAYING,
      this.YT.PlayerState.BUFFERING
    ].includes(playerState);
  }
}
