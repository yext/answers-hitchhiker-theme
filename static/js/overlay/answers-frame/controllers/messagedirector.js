import { ActionTypes } from '../../shared/constants';
import IFrameMessage from '../../shared/iframemessage';
import PageDecorator from './pagedecorator';
import Shape from './shape';

/**
 * MessageDirector is responsible for Overlay communication between this frame and
 * external frames.
 */
export default class MessageDirector {
  constructor() {
    /**
     * @type {Shape}
     */
    this._shape = new Shape();
  }

  /**
   * Handles an action from an external frame
   *
   * @param {Object} message
   */
  handleMessage(message = {}) {
    if (!message.type) {
      return;
    }

    switch(message.type) {
      case ActionTypes.CONFIG:
        const pageDecorator = new PageDecorator(this._shape);
        pageDecorator.decorate(message.details);

        if (message.details.isCollapsed) {
          this._notifyParentFrame(new IFrameMessage(ActionTypes.IFRAME_READY, {
            totalHeight: pageDecorator.getTotalHeight()
          }));
        }
        break;
      case ActionTypes.COLLAPSE:
        this._shape.collapseOverlay();
        break;
      case ActionTypes.EXPAND:
        this._shape.expandOverlay(message.details.isMobile);
        break;
      default:
        break;
    }
  }

  /**
   * Handles an action from this frame, notifying other frames if necessary
   *
   * @param {ActionTypes} actionType
   */
  handleAction(actionType) {
    switch(actionType) {
      case ActionTypes.QUERY_SUBMITTED:
        this._notifyParentFrame(new IFrameMessage(ActionTypes.QUERY_SUBMITTED));
        this._shape.growOverlay();
        break;
      case ActionTypes.CLEAR_BUTTON_HIT:
        this._notifyParentFrame(new IFrameMessage(ActionTypes.CLEAR_BUTTON_HIT));
        this._shape.shrinkOverlay();
        break;
      default:
        break;
    }
  }

  /**
   * Sends a message to the parent frame
   *
   * @param {IFrameMessage} message
   */
  _notifyParentFrame(message) {
    window.parentIFrame && window.parentIFrame.sendMessage(message.toObject());
  }
}
