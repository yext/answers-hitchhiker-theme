const fs = require('file-system');
const path = require('path');
const mergeOptions = require('merge-options');
const {
  parse,
  stringify
} = require('comment-json');
const UserError = require('../errors/usererror');

/**
 * Parses the repository's Jambo config file. If certain attributes are not
 * present, defaults will be applied.
 * 
 * @returns {Object} The parsed Jambo configuration, as an {@link Object}. 
 */
exports.parseJamboConfig = function () {
  try {
    let config = mergeOptions(
      {
        dirs: {
          themes: 'themes',
          config: 'config',
          output: 'public',
          pages: 'pages',
          partials: ['partials'],
        }
      },
      parse(fs.readFileSync('jambo.json', 'utf8'))
    );
    return config;
  } catch (err) {
    throw new UserError('Error parsing jambo.json', err.stack);
  }
}

/**
 * Registers a new set of Handlebars partials in the Jambo configuration
 * file. The set will not be registered if it has been already or if it
 * comes from a Theme's 'static' directory.
 * 
 * @param {string} partialsPath The local path to the set of partials. 
 */
exports.addToPartials = function (partialsPath) {
  const jamboConfig = exports.parseJamboConfig();
  const existingPartials = jamboConfig.dirs.partials;

  const shouldAddNewPartialsPath =
    !existingPartials.includes(partialsPath) &&
    partialsPath.split(path.sep)[0] !== 'static';

  if (shouldAddNewPartialsPath) {
    existingPartials.push(partialsPath);
    fs.writeFileSync('jambo.json', stringify(jamboConfig, null, 2));
  }
}

/**
 * Returns whether or not the partialsPath exists in the partials object in the
 * Jambo config
 *
 * @param {Object} jamboConfig The parsed jambo config
 * @param {string} partialsPath The local path to the set of partials. 
 * @returns {boolean}
 */
exports.containsPartial = function (jamboConfig, partialsPath) {
  return jamboConfig.dirs
    && jamboConfig.dirs.partials
    && jamboConfig.dirs.partials.includes(partialsPath);
}
