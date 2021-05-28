import { sendToIframe } from './iframe-common';

export default class AnswersExperienceFrame {
  constructor (runtimeConfig) {
    this.runtimeConfig = runtimeConfig;

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
    Object.entries(config).forEach(([key, value]) => {
      this.runtimeConfig.set(key, value);
    });
    sendToIframe({ 
      initAnswersExperience: true,
      runtimeConfig: this.runtimeConfig.getAll()
    });
  }
}