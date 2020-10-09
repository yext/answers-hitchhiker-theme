import DomInjector from './dominjector';
import IFrameObserver from './iframeobserver';
import InteractionDirector from './interactiondirector';
import OverlayConfig from './overlayconfig';
import ParentFrameObserver from './parentframeobserver';

/**
 * This class is responsible for creating and setting up the Overlay.
 */
export default class Overlay {
  constructor(config) {
    /**
     * @type {OverlayConfig}
     */
    this.config = config;

    /**
     * @type {InteractionDirector}
     */
    this.mediator = new InteractionDirector({
      button: this.config.button,
      panel: this.config.panel,
      prompts: this.config.prompts,
    });
  }

  /**
   * Creates the Overlay, adding the HTML elements and setting up any listeners on the
   * existing DOM, if needed.
   */
  create() {
    // Add Overlay to the DOM
    new DomInjector().inject();

    this._attachObservers();
  }

  /**
   * Sets up communication between iframe and parent frame.
   */
  _attachObservers() {
    new IFrameObserver(this.mediator, `#${Selectors.IFRAME_ID}`)
      .attach();
    new ParentFrameObserver(this.mediator, this.config.customSelector)
      .attach();
  }
}