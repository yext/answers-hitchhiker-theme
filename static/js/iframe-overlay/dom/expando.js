import { ActionTypes } from "../constants";

/**
 * Expando is responsible for handling the resizing of the Overlay.
 */
export default class Expando {
  constructor() {
    /**
     * @type {function}
     */
    this._expandCallback = function() {};

    /**
     * @type {function}
     */
    this._collapseCallback = function() {};
  }

  /**
   * Shows the overlay button using the button size information provided.
   *
   * @param {Object} size
   */
  showButton(size) {
    // TODO (agrow) implement in a later PR
  }

  /**
   * Collapses the Overlay
   */
  collapse() {
    // TODO (agrow) implement in a later PR
    this._collapseCallback();
  }

  /**
   * Expands the overlay
   */
  expand() {
    // TODO (agrow) implement in a later PR
    this._expandCallback();
  }

  /**
   * Makes the overlay grow to its larger size
   */
  grow() {
    // TODO (agrow) implement in a later PR
  }

  /**
   * Shrinks the overlay to its shorter size
   */
  shrink() {
    // TODO (agrow) implement in a later PR
  }

  /**
   * Adds a callback to an action
   *
   * @param {ActionTypes} type
   * @param {function} callback
   */
  addCallback(type, callback) {
    switch (type) {
      case ActionTypes.EXPAND:
        this._expandCallback = callback;
        break;
      case ActionTypes.COLLAPSE:
        this._collapseCallback = callback;
        break;
      default:
        console.warn(`Callback type '${type}' not supported.`);
        break;
    }
  }
}