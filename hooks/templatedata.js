/**
 * Returns the data after performing the given template data hook 
 * transformation on it.
 *
 * @param {Object} pageConfig the configuration for the current page
 * @param {string} relativePath the relativePath for the current page
 * @param {Object} params the params Object for the current locale, e.g. localeConfig.en.params
 * @param {Object} globalConfig global_config.json
 * @param {Object} pageNameToConfig object of page names to config objects
 * @param {Object} env contains environment variables e.g. env.JAMBO_INJECTED_DATA
 * @returns {Object} the template data sent to the page
 */
module.exports = function({
  pageConfig,
  relativePath,
  params,
  globalConfig,
  pageNameToConfig,
  env
}) {
  const templateData = {
    ...pageConfig,
    verticalConfigs: pageNameToConfig,
    global_config: globalConfig,
    relativePath,
    params,
    env
  };
  return templateData;
}