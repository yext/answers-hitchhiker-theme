import { ActionTypes } from './constants';
import Overlay from './controllers/overlay';
import OverlayConfig from './models/overlayconfig';
import ConfigValidator from './validation/configvalidator';

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
    new ConfigValidator(config).validate()
    const parsedConfig = new OverlayConfig(config);

    this.overlayMediator = new Overlay(parsedConfig)
      .create();
  }

  /**
   * Forces the Overlay to expand
   */
  expand() {
    this._isInitialized() && this.overlayMediator.forceExpand();
  }

  /**
   * Forces the Overlay to collapse
   */
  collapse() {
    this._isInitialized() && this.overlayMediator.forceCollapse();
  }

  /**
   * This function can be used to add a callback to an action on the Overlay.
   *
   * @param {ActionTypes} actionType
   * @param {function} callback
   */
  on(actionType, callback) {
    this._isInitialized() && this.overlayMediator.addCallback(actionType, callback);
  }

  /**
   * Returns a boolean indicating whether the AnswersOverlay has been initialized.
   *
   * @private
   * @returns {boolean}
   */
  _isInitialized() {
    return !!this.overlayMediator;
  }
}

global.YextAnswersOverlay = new YextAnswersOverlay();
