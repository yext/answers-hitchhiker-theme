import { ExternalActionTypes } from './constants';
import Overlay from './controllers/overlay';
import OverlayConfig from './models/overlayconfig';
import ConfigValidator from './validation/configvalidator';

/**
 * YextAnswersOverlay exposes an interface in order to create an iFrame'd overlay
 * Answers experience on a page.
 */
export default class YextAnswersOverlay {
  constructor(config) {
    if (this._isInitialized()) {
      console.warn('AnswersOverlay has already been initialized on this page, exiting.');
      return;
    }

    new ConfigValidator(config).validate()
    const parsedConfig = new OverlayConfig(config);

    this.overlayMediator = new Overlay(parsedConfig)
      .create();
  }

  /**
   * Expands the Overlay
   */
  expand() {
    this._isInitialized() && this.overlayMediator.expand();
  }

  /**
   * Collapses the Overlay
   */
  collapse() {
    this._isInitialized() && this.overlayMediator.collapse();
  }

  /**
   * This function can be used to add a callback to an action on the Overlay.
   *
   * @param {ExternalActionTypes} actionType
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

if (!global.YxtAnswersOverlay) {
  global.YxtAnswersOverlay = new YextAnswersOverlay(window.YxtAnswersOverlaySettings);
}
