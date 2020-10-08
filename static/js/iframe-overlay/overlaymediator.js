require('iframe-resizer');

import Expando from './expando';
import OverlayConfig from './overlayconfig';
import { Selectors } from './constants';

/**
 * OverlayMediator is responsible for the communication between the parent
 * frame and the child iframe.
 */
export default class OverlayMediator {
  constructor(config) {
    /**
     * @type {OverlayConfig}
     */
    this.config = config;

    /**
     * @type {Element}
     */
    this.iframeWrapperEl = document.querySelector(`#${Selectors.iframeWrapperId}`);

    /**
     * @type {Element}
     */
    this.iframeEl = document.querySelector(`#${Selectors.iframeId}`);

    /**
     * @type {Expando}
     */
    this.expando = new Expando(this.iframeEl, this.iframeWrapperEl);
  }

  init() {
    this._beginCommunicationWithIFrame();
    this._createEventListenersOnParentFrame();
    return this;
  }

  forceCollapse() {
    if (!this.expando.isExpanded()) {
      return;
    }

    this._sendMessageToIFrame({ type: 'collapse' });
    this.expando.collapse();
  }

  forceExpand() {
    if (this.expando.isExpanded()) {
      return;
    }

    this._sendMessageToIFrame({ type: 'expand' });
    this.expando.expand();
  }

  _beginCommunicationWithIFrame() {
    iFrameResize({
      checkOrigin: false,
      sizeHeight: false,
      autoResize: false,
      scrolling: true,
      onInit: () => {
        this._sendMessageToIFrame(this._getIFrameConfig());
      },
      onMessage: (messageData) => {
        if (!messageData.message) {
          return;
        }

        switch (messageData.message.type){
          case 'buttonReady':
            this.expando.showButton(messageData.message.detail);
            break;
          case 'collapse':
            this.expando.collapse();
            break;
          case 'expand':
            this.expando.expand();
            break;
          case 'querySubmitted':
            this.expando.grow();
            break;
          case 'clearButtonHit':
            this.expando.shrink();
            break;
          case 'openingNewPage':
            this._sendMessageToIFrame(this._getIFrameConfig());
            break;
          default:
            console.log(`not implemented: ${messageData.message.type}`);
            break;
        }
      }
    }, `#${Selectors.iframeId}`);
  }

  /**
   * Returns the overlay configuration options that are relevant to the iFrame
   *
   * @return {Object}
   */
  _getIFrameConfig() {
    return {
      type: 'overlayConfig',
      config: {
        button: this.config.button,
        panel: this.config.panel,
        prompts: this.config.prompts,
        isExpanded: this.expando.isExpanded()
      }
    };
  }

  /**
   * Adds event listeners for elements in the parent frame that affect the overlay.
   */
  _createEventListenersOnParentFrame() {
    const customButtonEl = this.config.customSelector &&
      document.querySelector(this.config.customSelector);

    this._connectWithCustomButton(customButtonEl);
    this._setUpCollapseOnOutsideClicks(customButtonEl);
  }

  /**
   * Adds event listener to collapse the overlay on clicks that are outside the iFrame
   * and outside the custom button element (if provided)
   *
   * @param {Element} customButtonEl
   */
  _setUpCollapseOnOutsideClicks(customButtonEl) {
    window.addEventListener('click', (e) => {
      const isInsideIFrame = this.iframeWrapperEl.contains(e.target);
      const isInsideCustomButtonEl = customButtonEl && customButtonEl.contains(e.target);
      !isInsideIFrame && !isInsideCustomButtonEl && this.forceCollapse();
    });
  }

  /**
   * Adds event listener to the custom button element, if provided, so the custom
   * button can trigger overlay collapsing and expanding.
   *
   * @param {Element} customButtonEl
   */
  _connectWithCustomButton(customButtonEl) {
    customButtonEl && customButtonEl.addEventListener('click', () => {
      (this.expando.isExpanded() && this.forceCollapse()) || this.forceExpand();
    });
  }

  /**
   * Sends a message to the iFrame.
   *
   * @param {Object} message
   */
  _sendMessageToIFrame(message) {
    this.iframeEl.iFrameResizer.sendMessage(message);
  }
}
