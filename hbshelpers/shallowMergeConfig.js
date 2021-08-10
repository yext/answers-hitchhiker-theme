/**
 * This helper merges JSON objects into a single config.
 * 
 * @param {import('handlebars').HelperOptions} options
 * @returns {string} The JSON formatted combined config.
 */
module.exports = function shallowMergeConfig(options) {
  const parsedData = JSON.parse(options.fn(this));
  let stringFormat;
  if (Array.isArray(parsedData)) {
    stringFormat = JSON.stringify(Object.assign({}, ...parsedData));
  }
  else {
    stringFormat = JSON.stringify(Object.assign({}, parsedData));
  }
  return stringFormat
}