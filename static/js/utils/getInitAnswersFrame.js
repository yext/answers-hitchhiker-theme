import { generateIFrame } from '../iframe-common';

/**
 * Returns a function which generates an iframed Answers experience.
 * If the function is not called by the timeout, a warning is logged.
 * 
 * @param {string} domain 
 * @param {HitchhikerConfigManager} hitchhikerConfigManager 
 * @returns {Function}
 */
export default function getInitAnswersFrame (domain, hitchhikerConfigManager) {
  const initNotCalledTimeout = setTimeout(() => {
    console.warn(
      'initAnswersFrame has not been called within 5 seconds of page load.\n' + 
      'Load the experience by calling initAnswersFrame(config).'
    );
  }, 5000);

  /**
   * @param {Object} dynamicConfig Config which is set within the iframe
   */
  return function (dynamicConfig = {}) {
    clearTimeout(initNotCalledTimeout);
    Object.entries(dynamicConfig).forEach(([key, value]) => {
      hitchhikerConfigManager.set(key, value);
    });
    generateIFrame(domain, hitchhikerConfigManager);
  }
}
