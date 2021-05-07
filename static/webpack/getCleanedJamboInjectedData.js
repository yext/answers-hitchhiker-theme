const _ = require('lodash');

/**
 * Returns JAMBO_INJECTED_DATA with instances of the global config's apiKey removed
 * 
 * @param {Object} data JAMBO_INJECTED_DATA
 * @returns {Object}
 */
function getCleanedJamboInjectedData (data) {
  if (!data || !data.answers || !data.answers.experiences) {
    return;
  }
  const updatedData = _.cloneDeep(data);
  const experiences = updatedData.answers.experiences;

  const removeApiKeyFromConfig = config => {
    if ('apiKey' in config) {
      delete config['apiKey'];
    }
  }

  Object.values(experiences).forEach(config => {
    removeApiKeyFromConfig(config);
    if ('configByLabel' in config) {
      Object.values(config.configByLabel).forEach(removeApiKeyFromConfig);
    }
  });
  return updatedData;
}

module.exports = getCleanedJamboInjectedData;