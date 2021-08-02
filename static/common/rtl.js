/**
 * Returns true if the given language is written from right to left (requires rtl css)
 * 
 * @param {string} locale 
 * @returns {boolean}
 */
module.exports = function isRTL (locale) {
  if (locale === 'ar') {
    return true;
  }
  return false;
}