/**
 * Determines whether a URL is a non-relative url.
 * Common non-relative examples: "mailto:slapshot@gmail.com", "//yext.com", "https://yext.com",
 * "/my-img.svg"
 * 
 * @param {string} str the url to test
 */
module.exports = function isNonRelativeUrl(str) {
  const absoluteURLRegex = /^(\/|[a-zA-Z]+:)/;
  return str && str.match(absoluteURLRegex);
}
