/**
 * A Handlebars helper that invokes the provided block on each cardType used by a page.
 * The result of these invocations is concatenated to a string.
 * 
 * @param {string} pageUrl The page's URL.
 * @param {Object} pageNamesToConfig A map of page configurations, keyed by page name.
 * @param {import('handlebars').HelperOptions} opt The block.
 * @returns {string} The concatenated result string.
 */
module.exports = function getCardPartials(pageUrl, pageNamesToConfig, opt) {
  const pageConfig = Object.values(pageNamesToConfig)
    .find(pageConfig => pageConfig.url === pageUrl);
  const verticalsToConfig = pageConfig.verticalsToConfig;
  const isUniversalPage = verticalsToConfig.hasOwnProperty('Universal');

  let cardTypes;
  if (isUniversalPage) {
    // The Universal page can inherit cardTypes from the verticalsToConfig of other
    // pages.
    const verticalConfigsAcrossPages = Object.values(pageNamesToConfig)
      .flatMap(pageConfig => Object.values(pageConfig.verticalsToConfig));
    cardTypes = getCardTypes(verticalConfigsAcrossPages);
  } else {
    cardTypes = getCardTypes(Object.values(verticalsToConfig));
  }

  return applyBlockToCardTypes(cardTypes, opt);
}

/**
 * Returns all the cardTypes specified in the provided vertical configs. Note that the
 * types will be de-duped.
 * 
 * @param {Array<Object>} verticalConfigs An array of vertical configs.
 * @returns {Set<string>} The referenced cardTypes.
 */
function getCardTypes(verticalConfigs) {
  const rawCardTypes = verticalConfigs
    .filter(verticalConfig => verticalConfig.cardType)
    .map(verticalConfig => verticalConfig.cardType);

  return new Set(rawCardTypes);
}

/**
 * For each of the specified cardTypes, the corresponding partial is found and that
 * partial is passed to the provided block. The block's output is then concatenated
 * to a string.
 * 
 * @param {Set<string>} cardTypes The cardTypes. 
 * @param {Object} opt The block.
 * @returns {string} The concatenated string of block results.
 */
function applyBlockToCardTypes(cardTypes, opt) {
  let result = '';
  cardTypes.forEach(type => {
    const cardPartial = `cards/${type}/component`;
    result += opt.fn({ cardPartial });
  });

  return result;
}
