/**
 * Returns true if any of the arguments are true.
 * i.e. (any 0 false 1) will return true.
 * 
 * To account for the options parameter, which handlebars adds automatically
 * to all helpers, this function checks for two or more truthy arguments instead of
 * just one.
 * 
 * @param  {...any} args 
 * @param {import("handlebars").HelperOptions} options handlebars always adds an additional options parameter
 * @returns {boolean}
 */
module.exports = function any(...args) {
  return args.filter(item => item).length > 1;
}
