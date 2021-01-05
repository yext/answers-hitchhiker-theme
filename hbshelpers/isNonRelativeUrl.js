/**
 * Determine whether a URL is a relative url or not.
 * Common examples: "mailto:slapshot@gmail.com", "//yext.com", "https://yext.com",
 * "/my-img.svg"
 * 
 * @param {string} str the url to test
 */
module.exports = function isNonRelativeUrl(str) {
  const absoluteURLRegex = /^(\/|[a-zA-Z]+:)/;
  return str && str.match(absoluteURLRegex);
}