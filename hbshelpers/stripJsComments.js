const strip = require('strip-comments');

/**
 * Removes all JS comments from a partial's output.
 *
 * @note this is a block helper
 *
 * @param {import('handlebars').HelperOptions} options 
 */
module.exports = function stripJsComments(options) {
  const partialValue = options.fn(this); 
  return strip(partialValue);
}