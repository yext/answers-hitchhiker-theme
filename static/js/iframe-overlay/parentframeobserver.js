import { InteractionTypes } from "./constants";
import InteractionDirector from "./interactiondirector";

export default class ParentFrameObserver {
  /**
   *
   * @param {OverlayConfig} config
   */
  constructor(mediator, customButtonSelector) {
    /**
     * @type {InteractionDirector}
     */
    this.mediator = mediator;

    /**
     * @type {String}
     */
    this.customButtonEl = customButtonSelector &&
      document.querySelector(customButtonSelector);
  }

  /**
   * Adds event listeners for elements in the parent frame that affect the overlay.
   */
  attach() {
    this.customButtonEl && this._initCustomButton();
    this._initGenericClickListener();
  }

  /**
   * Adds event listener to collapse the overlay on parent frame clicks that are outside
   * the custom button element, if provided. (By definition, these click targets are
   * are outside any child iFrames.)
   *
   * @param {Element} customButtonEl
   */
  _initGenericClickListener() {
    window.addEventListener('click', (e) => {
      const isButtonClick = this.customButtonEl && this.customButtonEl.contains(e.target);

      if (!isButtonClick) {
        this.mediator.onParentFrameChanged(InteractionTypes.COLLAPSE);
      }
    });
  }

  /**
   * Adds event listener to the custom button element, if provided, so the custom
   * button can trigger overlay collapsing and expanding.
   */
  _initCustomButton() {
    this.customButtonEl.addEventListener('click', () => {
      this.mediator.onParentFrameChanged(InteractionTypes.TOGGLE);
    });
  }
}