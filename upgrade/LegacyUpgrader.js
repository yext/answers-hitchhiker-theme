const fsPromises = require('fs').promises;
const fsExtra = require('fs-extra');
const path = require('path');
const { ThemeUpgrader } = require('./ThemeUpgrader');
const {
  removeEmptyDirectoriesRecursively,
  getFilesRecursively,
  deleteFile
} = require('./utils');

class LegacyUpgrader {
  constructor(themeDir, configDir) {
    this.themeUpgrader = new ThemeUpgrader(themeDir, configDir);
    this.preservedFontsFileContent = null;
  }

  async upgrade() {
    await this.themeUpgrader.upgrade();
    const files = await getFilesRecursively('static');
    await Promise.all(files.map(f => this.handleStaticFile(f.dirpath, f.dirent)));
    if (this.preservedFontsFileContent) {
      await fsExtra.mkdirp('static/scss');
      await fsPromises.writeFile('static/scss/fonts.scss', this.preservedFontsFileContent);
    }
    await fsExtra.remove('partials/layouts');
    await removeEmptyDirectoriesRecursively('static');
  }

  /**
   * Defines how to handle a given file in the static/ folder.
   * @param {string} dirpath 
   * @param {string} dirent 
   */
  async handleStaticFile(dirpath, dirent) {
    const filename = dirent.name;
    const filepath = path.resolve(dirpath, filename);

    if (filename === 'fonts.scss') {
      this.preservedFontsFileContent = await fsPromises.readFile(filepath);
      await deleteFile(filepath);
    } else if (dirpath.startsWith('static/assets/fonts')) {
      const filesToDelete = [
        'opensans-bold-webfont.woff',
        'opensans-semibold-webfont.woff',
        'opensans-regular-webfont.woff'
      ];
      if (filesToDelete.includes(filename)) {
        await deleteFile(filepath);
      }
    } else if (dirpath.startsWith('static/assets/images')) {
      if (filename === 'yext-logo.svg') {
        await deleteFile(filepath);
      }
    } else if (dirpath.startsWith('static/scss')) {
      const filesToPreserve = ['answers.scss', 'answers-variables.scss'];
      if (!filesToPreserve.includes(filename)) {
        await deleteFile(filepath);
      }
    } else {
      await deleteFile(filepath);
    }
  }
}

exports.LegacyUpgrader = LegacyUpgrader;
