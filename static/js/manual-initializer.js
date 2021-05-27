import updateRuntimeConfig from './utils/update-runtime-config';

/**
 * Responsible for setting up manual initialization of the experience
 */
export default class ManualInitializer {
  /**
   * @param {Function} initAnswers the Answers initialization function which the manual init function calls to start answers
   */
  constructor (initAnswers) {
    this._initAnswers = initAnswers;
    this._hasAnswersInitialized = false;
  }

  /**
   * Puts a manual initialization function on the window which initializes answers with the
   * provided runtimeConfig
   */
  setup () {
    const runtimeConfigNotProvidedTimeout = setTimeout(() => {
      console.warn(
        'An initialization function has not been called within 5 seconds of page load, and "initializeManually" is set to true.\n' +
        'Load the experience by calling initAnswersExperience() or initAnswersExperienceFrame() for iframe integrations.'
      );
    }, 5000);
    window.AnswersExperience.init = (config) => {
      this._fireOnDomLoad(() => {
        updateRuntimeConfig(config);
        clearTimeout(runtimeConfigNotProvidedTimeout);
        if (!this._hasAnswersInitialized) {
          this._initAnswers();
        }
        this._hasAnswersInitialized = true;
      });
    }
  }

  /**
   * Executes the provided function on DOM load
   * @param {Function} cb 
   */
   _fireOnDomLoad (cb) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', cb);
    } else {
      cb();
    }
  }
}