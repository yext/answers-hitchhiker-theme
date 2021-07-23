module.exports = function shallowMergeConfig(...options) {
  const parsedData = JSON.parse(options[options.length - 1].fn(this));
  let stringFormat;
  if (Array.isArray(parsedData)) {
    stringFormat = JSON.stringify(Object.assign({}, ...parsedData));
  }
  else {
    stringFormat = JSON.stringify(Object.assign({}, parsedData));
  }
  return stringFormat
}