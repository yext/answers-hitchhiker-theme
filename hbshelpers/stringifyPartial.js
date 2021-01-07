/**
 * Wraps the given partial in backticks, and 
 * by default will also minify
 * 
 * @param {string} partial the partial to stringify
 * @param {import('handlebars').HelperOptions} options
 * @returns {string}
 */
module.exports = function stringifyPartial(partial, options) {
  const minify = options.hash.hasOwnProperty('minify') ? options.hash.minify : true;
  if (minify) {
    partial = minifyPartial(partial);
  }
  return '`' + partial + '`';
};

/**
 * Minifies the given partial.
 * 
 * @param {string} partial 
 * @return {string}
 */
function minifyPartial(partial) {
  return partial.replace(/\n\s*/g, ' ');
};
