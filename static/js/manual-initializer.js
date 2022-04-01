/**
 * Responsible for setting up manual initialization of the experience.
 * Sets the "init" method of the {@link AnswersExperience} on the window.
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
        'Load the experience by calling AnswersExperience.init() or AnswersExperienceFrame.init() for iframe integrations.'
      );
    }, 5000);
    window.AnswersExperience.init = (config = {}) => {
      Object.entries(config).forEach(([key, value]) => {
        window.AnswersExperience.runtimeConfig.set(key, value);
      });
      clearTimeout(runtimeConfigNotProvidedTimeout);
      if (!this._hasAnswersInitialized) {
        this._initAnswers();
      }
      this._hasAnswersInitialized = true;
    }
  }
}