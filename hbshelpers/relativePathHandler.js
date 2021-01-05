const isNonRelativeUrl = require('./isNonRelativeUrl');

/**
 * If the url is not relative, return it. If it is relative,
 * append relativePath to it.
 * 
 * @param {string} url 
 * @param {import('handlebars').HelperOptions} options
 * @returns {string}
 */
module.exports = function relativePathHandler(options) {
  const { relativePath, url } = options.hash || {};
  if (isNonRelativeUrl(url) || !relativePath) {
    return url;
  }
  return relativePath + '/' + url;
}