import DomInjector from '../dom/dominjector';
import IFrameObserver from './iframeobserver';
import InjectedData from '../../models/InjectedData';
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
    const experienceUrl = this._getExperienceUrl();
    new DomInjector(experienceUrl, this.config.offset, this.config.button.alignment)
      .inject();

    const mediator = new InteractionDirector({
      button: this.config.button,
      panel: this.config.panel,
      prompts: this.config.prompts,
      hideDefaultButton: this.config.hideDefaultButton,
      iframeBackground: this.config.iframeBackground
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

  /**
   * Returns the experience URL with the referrer page URL set to the current URL
   *
   * @returns {string}
   */
  _getExperienceUrl() {
    const referrerPageUrl = window.location.href.split('?')[0].split('#')[0];
    const referrerPageUrlParam = '?referrerPageUrl=' + referrerPageUrl;
    return new InjectedData().getDomain() + '/'
      + this.config.experiencePath
      + referrerPageUrlParam;
  }
}
