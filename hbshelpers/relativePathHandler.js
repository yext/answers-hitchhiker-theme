const isNonRelativeUrl = require('./isNonRelativeUrl');

/**
 * If the url is not relative, return it. If it is relative,
 * append relativePath to it.
 * 
 * @param {import('handlebars').HelperOptions} options
 * @param {string} options.hash.relativePath
 * @param {string} options.hash.url
 * @returns {string}
 */
module.exports = function relativePathHandler(options) {
  const { relativePath, url } = options.hash || {};
  if (isNonRelativeUrl(url) || !relativePath || !url) {
    return url;
  }
  return relativePath + '/' + url;
}