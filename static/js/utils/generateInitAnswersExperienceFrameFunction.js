import { sendToIframe } from '../iframe-common';

/**
 * Returns a function which sends a message to the iframe to initialize Answers
 * with the provided runtimeConfig
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
    runtimeConfig.set('initAnswersExperience', true);
    sendToIframe({ runtimeConfig: runtimeConfig.getObject() });
  }
}
