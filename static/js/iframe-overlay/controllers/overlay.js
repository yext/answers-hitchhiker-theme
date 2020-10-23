import DomInjector from '../dom/dominjector';
import IFrameObserver from './iframeobserver';
import InjectedData from '../../models/InjectedData';
import InteractionDirector from './interactiondirector';
import OverlayConfig from '../models/overlayconfig';
import ParentFrameObserver from './parentframeobserver';
import { InteractionTypes, Selectors } from '../constants';

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
    const domain = new InjectedData().getDomain();
    new DomInjector(domain, this.config.experiencePath, this.config.offset, this.config.alignment)
      .inject();

    const mediator = new InteractionDirector({
      iframeEl: document.querySelector(`#${Selectors.IFRAME_ID}`),
      buttonFrameEl: document.querySelector(`#${Selectors.BUTTON_FRAME_ID}`),
      hideButtonWhenCollapsed: this.config.hideDefaultButton,
      iframeBackground: this.config.iframeBackground
    });
    this._attachObservers(mediator);

    return mediator;
  }

  /**
   * Sets up communication between iframe and parent frame.
   */
  _attachObservers(mediator) {
    new IFrameObserver(mediator, `#${Selectors.BUTTON_FRAME_ID}`)
      .attach(InteractionTypes.BUTTON_CONNECTED, this.config.button);
    new IFrameObserver(mediator, `#${Selectors.IFRAME_ID}`)
      .attach(InteractionTypes.IFRAME_CONNECTED, {
        panel: this.config.panel,
        prompts: this.config.prompts,
      });
    new ParentFrameObserver(mediator, this.config.customSelector)
      .attach();
  }
}
