module.exports = function assign(...options) {
  var parsedData = JSON.parse(options[options.length - 1].fn(this));
  var stringFormat = JSON.stringify(Object.assign({},...parsedData));
  console.log(stringFormat)
  return stringFormat
}