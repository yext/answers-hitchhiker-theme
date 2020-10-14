import { ActionTypes } from './constants';
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
  init(config) {
    const parsedConfig = new OverlayConfig(config);

    this.overlayMediator = new Overlay(parsedConfig)
      .create();
  }

  /**
   * Forces the Overlay to expand
   */
  expand() {
    if (!this.overlayMediator) {
      console.warn('Cannot expand AnswersOverlay until it has been initialized.');
      return;
    }
    this.overlayMediator.forceExpand();
  }

  /**
   * Forces the Overlay to collapse
   */
  collapse() {
    if (!this.overlayMediator) {
      console.warn('Cannot collapse AnswersOverlay until it has been initialized.');
      return;
    }
    this.overlayMediator.forceCollapse();
  }

  /**
   * This function can be used to add a callback to an action on the Overlay.
   *
   * @param {ActionTypes} actionType
   * @param {function} callback
   */
  on(actionType, callback) {
    if (!this.overlayMediator) {
      console.warn('Cannot add callback to AnswersOverlay until it has been initialized.');
      return;
    }

    this.overlayMediator.addCallback(actionType, callback);
  }
}

global.YextAnswersOverlay = new YextAnswersOverlay();
