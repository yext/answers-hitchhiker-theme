import { ActionTypes } from '../shared/constants';
import MessageDirector from './controllers/messagedirector';

/**
 * The interface for the Overlay that intra-experience-frame Overlay interactions can use
 * to communicate with the rest of the Overlay.
 */
export default class Overlay {
  constructor() {
    this._mediator = new MessageDirector();
  }

  /**
   * Interface to handle actions from the child iframe
   *
   * @param {Object} message
   */
  onMessage(message = {}) {
    if (!message.type) {
      return;
    }
    new MessageDirector().handleMessage(message);
  }

  /**
   * Interface to handle actions from the child iframe
   *
   * @param {Object} message
   */
  grow() {
    this._mediator.handleAction(ActionTypes.QUERY_SUBMITTED);
  }

  shrink() {
    this._mediator.handleAction(ActionTypes.CLEAR_BUTTON_HIT);
  }
}
