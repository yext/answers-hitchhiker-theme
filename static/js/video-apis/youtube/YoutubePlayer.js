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
        onStateChange: event => this.onStateChange(event)
      }
    });
    this.playerState = YT.PlayerState.UNSTARTED;
    this.onPlay = onPlay;
  }

  onStateChange({ data }) {
    const isPlayingVideo = this.videoIsPlayingForState(data);
    const wasAlreadyPlayingVideo = this.videoIsPlayingForState(this.playerState);
    if (isPlayingVideo && !wasAlreadyPlayingVideo) {
      this.onPlay();
    }
    this.playerState = data;
  }

  videoIsPlayingForState(playerState) {
    return [
      this.YT.PlayerState.PLAYING,
      this.YT.PlayerState.BUFFERING
    ].includes(playerState);
  }
}
