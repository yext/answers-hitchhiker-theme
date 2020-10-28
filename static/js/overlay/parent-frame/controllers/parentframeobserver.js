import { InteractionTypes } from '../../constants';
import InteractionDirector from './interactiondirector';

/**
 * ParentFrameObserver observes the parent frame and notifies its mediator whenever
 * an interaction occurs that affects the Overlay.
 */
export default class ParentFrameObserver {
  constructor(mediator, customButtonSelector) {
    /**
     * @type {InteractionDirector}
     */
    this.mediator = mediator;

    /**
     * @type {Element}
     */
    this.customButtonEl = customButtonSelector &&
      document.querySelector(customButtonSelector);
  }

  /**
   * Attaches event listeners to elements in the parent frame that affect the Overlay.
   */
  attach() {
    this.customButtonEl && this._initCustomButton();
    this._initGenericClickListener();
  }

  /**
   * Adds event listener to collapse the overlay on parent frame clicks that are outside
   * the custom button element, if provided. (By definition, these click events will not
   * include clicks within any child iframes.)
   *
   * @param {Element} customButtonEl
   */
  _initGenericClickListener() {
    window.addEventListener('click', (e) => {
      const isButtonClick = this.customButtonEl && this.customButtonEl.contains(e.target);

      if (!isButtonClick) {
        this.mediator.onInteraction(InteractionTypes.COLLAPSE);
      }
    });
  }

  /**
   * Adds event listener to the custom button element, if provided, so the custom
   * button can trigger overlay collapsing and expanding.
   */
  _initCustomButton() {
    this.customButtonEl.addEventListener('click', () => {
      this.mediator.onInteraction(InteractionTypes.TOGGLE_OVERLAY);
    });
  }
}