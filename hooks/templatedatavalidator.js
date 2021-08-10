var fs = require('fs');
var path = require('path');
const { parseJamboConfig } = require('../commands/helpers/utils/jamboconfigutils');
const { error } = require('../commands/helpers/utils/logger');
/**
 * Validates page template's data configuration
 * 
 * @param {Object} pageData data that gets passed into a page template
 * @returns {boolean} false if validator should throw an error
 */
module.exports = function (pageData) {
  const jamboConfig = parseJamboConfig();
  const validatorResults = [
    isGlobalConfigValid(pageData.global_config), 
    isPageVerticalConfigValid(pageData, jamboConfig)
  ];
  const isValid = validatorResults.every(result => result);
  return isValid;
}

/**
 * Validates global config for the page template
 * 
 * @param {Object} globalConfig 
 * @returns {boolean}
 */
function isGlobalConfigValid(globalConfig) {
  if (!globalConfig.experienceKey) {
    error('Missing Info: no experienceKey found.');
    return false;
  }
  return true;
}

/**
 * Valivates vertical config for current page template
 * 
 * @param {Object} pageData 
 * @param {Object} jamboConfig 
 * @returns {boolean}
 */
function isPageVerticalConfigValid(pageData, jamboConfig) {
  const themeDirectory = path.join(jamboConfig.dirs.themes, jamboConfig.defaultTheme);
  return Object.keys(pageData.verticalsToConfig)
    .map(key => {
      if (key === 'Universal') {
        return isAllVerticalConfigsValid(pageData.verticalConfigs, jamboConfig);
      }
      const universalSectionTemplate = pageData.verticalsToConfig[key].universalSectionTemplate;
      const cardType = pageData.verticalsToConfig[key].cardType;
      const validatorResults = [
        isUniversalSectionTemplateValid(key, themeDirectory, universalSectionTemplate), 
        isCardTypeValid(key, themeDirectory, cardType)
      ];
      return validatorResults.every(result => result);
    })
    .every(result => result);
}

/**
 * If universalsectiontemplate is defined, check whether the corresponding file exists in theme
 * 
 * @param {string} verticalName
 * @param {string} themeDir
 * @param {string} template
 * @returns {boolean}
 */
function isUniversalSectionTemplateValid(verticalName, themeDir, template) {
  if (template) {
    const universalSectionPath = path.join(themeDir, 'universalsectiontemplates/', template + '.hbs');
    if (!fs.existsSync(universalSectionPath)) {
      error(`Invalid universalSectionTemplate: can't find "${template}" at the expected path "${universalSectionPath}" for vertical "${verticalName}".`);
      return false;
    }
  }
  return true;
}

/**
 * If cardType is defined, check whether the corresponding file exists in theme or custom card folder
 * 
 * @param {string} verticalName
 * @param {string} themeDir
 * @param {string} cardType
 * @returns {boolean}
 */
function isCardTypeValid(verticalName, themeDir, cardType) {
  if (cardType) {
    const cardTypePath = path.join(themeDir, 'cards/', cardType);
    const customCardTypePath = path.join('cards/', cardType);
    if (!fs.existsSync(cardTypePath) && !fs.existsSync(customCardTypePath)) {
      error(`Invalid cardType: can't find "${cardType}" at at the expected paths "${cardTypePath}" or "${customCardTypePath}" for vertical "${verticalName}".`);
      return false;
    }
  }
  return true;
}

/**
 * Validate all vertical configs for the page templates
 * 
 * @param {Object} verticalConfigs
 * @param {Object} jamboConfig
 * @returns {boolean}
 */
function isAllVerticalConfigsValid(verticalConfigs, jamboConfig) {
  if (!verticalConfigs) {
    return true;
  }
  return Object.keys(verticalConfigs)
    .map(key => {
      return isPageVerticalConfigValid(verticalConfigs[key], jamboConfig);
    })
    .every(result => result);
}