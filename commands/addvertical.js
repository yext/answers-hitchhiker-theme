const fs = require('fs-extra');
const path = require('path');
const { parse, stringify } = require('comment-json');
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
        ArgumentType.STRING, 'card to use with vertical', false),
      template: new ArgumentMetadata(
        ArgumentType.STRING, 'page template to use within theme', true),
      locales: new ArgumentMetadata(
        ArgumentType.ARRAY,
        'additional locales to generate the page for',
        false,
        [],
        ArgumentType.STRING)
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
        },
        locales: {
          displayName: 'Additional Page Locales',
          type: 'multioption',
          options: this._getAdditionalPageLocales(jamboConfig)
        }
      }
    };
  }

  /**
   * @param {Object} jamboConfig The Jambo configuration of the site.
   * @returns {Array<string>} The additional locales that are configured in 
   *                          locale_config.json
   */
  static _getAdditionalPageLocales(jamboConfig) {
    if (!jamboConfig) {
      return [];
    }

    const configDir = jamboConfig.dirs.config;
    if (!configDir) {
      return [];
    }

    const localeConfig = path.resolve(configDir, 'locale_config.json');
    if (!fs.existsSync(localeConfig)) {
      return [];
    }

    const localeContentsRaw = fs.readFileSync(localeConfig, 'utf-8');
    let localeContentsJson;
    try {
      localeContentsJson = parse(localeContentsRaw);
    } catch(err) {
      throw new UserError('Could not parse locale_config.json ', err.stack);
    }

    const defaultLocale = localeContentsJson.default;
    const pageLocales = [];
    for (const locale in localeContentsJson.localeConfig) {
      // don't list the default locale as an option
      if (locale !== defaultLocale) {
        pageLocales.push(locale);
      }
    }
    return pageLocales;
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
    const themeCardsDir = path.join(themesDir, defaultTheme, 'cards');

    const cards = fs.readdirSync(themeCardsDir, { withFileTypes: true })
      .filter(dirent => !dirent.isFile())
      .map(dirent => dirent.name);

    const customCardsDir = 'cards';
    if (fs.existsSync(customCardsDir)) {
      fs.readdirSync(customCardsDir, { withFileTypes: true })
        .filter(dirent => !dirent.isFile() && !cards.includes(dirent.name))
        .forEach(dirent => cards.push(dirent.name));
    }

    return cards;
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
    this._validateArgs(args);
    this._createVerticalPage(args.name, args.template, args.locales);
    const cardName = args.cardName || this._getCardDefault(args.template);
    this._configureVerticalPage(args.name, args.verticalKey, cardName);
  }


  /**
   * Structural validation (missing required parameters, etc.) is handled by YArgs. This
   * method provides an additional validation layer to ensure the provided template,
   * cardName, and locales are valid. Any issue will result in a {@link UserError} being thrown.
   * 
   * @param {Object} args The command parameters.
   */
  _validateArgs(args) {
    if (args.template === 'universal-standard') {
      throw new UserError('A vertical cannot be initialized with the universal template');
    }

    const themeDir = this._getThemeDirectory(this.config);
    const templateDir = path.join(themeDir, 'templates', args.template);
    if (!fs.existsSync(templateDir)) {
      throw new UserError(`${args.template} is not a valid template in the Theme`);
    }

    const availableCards = VerticalAdder._getAvailableCards(this.config);
    if (args.cardName && !availableCards.includes(args.cardName)) {
      throw new UserError(`${args.cardName} is not a valid card`);
    }

    if (args.locales.length) {
      const supportedLocales = VerticalAdder._getAdditionalPageLocales(this.config);
      args.locales.forEach(locale => {
        if (!supportedLocales.includes(locale)) {
          throw new UserError(`${locale} is not a locale supported by your site`);
        }
      })
    }
  }

  /**
   * Determines the default card type to use for a vertical. This is done by parsing the
   * provided vertical template's page-config.json to find the cardType, if it exists.
   * If the parsed JSON has no cardType, the 'standard' card is reported as the default.
   * 
   * @param {string} template The vertical's template name.
   * @returns {string} The default card type.
   */
  _getCardDefault(template) {
    const themeDir = this._getThemeDirectory(this.config);
    const templateDir = path.join(themeDir, 'templates', template);

    const pageConfig = parse(
      fs.readFileSync(path.join(templateDir, 'page-config.json'), 'utf-8'));
    const verticalConfig = pageConfig.verticalsToConfig['<REPLACE ME>'];
    
    return verticalConfig.cardType || 'standard';
  }

  /**
   * Returns the path to the defaultTheme. If there is no defaultTheme, or
   * the themes directory does not exist, null is returned.
   * 
   * @param {Object} jamboConfig The Jambo configuration for the site.
   * @returns The path to the defaultTheme, relative to the top-level of the site.
   */
  _getThemeDirectory(jamboConfig) {
    const defaultTheme = jamboConfig.defaultTheme;
    const themesDir = jamboConfig.dirs && jamboConfig.dirs.themes;
    if (!defaultTheme || !themesDir) {
      return null;
    }

    return path.join(themesDir, defaultTheme);
  }

  /**
   * Creates a page for the vertical using the provided name and template. If additional
   * locales are provided, localized copies of the vertical page will be created as well.
   * Any output from the `jambo page` command is piped through.
   * 
   * @param {string} name The name of the vertical's page.
   * @param {string} template The template to use.
   * @param {Array<string>} locales The additional locales to generate the page for.
   */
  _createVerticalPage(name, template, locales) {
    const args = ['--name', name, '--template', template];

    if (locales.length) {
      args.push('--locales', locales.join(' '));
    }

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

    let rawConfig = fs.readFileSync(configFile, { encoding: 'utf-8' });
    rawConfig = rawConfig.replace(/\<REPLACE ME\>/g, verticalKey);
    const parsedConfig = parse(rawConfig);

    parsedConfig.verticalsToConfig[verticalKey].cardType = cardName;

    fs.writeFileSync(configFile, stringify(parsedConfig, null, 2));
  }
}
module.exports = VerticalAdder;