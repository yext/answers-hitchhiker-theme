import DomInjector from '../dom/dominjector';
import IFrameObserver from './iframeobserver';
import ActionDirector from './actiondirector';
import OverlayConfig from '../models/overlayconfig';
import ParentFrameObserver from './parentframeobserver';
import { Selectors } from '../constants';
import { ActionTypes } from '../../shared/constants';

/**
 * This class is responsible for creating and setting up the Overlay.
 */
export default class Overlay {
  constructor(config) {
    /**
     * @type {OverlayConfig}
     */
    this.config = config;
  }

  /**
   * Creates the Overlay, adding the HTML elements and setting up any listeners on the
   * existing DOM, if needed.
   *
   * @returns {ActionDirector}
   */
  create() {
    // Add Overlay to the DOM
    new DomInjector(
      this.config.domain,
      this.config.experiencePath,
      this.config.offset,
      this.config.alignment,
      this.config.button.backgroundColor
    ).inject();

    const mediator = new ActionDirector({
      iframeEl: document.querySelector(`#${Selectors.IFRAME_ID}`),
      buttonFrameEl: document.querySelector(`#${Selectors.BUTTON_FRAME_ID}`),
      shouldShowButton: !this.config.hideDefaultButton,
      iframeBackground: this.config.iframeBackground,
      alignment: this.config.alignment
    });
    this._attachObservers(mediator);

    return mediator;
  }

  /**
   * Sets up communication between iframe and parent frame.
   */
  _attachObservers(mediator) {
    new IFrameObserver(mediator, `#${Selectors.BUTTON_FRAME_ID}`)
      .attach(ActionTypes.BUTTON_CONNECTED, this.config.button);
    new IFrameObserver(mediator, `#${Selectors.IFRAME_ID}`)
      .attach(ActionTypes.IFRAME_CONNECTED, {
        panel: this.config.panel,
        prompts: this.config.prompts,
      });
    new ParentFrameObserver(mediator, this.config.customSelector)
      .attach();
  }
}
