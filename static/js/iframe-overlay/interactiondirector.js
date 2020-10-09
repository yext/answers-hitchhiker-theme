import Expando from './expando';
import { InteractionTypes, Selectors } from './constants';

/**
 * InteractionDirector is responsible encapsulating how the parent frame and child iframe
 * interact. It keeps the the ParentFrameObserver and IFrameObserver from referring to
 * each other explicitly and lets us vary their interaction independently.
 */
export default class InteractionDirector {
  constructor(iframeConfig) {
    /**
     * @type {Object}
     */
    this.iframeConfig = iframeConfig;

    /**
     * @type {Element}
     */
    this.iframeEl = document.querySelector(`#${Selectors.IFRAME_ID}`);

    /**
     * @type {Expando}
     */
    this.expando = new Expando();

    /**
     * @type {boolean}
     */
    this.isExpanded = false;
  }

  /**
   * Handles user interactions from the iframe, updating the relevant parts of the Overlay
   * in the parent frame and/or child iframe.
   *
   * @param {InteractionTypes} type
   * @param {Object} details
   */
  onIFrameInteraction(type, details) {
    switch (type){
      case InteractionTypes.INIT:
        this._sendConfigMessageToIFrame();
        break;
      case InteractionTypes.BUTTON_READY:
        this.expando.showButton(details);
        break;
      case InteractionTypes.COLLAPSE:
        this.expando.collapse();
        break;
      case InteractionTypes.EXPAND:
        this.expando.expand();
        break;
      case InteractionTypes.QUERY_SUBMITTED:
        this.expando.grow();
        break;
      case InteractionTypes.CLEAR_BUTTON_HIT:
        this.expando.shrink();
        break;
    }
  }

  /**
   * Handles user interactions from the parent frame, updating the relevant parts of the
   * Overlay in the parent frame and/or child iframe.
   *
   * @param {InteractionTypes} type
   */
  onParentFrameInteraction(type) {
    switch (type){
      case InteractionTypes.COLLAPSE:
        this._forceCollapse();
        break;
      case InteractionTypes.TOGGLE_OVERLAY:
        if (this.isExpanded) {
          this._forceCollapse();
        } else {
          this._forceExpand();
        }
        break;
      }
  }

  /**
   * An external trigger forces the Overlay to collapse - affecting both the Overlay parts
   * in the child iFrame and the parts in the parent frame
   */
  _forceCollapse() {
    this._sendMessageToIFrame(InteractionTypes.COLLAPSE);
    this.expando.collapse();
  }

  /**
   * An external trigger forces the Overlay to expand - affecting both the Overlay parts
   * in the child iFrame and the parts in the parent frame
   */
  _forceExpand() {
    this._sendMessageToIFrame(InteractionTypes.EXPAND);
    this.expando.expand();
  }

  /**
   * Sends the iFrame Overlay config message to the iFrame.
   */
  _sendConfigMessageToIFrame() {
    this._sendMessageToIFrame('overlayConfig', {
      config: {
        ...this.iframeConfig,
        isExpanded: this.isExpanded
      }
    });
  }

  /**
   * Sends a message to the iframe of the given type, with details (if provided).
   *
   * @param {String} type
   * @param {Object} details
   */
  _sendMessageToIFrame(type, details = {}) {
    this.iframeEl.iFrameResizer.sendMessage({
      type: type,
      ...details
    });
  }
}
