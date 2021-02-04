const fs = require('fs-extra');
const path = require('path');
const { spawnSync } = require('child_process');

const UserError = require('./helpers/errors/usererror');
const { ArgumentMetadata, ArgumentType } = require('./helpers/utils/argumentmetadata');

/**
 * VerticalAdder represents the `vertical` custom jambo command. The command adds
 * a new page for the given Vertical and associates a card type with it.
 */
class VerticalAdder {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  /**
   * @returns {string} the alias for the add vertical command.
   */
  static getAlias() {
    return 'vertical';
  }

  /**
   * @returns {string} a short description of the add vertical command.
   */
  static getShortDescription() {
    return 'create the page for a vertical';
  }

  /**
   * @returns {Object<string, ArgumentMetadata>} description of each argument for 
   *                                             the add vertical command, keyed by name
   */
  static args() {
    return {
      name: new ArgumentMetadata(ArgumentType.STRING, 'name of the vertical\'s page', true),
      verticalKey: new ArgumentMetadata(ArgumentType.STRING, 'the vertical\'s key', true),
      cardName: new ArgumentMetadata(
        ArgumentType.STRING, 'card to use with vertical', false, 'standard'),
      template: new ArgumentMetadata(
        ArgumentType.STRING, 'page template to use within theme', true)
    };
  }

  /**
   * @returns {Object} description of the vertical command and its parameters.
   */
  static describe(jamboConfig) {
    return {
      displayName: 'Add Vertical',
      params: {
        name: {
          displayName: 'Page Name',
          required: true,
          type: 'string'
        },
        verticalKey: {
          displayName: 'Vertical Key',
          required: true,
          type: 'string',
        },
        cardName: {
          displayName: 'Card Name',
          type: 'singleoption',
          options: this._getAvailableCards(jamboConfig)
        },
        template: {
          displayName: 'Page Template',
          required: true,
          type: 'singleoption',
          options: this._getPageTemplates(jamboConfig)
        }
      }
    };
  }

  /**
   * @returns {Array<string>} the names of the available cards in the Theme
   */
  static _getAvailableCards(jamboConfig) {
    const defaultTheme = jamboConfig.defaultTheme;
    const themesDir = jamboConfig.dirs && jamboConfig.dirs.themes;
    if (!defaultTheme || !themesDir) {
      return [];
    }
    const cardsDir = path.join(themesDir, defaultTheme, 'cards');
    return fs.readdirSync(cardsDir, { withFileTypes: true })
      .filter(dirent => !dirent.isFile())
      .map(dirent => dirent.name);
  }

  /**
   * @returns {Array<string>} The page templates available in the current theme
   */
  static _getPageTemplates(jamboConfig) {
    const defaultTheme = jamboConfig.defaultTheme;
    const themesDir = jamboConfig.dirs && jamboConfig.dirs.themes;
    if (!defaultTheme || !themesDir) {
      return [];
    }
    const pageTemplatesDir = path.resolve(themesDir, defaultTheme, 'templates');
    return fs.readdirSync(pageTemplatesDir);
  }

  /**
   * Executes the add vertical command with the provided arguments.
   * 
   * @param {Object<string, string>} args The arguments, keyed by name 
   */
  execute(args) {
    if (!VerticalAdder._getAvailableCards(this.config).includes(args.cardName)) {
      throw new UserError(`${args.cardName} is not a valid card`);
    }

    this._createVerticalPage(args.name, args.template);
    this._configureVerticalPage(args.name, args.verticalKey, args.cardName);
  }

  /**
   * Creates a page for the vertical using the provided name and template. Any output from
   * the `jambo page` command is piped through.
   * 
   * @param {string} name The name of the vertical's page.
   * @param {string} template The template to use.
   */
  _createVerticalPage(name, template) {
    const args = ['--name', name, '--template', template];
    spawnSync('npx jambo page', args, { shell: true, stdio: 'inherit' });
  }

  /**
   * Updates the vertical page's configuration file. Specifically, placeholders for
   * vertical key and card type are replaced with the provided values.
   * 
   * @param {string} name The page name.
   * @param {string} verticalKey The vertical's key.
   * @param {string} cardName The card to be used with the vertical.
   */
  _configureVerticalPage(name, verticalKey, cardName) {
    const configFile = `config/${name}.json`;
    let parsedConfig = fs.readFileSync(configFile, { encoding: 'utf-8' });
    parsedConfig = parsedConfig.replace(/\<REPLACE ME\>/g, verticalKey);
    parsedConfig = parsedConfig.replace(/"cardType": "[^,]+"/, `"cardType": "${cardName}"`);
    fs.writeFileSync(configFile, parsedConfig);
  }
}
module.exports = VerticalAdder;
