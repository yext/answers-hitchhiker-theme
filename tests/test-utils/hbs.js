const hbs = require('handlebars');
const path = require('path');
const fs = require('fs');

module.exports = registerCustomHbsHelpers(hbs, path.resolve(__dirname, '../../hbshelpers'));

/**
 * Register's handlebars helpers from the given folder, one helper per file.
 *
 * @param {Handlebars} hbs the handlebars instance
 * @param {string} pathToCustomHelpers the path to the hbs helpers directory
 */
function registerCustomHbsHelpers(hbs, pathToCustomHelpers) {
  fs.readdirSync(pathToCustomHelpers)
    .forEach(filename => {
      const filePath = path.resolve(pathToCustomHelpers, filename);
      if (!fs.lstatSync(filePath).isFile()) {
        return;
      }
      const helperName = stripExtension(filename);
      try {
        hbs.registerHelper(helperName, require(filePath));
      } catch (err) {
        throw new Error(
          `Could not register handlebars helper from file ${filePath}`, err.stack);
      }
    });
  return hbs;
}

function stripExtension(filename) {
  if (filename.indexOf('.') === -1) {
    return filename;
  }
  return filename.substring(0, filename.lastIndexOf('.'));
}