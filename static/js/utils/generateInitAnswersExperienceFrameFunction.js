import { sendToIframe } from '../iframe-common';

/**
 * Returns a function which updates the runtime config and initializes answers
 * 
 * @param {string} domain 
 * @param {RuntimeConfig} runtimeConfig 
 * @returns {Function}
 */
export default function generateInitAnswersExperienceFrameFunction (runtimeConfig) {
  /**
   * @param {Object} config runtime config which is set within the iframe
   */
  return function (config = {}) {
    Object.entries(config).forEach(([key, value]) => {
      runtimeConfig.set(key, value);
    });
    sendToIframe({ 
      initAnswersExperience: true,
      runtimeConfig: runtimeConfig.getAll()
    });
  }
}
