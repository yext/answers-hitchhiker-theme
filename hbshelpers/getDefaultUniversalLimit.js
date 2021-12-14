/**
 * Generates a default result limit for each vertical on the universal page. The
 * default is taken from the vertical's `universalLimit`, specified in the related
 * page's VTC. If there is no such `universalLimit`, the back-end default of 10 will
 * be used.
 * 
 * @param {Object} pageConfigs - The configurations for each page.
 * @returns {Object} The partial of the search configuration related to universal limits.
 */
 module.exports = function getDefaultUniversalLimit(pageConfigs) {
  const universalLimit = Object.entries(pageConfigs)
    .filter(([pageName, _]) => pageName != 'index')
    .reduce((limit, [_, pageConfig]) => {
      const verticalKey = pageConfig.verticalKey;
      const hasUniversalLimit = 
        pageConfig.verticalsToConfig &&
        pageConfig.verticalsToConfig[verticalKey] &&
        pageConfig.verticalsToConfig[verticalKey].universalLimit;
      if (hasUniversalLimit) {
        limit[verticalKey] = pageConfig.verticalsToConfig[verticalKey].universalLimit;
      }

      return limit;
    }, {});

    return { universalLimit };
}