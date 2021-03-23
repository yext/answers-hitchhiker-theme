/**
 * A Handlebars helper that performs multiple lookups in a row.
 *
 * @param {Object} context The context to perform lookup on
 * @param {...string} lookupChain The lookups to perform.
 * @param {import('handlebars').HelperOptions} options
 * @returns {any} The result of the lookup
 */
module.exports = function chainedLookup(context, ...lookupChain) {
  let lookupResult = context;
  for (const lookup of lookupChain.slice(0, -1)) {
    if (!lookupResult || typeof lookupResult !== 'object') {
      return undefined;
    }
    lookupResult = lookupResult[lookup];
  }
  return lookupResult;
}