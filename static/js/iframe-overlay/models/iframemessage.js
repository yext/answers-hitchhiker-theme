/**
 * IFrameMessage provides shape for the messages passed between frames.
 */
export default class IFrameMessage {
  constructor(type, details) {
    /**
     * @type {string}
     */
    this.type = type;

    /**
     * @type {Object}
     */
    this.details = details || {};
  }

  /**
   * @type {string}
   */
  getType() {
    return this.type;
  }

  /**
   * @returns {Object}
   */
  getDetails() {
    return this.details;
  }
}