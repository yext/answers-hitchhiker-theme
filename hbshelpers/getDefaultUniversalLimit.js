module.exports = function getDefaultUniversalLimit(verticalsToConfig) {
  return Object.entries().reduce(([key, config], limit) => {
    if (config.universalLimit) {
      limit[key] = config.universalLimit;
    }

    return limit;
  }, {});
}