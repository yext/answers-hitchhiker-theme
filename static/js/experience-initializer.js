import updateRuntimeConfig from './utils/update-runtime-config';

/**
 * Responsible for initializing the answers experience
 */
export default class ExperienceInitializer {
  constructor (initializeManually) {
    this._initializeManually = initializeManually;
    this._hasAnswersInitialized = false;
  }

  /**
   * Initializes immediately, or puts an init function on the window if initializeManually is true
   */
  setup () {
    document.addEventListener('DOMContentLoaded', () => {
      if (this._initializeManually) {
        window.initAnswersExperience = this._generateInitFunction();
      } else {
        initAnswers();
        this._hasAnswersInitialized = true;
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
        'An initialization function has not been called within 5 seconds of page load, and "initializeManually" is set to true.\n' +
        'Load the experience by calling initAnswersExperience() or initAnswersExperienceFrame() for iframe integrations.'
      );
    }, 5000);
    return runtimeConfig => {
      updateRuntimeConfig(runtimeConfig);
      clearTimeout(runtimeConfigNotProvidedTimeout);
      if (!this._hasAnswersInitialized) {
        initAnswers();
      }
      this._hasAnswersInitialized = true;
    };
  }
}