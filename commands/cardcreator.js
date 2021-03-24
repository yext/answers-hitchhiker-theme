const fs = require('fs-extra');
const { containsPartial, addToPartials } = require('./helpers/utils/jamboconfigutils');
const path = require('path');
const UserError = require('./helpers/errors/usererror');
const { ArgumentMetadata, ArgumentType } = require('./helpers/utils/argumentmetadata');

/**
 * CardCreator represents the `card` custom jambo command.
 * The command creates a new, custom card in the top-level 'cards' directory
 * of a jambo repo.
 */
class CardCreator {
  constructor(jamboConfig) {
    this.config = jamboConfig;
    this._customCardsDir = 'cards';
  }

  /**
   * @returns {string} the alias for the create card command.
   */
  static getAlias() {
    return 'card';
  }

  /**
   * @returns {string} a short description of the create card command.
   */
  static getShortDescription() {
    return 'add a new card for use in the site';
  }

  /**
   * @returns {Object<string, ArgumentMetadata>} description of each argument for 
   *                                             the create card command, keyed by name
   */
  static args() {
    return {
      'name': new ArgumentMetadata(ArgumentType.STRING, 'name for the new card', true),
      'templateCardFolder': new ArgumentMetadata(ArgumentType.STRING, 'folder of card to fork', true)
    };
  }

  /**
   * @returns {Object} description of the card command, including paths to 
   *                   all available cards
   */
  static describe(jamboConfig) {
    const cardPaths = this._getCardPaths(jamboConfig);
    return {
      displayName: 'Add Card',
      params: {
        name: {
          displayName: 'Card Name',
          required: true,
          type: 'string'
        },
        templateCardFolder: {
          displayName: 'Template Card Folder',
          required: true,
          type: 'singleoption',
          options: cardPaths
        }
      }
    };
  }

  /**
   * @returns {Array<string>} the paths of the available cards
   */
  static _getCardPaths(jamboConfig) {
    const defaultTheme = jamboConfig.defaultTheme;
    const themesDir = jamboConfig.dirs && jamboConfig.dirs.themes;
    if (!defaultTheme || !themesDir) {
      return [];
    }
    const cardsDir = path.join(themesDir, defaultTheme, 'cards');
    return fs.readdirSync(cardsDir, { withFileTypes: true })
      .filter(dirent => !dirent.isFile())
      .map(dirent => path.join(cardsDir, dirent.name));
  }

  /**
   * Executes the create card command with the provided arguments.
   * 
   * @param {Object<string, string>} args The arguments, keyed by name 
   */
  execute(args) {
    this._create(args.name, args.templateCardFolder);
  }

  /**
   * Creates a new, custom card in the top-level 'Cards' directory. This card
   * will be based off either an existing custom card or one supplied by the
   * Theme.
   * 
   * @param {string} cardName           The name of the new card. A folder with a
   *                                    lowercased version of this name will be
   *                                    created.
   * @param {string} templateCardFolder The folder of the existing card on which
   *                                    the new one will be based.
   */
  _create(cardName, templateCardFolder) {
    const defaultTheme = this.config.defaultTheme;
    const themeCardsDir =
      `${this.config.dirs.themes}/${defaultTheme}/${this._customCardsDir}`;

    const cardFolderName = cardName.toLowerCase();
    const isFolderInUse =
      fs.existsSync(`${themeCardsDir}/${cardFolderName}`) ||
      fs.existsSync(`${this._customCardsDir}/${cardFolderName}`);
    if (isFolderInUse) {
      throw new UserError(`A folder with name ${cardFolderName} already exists`);
    }

    const cardFolder = `${this._customCardsDir}/${cardFolderName}`;
    if (fs.existsSync(templateCardFolder)) {
      !fs.existsSync(this._customCardsDir) && fs.mkdirSync(this._customCardsDir);
      !containsPartial(this._customCardsDir) && addToPartials(this._customCardsDir);
      fs.copySync(templateCardFolder, cardFolder);
      this._renameCardComponent(cardFolderName, cardFolder);
    } else {
      throw new UserError(`The folder ${templateCardFolder} does not exist`);
    }
  }

  _renameCardComponent(customCardName, cardFolder) {
    const cardComponentPath = path.resolve(cardFolder, 'component.js');
    const originalComponent = fs.readFileSync(cardComponentPath).toString();
    const renamedComponent =
      this._getRenamedCardComponent(originalComponent, customCardName);
    fs.writeFileSync(cardComponentPath, renamedComponent);
  }

  /**
   * Returns the internal contents for a newly-created card, updated based on
   * the given customCardName. (e.g. StandardCardComponent -> [CustomName]CardComponent)
   * @param {string} content
   * @param {string} customCardName
   * @returns {string}
   */
  _getRenamedCardComponent(content, customCardName) {
    const cardNameSuffix = 'CardComponent';
    const registerComponentTypeRegex = /\([\w_]+CardComponent\)/g;
    const regexArray = [...content.matchAll(/componentName\s*=\s*'(.*)'/g)];
    if (regexArray.length === 0 || regexArray[0].length < 2) {
      return content;
    }
    const originalComponentName = regexArray[0][1];

    const customComponentClassName =
      customCardName.replace(/-/g, '_') + cardNameSuffix;

    return content
      .replace(/class (.*) extends/g, `class ${customComponentClassName} extends`)
      .replace(registerComponentTypeRegex, `(${customComponentClassName})`)
      .replace(new RegExp(originalComponentName, 'g'), customCardName)
      .replace(/cards[/_](.*)[/_]template/g, `cards/${customCardName}/template`);
  }
}
module.exports = CardCreator;
