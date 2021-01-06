/**
 * If the two arguments are equal, return the first block. Otherwise
 * return the second block.
 * 
 * @param {any} arg1 
 * @param {any} arg2 
 * @param {import('handlebars').HelperOptions} options
 * @returns {import('handlebars').TemplateDelegate}
 */
module.exports = function ifeq(arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
}
