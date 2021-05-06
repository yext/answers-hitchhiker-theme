const hbs = require('handlebars');
const path = require('path');
const fs = require('fs');
const fileSystem = require('file-system');

registerPartials(hbs);
registerCustomHbsHelpers(hbs, path.resolve(__dirname, '../../hbshelpers'))
module.exports = hbs;

/**
 * Registers the theme's partials to the test hbs instance.
 * 
 * @param {Handlebars} hbs the handlebars instance
 */
function registerPartials(hbs) {
  const partialFolders = [
    'script',
  ];
  partialFolders.forEach(folder => {
    const folderPath = path.resolve(__dirname, '../..', folder);
    fileSystem.recurseSync(folderPath, (filepath, relative, filename) => {
      if (!filename || !fs.lstatSync(filepath).isFile()) {
        return;
      }
      const partialName = stripExtension(`${folder}/${relative}`);
      hbs.registerPartial(partialName, fs.readFileSync(filepath, 'utf-8'));
    });
  });
}

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