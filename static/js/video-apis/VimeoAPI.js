import Player from '@vimeo/player';

/**
 * Interacts with the Vimeo Player API.
 */
class VimeoAPI {
  /**
   * Adds a new Vimeo iframe player using the given element.
   *
   * @param {HTMLElement} el 
   * @param {Function} onPlay 
   */
  addPlayer(el, { onPlay }) {
    const player = new Player(el);
    player.on('play', () => {
      onPlay()
    });
  }
}

export default new VimeoAPI();
