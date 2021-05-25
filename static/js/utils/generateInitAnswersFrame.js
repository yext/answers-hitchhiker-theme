import { generateIFrame } from '../iframe-common';

/**
 * Returns a function which generates an iframed Answers experience.
 * If the function is not called by the timeout, a warning is logged.
 * 
 * @param {string} domain 
 * @param {RuntimeConfig} runtimeConfig 
 * @returns {Function}
 */
export default function generateInitAnswersFrame (domain, runtimeConfig) {
  const initNotCalledTimeout = setTimeout(() => {
    console.warn(
      'initAnswersExperienceFrame has not been called within 5 seconds of page load.\n' + 
      'Load the experience by calling initAnswersExperienceFrame(config).'
    );
  }, 5000);

  /**
   * @param {Object} config Runtime config which is set within the iframe
   */
  return function (config = {}) {
    clearTimeout(initNotCalledTimeout);
    Object.entries(config).forEach(([key, value]) => {
      runtimeConfig.set(key, value);
    });
    generateIFrame(domain, runtimeConfig);
  }
}
