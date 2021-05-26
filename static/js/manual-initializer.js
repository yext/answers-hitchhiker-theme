import updateRuntimeConfig from './utils/update-runtime-config';

/**
 * Responsible for setting up manual initialization of the experience
 */
export default class ManualInitializer {
  constructor () {
    this._hasAnswersInitialized = false;
  }

  /**
   * Puts a manual initializaiton function on the window
   */
  setup () {
    window.initAnswersExperience = this._generateInitFunction();
  }

  /**
   * Returns a function which initializes an answers experience with the provided runtimeConfig
   * @returns {Function}
   */
  _generateInitFunction () {
    const runtimeConfigNotProvidedTimeout = setTimeout(() => {
      console.warn(
        'An initialization function has not been called within 5 seconds of page load, and "initializeManually" is set to true.\n' +
        'Load the experience by calling initAnswersExperience() or initAnswersExperienceFrame() for iframe integrations.'
      );
    }, 5000);
    return runtimeConfig => {
      this._fireOnDomLoad(() => {
        updateRuntimeConfig(runtimeConfig);
        clearTimeout(runtimeConfigNotProvidedTimeout);
        if (!this._hasAnswersInitialized) {
          initAnswers();
        }
        this._hasAnswersInitialized = true;
      });
    };
  }

  /**
   * Executes the provided function on DOM load
   * @param {Function} cb 
   */
   _fireOnDomLoad (cb) {
    if (document.readyState == 'loading') {
      document.addEventListener('DOMContentLoaded', cb);
    } else {
      cb();
    }
  }
}