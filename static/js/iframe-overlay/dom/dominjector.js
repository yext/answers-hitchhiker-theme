import { Selectors } from '../constants';

/**
 * DomInjector is responsible for injecting the elements for the Overlay into the
 * document.
 */
export default class DomInjector {
  constructor(experienceUrl, offset) {
    /**
     * @type {string}
     */
    this.experienceUrl = experienceUrl;

    /**
     * @type {string}
     */
    this.verticalOffset = offset.vertical;

    /**
     * @type {string}
     */
    this.horizontalOffset = offset.horizontal;
  }

  /**
   * Injects the Overlay elements into the DOM.
   */
  inject() {
    this._injectHTML();
    this._injectStyling();
  }

  /**
   * Injects HTML elements for the iframe into the DOM
   */
  _injectHTML () {
    // Create iframe container
    const iframeContainerEl = document.createElement('div');
    iframeContainerEl.id = Selectors.IFRAME_CONTAINER_ID;
    iframeContainerEl.classList.add('initial');
    document.body.appendChild(iframeContainerEl);

    // Create iframe
    const iframeEl = document.createElement('iframe');
    iframeEl.id = Selectors.IFRAME_ID;
    iframeEl.src = this.experienceUrl;
    iframeEl.name = 'fromOverlay';
    iframeContainerEl.appendChild(iframeEl);
  }

  /**
   * Injects a CSS stylesheet for the iframe into the DOM
   */
  _injectStyling() {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = this._getStyling();
    document.head.appendChild(styleSheet);
  }

  /**
   * @returns {string} a CSS ruleset containing the base styling for the iframe.
   */
  _getStyling() {
    return `
      #${Selectors.IFRAME_CONTAINER_ID} {
        position: fixed;
        z-index: 1000000;
        opacity: 1;
        transform: translate(${this.horizontalOffset}, ${this.verticalOffset});
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
      }

      #${Selectors.IFRAME_CONTAINER_ID}.initial {
        z-index: -1;
        opacity: 0;
        height: 100%;
        width: 450px;
      }

      #${Selectors.IFRAME_ID} {
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        min-height: 0px;
        border: none;
        margin: 0px;
        padding: 0px;
      }`;
  }
}
