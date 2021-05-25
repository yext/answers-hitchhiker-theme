import updateRuntimeConfig from './utils/update-runtime-config';

/**
 * Responsible for initializing the answers experience based on the waitForRuntimeConfig option
 */
export default class ExperienceInitializer {
  constructor (waitForRuntimeConfig) {
    this._waitForRuntimeConfig = waitForRuntimeConfig;
  }

  start () {
    document.addEventListener('DOMContentLoaded', () => {
      if (this._waitForRuntimeConfig) {
        window.initAnswersExperience = this._generateInitFunction();
      } else {
        initAnswers();
      }
    });
  }

  /**
   * Returns a function which initializes an answers experience with the provided runtimeConfig
   * @returns {Function}
   */
  _generateInitFunction () {
    const runtimeConfigNotProvidedTimeout = setTimeout(() => {
      console.warn(
        'Runtime config has not been received within 5 seconds of page load, and "waitForRuntimeConfig" is set to true.\n' + 
        'Load the experience by calling initAnswersExperience(config).'
      );
    }, 5000);
    return runtimeConfig => {
      updateRuntimeConfig(runtimeConfig);
      clearTimeout(runtimeConfigNotProvidedTimeout);
      initAnswers();
    };
  }
}