export default class AnswersExperience {
  constructor (runtimeConfig) {
    this.runtimeConfig = runtimeConfig;

    runtimeConfig._onUpdate(updatedConfig => {
      window.AnswersInitialized
        .then(() => updateAnswersConfig(updatedConfig))
        .catch(err => console.warn(err));
    });

		/**
     * Update Answer's runtime configurations
     * 
     * @param {Object} updatedConfig An object representation of the runtime config
     */
    function updateAnswersConfig(updatedConfig) {
      if (updatedConfig['analyticsEventsEnabled']) {
        ANSWERS.setAnalyticsOptIn(updatedConfig['analyticsEventsEnabled'] === 'true');
      }
    }
  }
}
