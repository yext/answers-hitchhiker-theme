const getCleanedJamboInjectedData = require('../static/webpack/getCleanedJamboInjectedData');

/**
 * Formats the data sent to the handlebars templates during Jambo builds.
 *
 * @param {string} pageMetadata.relativePath relativePath from the page to the output dir
 * @param {string} pageMetadata.pageName name of the page being build
 
 * @param {Object} siteLevelAttributes.globalConfig global_config.json
 * @param {Object} siteLevelAttributes.currentLocaleConfig the chunk of locale config for the current locale
 * @param {string} siteLevelAttributes.locale the current locale
 * @param {Object} siteLevelAttributes.env all environment variables, like JAMBO_INJECTED_DATA
 * 
 * @param {Object} pageNameToConfig object of pageName to pageConfig
 * @returns {Object}
 */
module.exports = function (pageMetadata, siteLevelAttributes, pageNameToConfig) {
  const { relativePath, pageName } = pageMetadata;
  const { globalConfig, currentLocaleConfig, locale, env } = siteLevelAttributes;
  const currentPageConfig = pageNameToConfig[pageName];
  const templateData = {
    ...currentPageConfig,
    verticalConfigs: pageNameToConfig,
    global_config: getLocalizedGlobalConfig(globalConfig, currentLocaleConfig, locale),
    params: currentLocaleConfig.params || {},
    relativePath,
    env: {
      JAMBO_INJECTED_DATA: env.JAMBO_INJECTED_DATA
    }
  };
  if (globalConfig.useJWT) {
    return getCleanedTemplateData(templateData);
  }
  return templateData;
}

/**
 * Gets the global config, with experienceKey and locale added
 * to it.
 * 
 * @param {Object} globalConfig 
 * @param {Object} currentLocaleConfig chunk of locale config for the current locale
 * @param {string} locale the current locale
 * @returns {Object}
 */
function getLocalizedGlobalConfig(globalConfig, currentLocaleConfig, locale) {
  const localizedGlobalConfig = {
    ...globalConfig
  };
  const { experienceKey } = currentLocaleConfig;
  if (experienceKey) {
    localizedGlobalConfig.experienceKey = experienceKey;
  }
  if (locale) {
    localizedGlobalConfig.locale = locale;
  }
  return localizedGlobalConfig;
}

/**
 * Returns the provided template data without the API Key
 * 
 * @param {Object} templateData 
 * @returns {Object}
 */
function getCleanedTemplateData(templateData) {
  const jamboInjectedData = templateData.env.JAMBO_INJECTED_DATA;
  const globalConfig = templateData.global_config;
  return {
    ...templateData,
    global_config: {
      ...globalConfig,
      apiKey: undefined
    },
    env: {
      JAMBO_INJECTED_DATA: getCleanedJamboInjectedData(jamboInjectedData)
    }
  }
}