/**
 * JSON.stringifies the current handlebars context.
 * 
 * @param {Object} context 
 * @returns {string}
 */
module.exports = function json(context) {
  return JSON.stringify(context || {});
};
