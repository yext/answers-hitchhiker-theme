import Expando from '../dom/expando';
import { InteractionTypes } from '../constants';
import IFrameMessage from '../models/iframemessage';

/**
 * InteractionDirector is responsible encapsulating how the parent frame and child iframe
 * interact. It keeps the the ParentFrameObserver and IFrameObserver from referring to
 * each other explicitly and lets us vary their interaction independently.
 */
export default class InteractionDirector {
  constructor(config) {
    /**
     * @type {Element}
     */
    this._iframeEl = config.iframeEl;

    /**
     * @type {Element}
     */
    this._buttonFrameEl = config.buttonFrameEl;

    /**
     * @type {Expando}
     */
    this.expando = new Expando(config);
  }

  /**
   * Handles user interactions from the iframe, parent frame, or button frame, updating the
   * relevant parts of the Overlay in the iframe, parent frame, and/or button frame.
   *
   * @param {InteractionTypes} type
   * @param {Object} details
   */
  onInteraction(type, details) {
    switch (type){
      case InteractionTypes.IFRAME_CONNECTED:
        this._sendMessageToIFrame(new IFrameMessage('config', details), this._iframeEl);
        break;
      case InteractionTypes.BUTTON_CONNECTED:
        this._sendMessageToIFrame(new IFrameMessage('config', details), this._buttonFrameEl);
        break;
      case InteractionTypes.IFRAME_READY:
        this.expando.showOverlay(details);
        break;
      case InteractionTypes.COLLAPSE:
        this.collapse();
        break;
      case InteractionTypes.EXPAND:
        this.expand();
        break;
      case InteractionTypes.TOGGLE_OVERLAY:
        this._toggle();
        break;
      case InteractionTypes.QUERY_SUBMITTED:
        this.expando.grow();
        break;
      case InteractionTypes.CLEAR_BUTTON_HIT:
        this.expando.shrink();
        break;
      default:
        break;
    }
  }

  /**
   * Collapses the Overlay
   */
  collapse() {
    this._sendMessageToIFrame(
      new IFrameMessage(InteractionTypes.COLLAPSE), this._iframeEl);
    this._sendMessageToIFrame(
      new IFrameMessage(InteractionTypes.COLLAPSE), this._buttonFrameEl);
    this.expando.collapse();
  }

  /**
   * Expands the Overlay
   */
  expand() {
    this._sendMessageToIFrame(
      new IFrameMessage(InteractionTypes.EXPAND), this._iframeEl);
    this._sendMessageToIFrame(
      new IFrameMessage(InteractionTypes.EXPAND), this._buttonFrameEl);
    this.expando.expand();
  }

  /**
   * Adds a callback to an interaction on the Overlay.
   *
   * @param {ActionTypes} type
   * @param {function} callback
   */
  addCallback(type, callback) {
    this.expando.addCallback(type, callback);
  }

  /**
   * Toggles the Overlay's expanded/collapsed state
   */
  _toggle() {
    if (this.expando.isExpanded()) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  /**
   * Sends a message to the iframe provided.
   *
   * @param {IFrameMessage} message
   * @param {Element} iframeEl
   */
  _sendMessageToIFrame(message, iframeEl) {
    iframeEl.iFrameResizer.sendMessage({
      type: message.getType(),
      ...message.getDetails()
    });
  }
}
