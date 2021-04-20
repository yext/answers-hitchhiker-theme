/**
 * Returns the first truthy parameter.
 *
 * @param {...string} params The params to look iterate over.
 * @param {import('handlebars').HelperOptions} options
 * @returns {any} The result of the lookup
 */
module.exports = function findFirst(...params) {
  // Remove the HelperOptions passed by Handlebars into every helper.
  const paramsExcludingHbsOptions = params.slice(0, -1);
  return paramsExcludingHbsOptions.find(e => !!e);
}