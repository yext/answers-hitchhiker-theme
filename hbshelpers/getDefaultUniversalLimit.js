/**
 * Generates a default result limit for each vertical on the universal page. The
 * default is taken from the vertical's `universalLimit`, specified in the related
 * page's VTC. If there is no such `universalLimit`, the back-end default of 10 will
 * be used.
 * 
 * @param {Object} pageConfigs - The configurations for each page.
 * @returns {Object} The default search.universalLimit for the page.
 */
 module.exports = function getDefaultUniversalLimit(pageConfigs) {
  const universalLimit = Object.entries(pageConfigs)
    .filter(([key, _]) => key != 'index')
    .reduce((limit, [_, config]) => {
      const verticalKey = config.verticalKey;
      const hasUniversalLimit = 
        config.verticalsToConfig &&
        config.verticalsToConfig[verticalKey] &&
        config.verticalsToConfig[verticalKey].universalLimit;
      if (hasUniversalLimit) {
        limit[verticalKey] = config.verticalsToConfig[verticalKey].universalLimit;
      }

      return limit;
    }, {});

    return { universalLimit };
}