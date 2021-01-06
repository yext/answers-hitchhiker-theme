/**
 * Minifies the given runtime template.
 * i.e.
 * {{#minifyRuntimeTemplate}}
 *   <div> remove my extra whitespace please!</div>
 * {{/minifyRuntimeTemplate}}
 * 
 * @param {import('handlebars').HelperOptions} options
 * @returns {string}
 */
module.exports = function minifyRuntimeTemplate(options) {
  const originalContent = options.fn(this);
  return originalContent.replace(/\n\s*/g, ' ');
};