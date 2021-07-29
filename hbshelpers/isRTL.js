const checkRTL = require('../static/common/rtl');

/**
 * Returns true if the given language is written from right to left (requires rtl css)
 * 
 * @param {string} locale 
 * @returns {boolean}
 */
module.exports = function isRTL(locale) {
  return checkRTL(locale);
}
