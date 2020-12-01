import Expando from '../dom/expando';
import { ActionTypes } from '../../shared/constants';
import IFrameMessage from '../../shared/iframemessage';

/**
 * ActionDirector is responsible encapsulating how the frames: parent, experience
 * iframe and button frame interact. It keeps the the ParentFrameObserver and
 * IFrameObserver(s) from referring to each other explicitly and lets us vary their
 * interactions independently.
 */
export default class ActionDirector {
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
   * @param {ActionTypes} type
   * @param {Object} details
   */
  onInteraction(type, details) {
    switch (type){
      case ActionTypes.IFRAME_CONNECTED:
        this._sendMessageToIFrame(
          new IFrameMessage(ActionTypes.CONFIG, details), this._iframeEl);
        break;
      case ActionTypes.BUTTON_CONNECTED:
        this._sendMessageToIFrame(
          new IFrameMessage(ActionTypes.CONFIG, details), this._buttonFrameEl);
        break;
      case ActionTypes.BUTTON_READY:
        this.expando.setButtonSize(details);
        break;
      case ActionTypes.IFRAME_READY:
        this.expando.start(details);
        break;
      case ActionTypes.COLLAPSE:
        this.collapse();
        break;
      case ActionTypes.EXPAND:
        this.expand();
        break;
      case ActionTypes.TOGGLE_OVERLAY:
        this._toggle();
        break;
      case ActionTypes.QUERY_SUBMITTED:
        this.expando.grow();
        break;
      case ActionTypes.CLEAR_BUTTON_HIT:
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
      new IFrameMessage(ActionTypes.COLLAPSE), this._iframeEl);
    this._sendMessageToIFrame(
      new IFrameMessage(ActionTypes.COLLAPSE), this._buttonFrameEl);
    this.expando.collapse();
  }

  /**
   * Expands the Overlay
   */
  expand() {
    const isMobile = !window.matchMedia("(min-width: 767px)").matches;
    this._sendMessageToIFrame(
      new IFrameMessage(ActionTypes.EXPAND, { isMobile: isMobile }), this._iframeEl);
    this._sendMessageToIFrame(
      new IFrameMessage(ActionTypes.EXPAND), this._buttonFrameEl);
    this.expando.expand();
  }

  /**
   * Adds a callback to an interaction on the Overlay.
   *
   * @param {ExternalActionTypes} type
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
    iframeEl.iFrameResizer.sendMessage(message.toObject());
  }
}
