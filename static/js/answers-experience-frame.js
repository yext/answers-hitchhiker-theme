import { sendToIframe } from './iframe-common';

export default class AnswersExperienceFrame {
  constructor (runtimeConfig) {
    this.runtimeConfig = runtimeConfig;
    this._hasManuallyInitialized = false;

    runtimeConfig._onUpdate(updatedConfig => {
      sendToIframe({ runtimeConfig: updatedConfig });
    });
  }

  /**
   * Initializes the answers experience with the provided config set in the
   * runtime config.
   *
   * @param {Object} config 
   */
  init (config) {
    if (this.hasManuallyInitialized()) {
      return;
    }
    Object.entries(config).forEach(([key, value]) => {
      this.runtimeConfig.set(key, value);
    });
    sendToIframe({ 
      initAnswersExperience: true,
      runtimeConfig: this.runtimeConfig.getAll()
    });
    this._hasManuallyInitialized = true;
  }

  /**
   * Returns whether or not the init function has been called
   *
   * @returns {boolean}
   */
  hasManuallyInitialized () {
    return this._hasManuallyInitialized;
  }
}