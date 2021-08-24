const path = require('path');
const { parseJamboConfig } = require('../commands/helpers/utils/jamboconfigutils');
const { error } = require('../commands/helpers/utils/logger');

/**
 * Validates the template data and partials used during jambo build.
 * 
 * @param {Object} pageData data that gets passed into a page template
 * @param {Object<string, Function|string>} partials
 *                          mapping of partial name to partial. Handlebars
 *                          converts partials from strings to Functions when they are used.
 * @returns {boolean} false if validator should throw an error
 */
module.exports = function (pageData, partials) {
  const jamboConfig = parseJamboConfig();
  const validatorResults = [
    isGlobalConfigValid(pageData.global_config), 
    isPageVerticalConfigValid(pageData, jamboConfig, partials)
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
 * @param {Object<string, Function|string>} partials mapping of partial name to partial
 * @returns {boolean}
 */
function isPageVerticalConfigValid(pageData, jamboConfig, partials) {
  const themeDirectory = path.join(jamboConfig.dirs.themes, jamboConfig.defaultTheme);
  return Object.keys(pageData.verticalsToConfig)
    .map(key => {
      if (key === 'Universal') {
        return isAllVerticalConfigsValid(pageData.verticalConfigs, jamboConfig, partials);
      }
      const universalSectionTemplate = pageData.verticalsToConfig[key].universalSectionTemplate;
      const cardType = pageData.verticalsToConfig[key].cardType;
      const validatorResults = [
        isUniversalSectionTemplateValid(key, themeDirectory, universalSectionTemplate, partials), 
        isCardTypeValid(key, themeDirectory, cardType, partials)
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
 * @param {Object<string, Function|string>} partials mapping of partial name to partial
 * @returns {boolean}
 */
function isUniversalSectionTemplateValid(verticalName, themeDir, template, partials) {
  const partialName = `universalsectiontemplates/${template}`;
  if (template && !partials[partialName]) {
    const universalSectionPath = path.join(themeDir, 'universalsectiontemplates/', template + '.hbs');
    logThatPartialDNE(partialName, verticalName, [universalSectionPath]);
    return false;
  }
  return true;
}

/**
 * If cardType is defined, check whether the corresponding file exists in theme or custom card folder
 * 
 * @param {string} verticalName
 * @param {string} themeDir
 * @param {string} cardType
 * @param {Object<string, Function|string>} partials mapping of partial name to partial
 * @returns {boolean}
 */
function isCardTypeValid(verticalName, themeDir, cardType, partials) {
  const partial = `cards/${cardType}/component`;
  if (cardType && !partials[partial]) {
    const cardTypePath = path.join(themeDir, 'cards/', cardType, 'component.js');
    const customCardTypePath = path.join('cards/', cardType, 'component.js');
    logThatPartialDNE(partial, verticalName, [cardTypePath, customCardTypePath]);
    return false;
  }
  return true;
}

/**
 * Validate all vertical configs for the page templates
 * 
 * @param {Object} verticalConfigs
 * @param {Object} jamboConfig
 * @param {Object<string, Function|string>} partials mapping of partial name to partial
 * @returns {boolean}
 */
function isAllVerticalConfigsValid(verticalConfigs, jamboConfig, partials) {
  if (!verticalConfigs) {
    return true;
  }
  return Object.keys(verticalConfigs)
    .map(key => {
      return isPageVerticalConfigValid(verticalConfigs[key], jamboConfig, partials);
    })
    .every(result => result);
}

function logThatPartialDNE(partialName, verticalName, defaultLocations = []) {
  let msg = `Cannot find partial \`${partialName}\` for vertical \`${verticalName}\`.`
  if (defaultLocations.length === 1) {
    msg += `\nBy default this partial is located in ${defaultLocations[0]}`;
  } else if (defaultLocations.length > 1) {
    const lastLocation = defaultLocations[defaultLocations.length - 1];
    const commaSeparatedLocations = defaultLocations.slice(0, -1).join(', ');
    const parsedLocations = `${commaSeparatedLocations} or ${lastLocation}`
    msg += `\nBy default this partial is located in ${parsedLocations}`;
  }
  error(msg);
}