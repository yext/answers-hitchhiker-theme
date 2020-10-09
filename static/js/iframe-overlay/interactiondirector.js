require('iframe-resizer');

import Expando from './expando';
import { InteractionTypes, Selectors } from './constants';

/**
 * InteractionDirector is responsible for handling user interactions from the
 * parent frame or the child iframe.
 */
export default class InteractionDirector {
  constructor(iframeConfig) {
    /**
     * @type {Element}
     */
    this.iframeEl = document.querySelector(`#${Selectors.iframeId}`);

    /**
     * @type {Object}
     */
    this.iframeConfig = iframeConfig;

    /**
     * @type {Expando}
     */
    this.expando = new Expando();

    /**
     * @type {boolean}
     */
    this.isExpanded = false;
  }

  onIFrameChanged(changeType, changeDetails) {
    switch (changeType){
      case InteractionTypes.INIT:
        this._sendConfigMessageToIFrame();
        break;
      case InteractionTypes.BUTTON_READY:
        this.expando.showButton(changeDetails);
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

  onParentFrameChanged(changeType) {
    switch (changeType){
      case InteractionTypes.COLLAPSE:
        this._forceCollapse();
        break;
      case InteractionTypes.TOGGLE:
        if (this.isExpanded) {
          this._forceCollapse();
        } else {
          this._forceExpand();
        }
        break;
      }
  }

  _forceCollapse() {
    this._sendMessageToIFrame({ type: InteractionTypes.COLLAPSE });
    this.expando.collapse();
  }

  _forceExpand() {
    this._sendMessageToIFrame({ type: InteractionTypes.EXPAND });
    this.expando.expand();
  }

  _sendConfigMessageToIFrame() {
    this._sendMessageToIFrame({
      type: 'overlayConfig',
      config: {
        ...this.iframeConfig,
        isExpanded: this.isExpanded
      }
    });
  }

  _sendMessageToIFrame(message) {
    this.iframeEl.iFrameResizer.sendMessage(message);
  }
}
