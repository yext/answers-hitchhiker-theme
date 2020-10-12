import Overlay from './controllers/overlay';
import OverlayConfig from './models/overlayconfig';

/**
 * YextAnswersOverlay exposes an interface in order to create an iFrame'd overlay
 * Answers experience on a page.
 */
export default class YextAnswersOverlay {
  /**
   * Initializes the overlay, creating elements and displaying the Overlay on the page.
   *
   * @param {Object} config
   */
  static init(config) {
    const parsedConfig = new OverlayConfig(config);

    new Overlay(parsedConfig).create();
  }
}

global.YextAnswersOverlay = YextAnswersOverlay;
