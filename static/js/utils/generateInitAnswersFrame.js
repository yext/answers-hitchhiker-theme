import { sendToIframe } from '../iframe-common';

/**
 * Returns a function which generates an iframed Answers experience.
 * 
 * @param {string} domain 
 * @param {RuntimeConfig} runtimeConfig 
 * @returns {Function}
 */
export default function generateInitAnswersFrame (runtimeConfig) {
  /**
   * @param {Object} config Runtime config which is set within the iframe
   */
  return function (config = {}) {
    Object.entries(config).forEach(([key, value]) => {
      runtimeConfig.set(key, value);
    });
    runtimeConfig.set('initAnswersExperience', true);
    sendToIframe({ runtimeConfig: runtimeConfig.getObject() });
  }
}
