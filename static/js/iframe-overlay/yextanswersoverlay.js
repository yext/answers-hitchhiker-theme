import OverlayConfig from "./overlayconfig";

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

    // TODO (agrow) Initialize Overlay (will do this in a later PR)
  }
}

global.YextAnswersOverlay = YextAnswersOverlay;
