const fs = require('fs-extra');
const { containsPartial, addToPartials } = require('./helpers/utils/jamboconfigutils');
const path = require('path');
const UserError = require('./helpers/errors/usererror');
const { ArgumentMetadata, ArgumentType } = require('./helpers/utils/argumentmetadata');

/**
 * DirectAnswerCardCreator represents the `directanswercard` custom jambo command.
 * The command creates a new, custom direct answer card in the top-level
 * 'directanswercards' directory of a jambo repo.
 */
class DirectAnswerCardCreator {
  constructor(jamboConfig) {
    this.config = jamboConfig;
    this._customCardsDir = 'directanswercards';
  }

  /**
   * @returns {string} the alias for the create direct answer card command.
   */
  static getAlias() {
    return 'directanswercard';
  }

  /**
   * @returns {string} a short description of the create direct answer card command.
   */
  static getShortDescription() {
    return 'add a new direct answer card for use in the site';
  }

  /**
   * @returns {Object<string, ArgumentMetadata>} description of each argument for 
   *                                             the create direct answer card command, keyed by name
   */
  static args() {
    return {
      'name': new ArgumentMetadata(ArgumentType.STRING, 'name for the new direct answer card', true),
      'templateCardFolder': new ArgumentMetadata(ArgumentType.STRING, 'folder of direct answer card to fork', true)
    };
  }

  /**
   * @returns {Object} description of the direct answer card command, including paths to 
   *                   all available direct answer cards
   */
  static describe(jamboConfig) {
    const directAnswerCardPaths = this._getDirectAnswerCardPaths(jamboConfig);
    return {
      displayName: 'Add Direct Answer Card',
      params: {
        name: {
          displayName: 'Direct Answer Card Name',
          required: true,
          type: 'string'
        },
        templateCardFolder: {
          displayName: 'Template Card Folder',
          required: true,
          type: 'singleoption',
          options: directAnswerCardPaths
        }
      }
    };
  }

  /**
   * @returns {Array<string>} the paths of the available direct answer cards
   */
  static _getDirectAnswerCardPaths(jamboConfig) {
    const defaultTheme = jamboConfig.defaultTheme;
    const themesDir = jamboConfig.dirs && jamboConfig.dirs.themes;
    if (!defaultTheme || !themesDir) {
      return [];
    }
    const themeCardsDir = path.join(themesDir, defaultTheme, 'directanswercards');
    const cardPaths = new Set();
    const addCardsToSet = cardsDir => {
      if (!fs.existsSync(cardsDir)) {
        return;
      }
      fs.readdirSync(cardsDir, { withFileTypes: true })
        .filter(dirent => !dirent.isFile())
        .forEach(dirent => cardPaths.add(path.join('directanswercards', dirent.name)));
    };
    [themeCardsDir, 'directanswercards'].forEach(dir => addCardsToSet(dir));
    return Array.from(cardPaths);
  }

  /**
   * Executes the create direct answer card command with the provided arguments.
   * 
   * @param {Object<string, string} args The arguments, keyed by name 
   */
  execute(args) {
    this._create(args.name, args.templateCardFolder);
  }

  /**
   * Creates a new, custom direct answer card in the top-level 'directanswercards'
   * directory. This card will be based off either an existing custom card or one
   * supplied by the Theme.
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

    const newCardFolder = `${this._customCardsDir}/${cardFolderName}`;
    const originalCardFolder = this._getOriginalCardFolder(defaultTheme, templateCardFolder);
    !fs.existsSync(this._customCardsDir) && fs.mkdirSync(this._customCardsDir);
    !containsPartial(this._customCardsDir) && addToPartials(this._customCardsDir);
    fs.copySync(originalCardFolder, newCardFolder);
    this._renameCardComponent(cardFolderName, newCardFolder);
  }

  _getOriginalCardFolder(defaultTheme, templateCardFolder) {
    if (fs.existsSync(templateCardFolder)) {
      return templateCardFolder
    } 
    const themeCardFolder = path.join(this.config.dirs.themes, defaultTheme, templateCardFolder);
    if (fs.existsSync(themeCardFolder)) {
      return themeCardFolder;
    }
    throw new UserError(`The folder ${themeCardFolder} does not exist at the root or in the theme.`);
  }

  _renameCardComponent(customCardName, cardFolder) {
    const cardComponentPath = path.resolve(cardFolder, 'component.js');
    const originalComponent = fs.readFileSync(cardComponentPath).toString();
    const renamedComponent =
      this._getRenamedCardComponent(originalComponent, customCardName);
    fs.writeFileSync(cardComponentPath, renamedComponent);
  }

  /**
   * Returns the internal contents for a newly-created direct answer card, updated
   * based on the given customCardName. (e.g. allfields_standardComponent ->
   * [CustomName]Component)
   * 
   * @param {string} content
   * @param {string} customCardName
   * @returns {string}
   */
  _getRenamedCardComponent(content, customCardName) {
    const cardNameSuffix = 'Component';
    const registerComponentTypeRegex = /\([\w_]+Component\)/g;
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
      .replace(
        /directanswercards[/_](.*)[/_]template/g,
        `directanswercards/${customCardName}/template`);
  }
}

module.exports = DirectAnswerCardCreator;
