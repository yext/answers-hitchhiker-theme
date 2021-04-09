const fs = require('fs');
const path = require('path');
const { parse, stringify } = require('comment-json');
const _ = require('lodash');


/**
 * Responsible for applying overrides to jambo page configs
 */
class ConfigMerger {
  constructor ({ configDir, overridesDir }) {
    if (!configDir) {
      throw new Error('Invalid config directory.');
    }
    if (!overridesDir) {
      throw new Error('Invalid config overrides directory.');
    }

    /**
     * The path to the config folder
     * @type {string}
     */
    this._configDir = configDir; 

    /**
     * The path to the config overrides folder
     * @type {string}
     */
    this._overridesDir = overridesDir;
  }

  /**
   * Applies overrides from the overrides directory to the corresponding config in the config
   * directory for a given page
   * 
   * @param {string} pageName 
   */
  mergeConfigForPage (pageName) {
    if (!pageName) {
      throw new Error('A pageName must be specified');
    }

    const configFile = path.resolve(this._configDir, `${pageName}.json`);
    const configOverridesFile = path.resolve(this._overridesDir, `${pageName}.json`);

    if(!fs.existsSync(configFile)) {
      console.log(`No config found for the ${pageName} page.`);
      return;
    }

    if(!fs.existsSync(configOverridesFile)) {
      console.log(`No config overrides found for the ${pageName} page. The default config will remain unchanged.`);
      return;
    }

    const configOverrides = parse(fs.readFileSync(configOverridesFile, { encoding: 'utf-8' }));
    const config = parse(fs.readFileSync(configFile, { encoding: 'utf-8'}))

    _.merge(config, configOverrides)

    fs.writeFileSync(configFile, stringify(config, null, 2));
  }
}

module.exports = ConfigMerger;