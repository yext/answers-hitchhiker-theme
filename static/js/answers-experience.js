import DeferredPromise from './deferred-promise';

export default class AnswersExperience {
  constructor (runtimeConfig) {
    this.runtimeConfig = runtimeConfig;

    this.AnswersInitializedPromise = new DeferredPromise((resolve, reject) => {
      setTimeout(reject, 5000, 
        'Timed out waiting on Answers initialization. Unable to update Answer\'s configuration(s).');
    });

    runtimeConfig._onUpdate('analyticsEventsEnabled', updatedConfigOption => {
      this.AnswersInitializedPromise
        .then(() => this.updateAnswersAnalyticsEventsConfig(updatedConfigOption))
        .catch(err => console.warn(err));
    });
  }

  /**
   * Update Answer's analytics events config based on new value 
   * of 'analyticsEventsEnabled' key in runtimeConfig
   * 
   * @param {string|boolean} updatedConfigOption
   */
  updateAnswersAnalyticsEventsConfig (updatedConfigOption) {
    let option = null;
    if (typeof(updatedConfigOption) === 'string') {
      option = updatedConfigOption.toLowerCase() === 'true';
    } else if (typeof(updatedConfigOption) === 'boolean') {
      option = updatedConfigOption;
    }
    if (option != null) {
      ANSWERS.setAnalyticsOptIn(option);
    }
  }
}
