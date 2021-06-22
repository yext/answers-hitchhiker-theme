import RuntimeConfig from './runtime-config';

/**
 * Check if Answers is initialized in window in a timed loop
 * 
 * @returns {Promise} When resolved, Answers exists in window
 */
function waitForAnswersInit() {
  return new Promise((resolve, reject) => {
    let timeElapsed = 0;
    const duration = 5000;
    const intervalLength = 10;

    const interval = setInterval(() => {
      timeElapsed += intervalLength;
      if (window.hasOwnProperty('ANSWERS')) {
        clearInterval(interval);
        resolve();
      }
      if (timeElapsed > duration) {
        clearInterval(interval);
        reject('Timed out waiting on Answers initialization. Unable to update Answer\'s configuration(s).');
      }
    }, intervalLength);
  });
}

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

const runtimeConfig = new RuntimeConfig();

runtimeConfig._onUpdate(updatedConfig => {
  waitForAnswersInit()
    .then(() => updateAnswersConfig(updatedConfig))
    .catch(err => console.warn(err));
});

const AnswersExperience = { 
  runtimeConfig: runtimeConfig
};

export default AnswersExperience;
