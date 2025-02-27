const fs = require('fs-extra');
const { containsPartial, addToPartials } = require('./helpers/utils/jamboconfigutils');
const path = require('path');
const UserError = require('./helpers/errors/usererror');
const { ArgumentMetadata, ArgumentType } = require('./helpers/utils/argumentmetadata');

/**
 * GenerativeDirectAnswerCardCreator represents the `generativedirectanswercard` custom jambo command.
 * The command creates a new, custom generative direct answer card in the top-level
 * 'generativedirectanswercards' directory of a jambo repo.
 */
class GenerativeDirectAnswerCardCreator {
  constructor(jamboConfig) {
    this.config = jamboConfig;
    this._customCardsDir = 'generativedirectanswercards';
  }

  /**
   * @returns {string} the alias for the create generative direct answer card command.
   */
  static getAlias() {
    return 'generativedirectanswercard';
  }

  /**
   * @returns {string} a short description of the create generative direct answer card command.
   */
  static getShortDescription() {
    return 'add a new generative direct answer (GDA) card for use in the site';
  }

  /**
   * @returns {Object<string, ArgumentMetadata>} description of each argument for
   *                                             the create generative direct answer card command, keyed by name
   */
  static args() {
    return {
      'name': new ArgumentMetadata(ArgumentType.STRING, 'name for the new generative direct answer card', true),
      'templateCardFolder': new ArgumentMetadata(ArgumentType.STRING, 'folder of generative direct answer card to fork', true)
    };
  }

  /**
   * @returns {Object} description of the generative direct answer card command, including paths to
   *                   all available generative direct answer cards
   */
  static describe(jamboConfig) {
    const generativeDirectAnswerCardPaths = this._getGenerativeDirectAnswerCardPaths(jamboConfig);
    return {
      displayName: 'Add Generative Direct Answer (GDA) Card',
      params: {
        name: {
          displayName: 'Generative Direct Answer Card Name',
          required: true,
          type: 'string'
        },
        templateCardFolder: {
          displayName: 'Template Card Folder',
          required: true,
          type: 'singleoption',
          options: generativeDirectAnswerCardPaths
        }
      }
    };
  }

  /**
   * @returns {Array<string>} the paths of the available generative direct answer cards
   */
  static _getGenerativeDirectAnswerCardPaths(jamboConfig) {
    const defaultTheme = jamboConfig.defaultTheme;
    const themesDir = jamboConfig.dirs && jamboConfig.dirs.themes;
    if (!defaultTheme || !themesDir) {
      return [];
    }
    const themeCardsDir = path.join(themesDir, defaultTheme, 'generativedirectanswercards');
    const cardPaths = new Set();
    const addCardsToSet = cardsDir => {
      if (!fs.existsSync(cardsDir)) {
        return;
      }
      fs.readdirSync(cardsDir, { withFileTypes: true })
        .filter(dirent => !dirent.isFile())
        .forEach(dirent => cardPaths.add(path.join('generativedirectanswercards', dirent.name)));
    };
    [themeCardsDir, 'generativedirectanswercards'].forEach(dir => addCardsToSet(dir));
    return Array.from(cardPaths);
  }

  /**
   * Executes the create generative direct answer card command with the provided arguments.
   *
   * @param {Object<string, string} args The arguments, keyed by name
   */
  execute(args) {
    this._create(args.name, args.templateCardFolder);
  }

  /**
   * Creates a new, custom generative direct answer card in the top-level
   * 'generativedirectanswercards' directory. This card will be based off
   * either an existing custom card or one supplied by the Theme.
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
   * Returns the internal contents for a newly-created generative direct answer card,
   * updated based on the given customCardName. (e.g. generative_customComponent ->
   * [CustomName]Component)
   *
   * @param {string} content
   * @param {string} customCardName
   * @returns {string}
   */
  _getRenamedCardComponent(content, customCardName) {
    const cardNameSuffix = 'Component';
    const regexArray = [...content.matchAll(/componentName\s*=\s*'(.*)'/g)];
    if (regexArray.length === 0 || regexArray[0].length < 2) {
      return content;
    }
    const originalComponentName = regexArray[0][1];

    const customComponentClassName =
      customCardName.replace(/-/g, '_') + cardNameSuffix;

    return content
      .replace(new RegExp(originalComponentName, 'g'), customCardName)
      .replace(/(class )(.*)( extends)/g, `$1${customComponentClassName}$3`)
      .replace(/(ANSWERS.registerComponentType\()(.*)(\))/g, `$1${customComponentClassName}$3`);
  }
}

module.exports = GenerativeDirectAnswerCardCreator;
