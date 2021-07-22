module.exports = function assign(...options) {
  var parsedData = JSON.parse(options[options.length - 1].fn(this));
  var stringFormat;
  if (parsedData.length) {
    stringFormat = JSON.stringify(Object.assign({}, ...parsedData));
  }
  else {
    stringFormat = JSON.stringify(Object.assign({}, parsedData));
  }
  return stringFormat
}