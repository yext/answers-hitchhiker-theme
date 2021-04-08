const fs = require('fs');
const path = require('path');
const { parse, stringify } = require('comment-json');
const _ = require('lodash');


/**
 * Responsible for applying overrides to a jambo page config
 */
class ConfigMerger {
  constructor (siteDir) {
    /**
     * The path to the jambo site directory
     * @type {string}
     */
    this._siteDir = siteDir; 
  }

  /**
   * Applies overrides from the config-overrides folder to the corresponding config in the config
   * folder for a given page
   * @param {string} pageName 
   */
  mergeConfigForPage (pageName) {
    if (!this._siteDir) {
      throw new Error('A site directory is not specified for ConfigMerger');
    }

    if (!pageName) {
      throw new Error('A pageName must be specified');
    }

    const configFile = path.resolve(this._siteDir, `config/${pageName}.json`);
    const configOverridesFile = path.resolve(this._siteDir, `config-overrides/${pageName}.json`);

    if(!fs.existsSync(configOverridesFile)) {
      console.log(`No config overrides found for the ${pageName} page. The default config will remain unchanged.`);
      return;
    }

    const configOverrides = parse(fs.readFileSync(configOverridesFile, { encoding: 'utf-8' }));
    const config = parse(fs.readFileSync(configFile, { encoding: 'utf-8'}))

    _.merge(config, configOverrides)

    const outputFile = path.resolve(this._siteDir, `config/${pageName}.json`);

    fs.writeFileSync(outputFile, stringify(config, null, 2));
  }
}

module.exports = ConfigMerger;