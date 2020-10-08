import OverlayConfig from "./overlayconfig";
import OverlayMediator from "./overlaymediator";

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

    // TODO (agrow) inject overlay

    // Set up communication between iframe and parent frame
    const overlayMediator = new OverlayMediator(parsedConfig)
      .init();

  }
}

global.YextAnswersOverlay = YextAnswersOverlay;
