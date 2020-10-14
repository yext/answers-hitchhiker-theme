import DomInjector from '../dom/dominjector';
import IFrameObserver from './iframeobserver';
import InteractionDirector from './interactiondirector';
import OverlayConfig from '../models/overlayconfig';
import ParentFrameObserver from './parentframeobserver';
import { Selectors } from '../constants';

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
   * @returns {InteractionDirector}
   */
  create() {
    // Add Overlay to the DOM
    new DomInjector(this.config.experiencePath, this.config.offset).inject();

    const mediator = new InteractionDirector({
      button: this.config.button,
      panel: this.config.panel,
      prompts: this.config.prompts,
      hideDefaultButton: this.config.hideDefaultButton
    });
    this._attachObservers(mediator);

    return mediator;
  }

  /**
   * Sets up communication between iframe and parent frame.
   */
  _attachObservers(mediator) {
    new IFrameObserver(mediator, `#${Selectors.IFRAME_ID}`)
      .attach();
    new ParentFrameObserver(mediator, this.config.customSelector)
      .attach();
  }
}
