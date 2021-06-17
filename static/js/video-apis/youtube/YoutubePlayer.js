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
    this.player = new YT.Player(el, {
      events: {
        onStateChange: event => this.onStateChange(event)
      }
    });
    this.playerState = YT.PlayerState.UNSTARTED;
    this.onPlay = onPlay;
  }

  onStateChange({ data }) {
    const isPlaying = data === YT.PlayerState.PLAYING;
    if (isPlaying && this.playerState !== YT.PlayerState.PLAYING) {
      this.onPlay();
    }
    this.playerState = data;
  }
}
