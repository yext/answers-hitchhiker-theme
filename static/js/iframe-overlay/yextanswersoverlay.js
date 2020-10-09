import OverlayConfig from "./overlayconfig";
import InteractionDirector from "./interactiondirector";
import ParentFrameObserver from "./parentframeobserver";
import Overlay from "./overlay";

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
