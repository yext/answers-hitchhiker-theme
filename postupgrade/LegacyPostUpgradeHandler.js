const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const PostUpgradeHandler = require('./PostUpgradeHandler');
const {
  removeEmptyDirectoriesRecursively,
  getFilesRecursively,
  deleteFile
} = require('./utils');

/**
 * LegacyUpgrader is responsible for performing filesystem changes after
 * the theme is upgraded, after a legacy theme upgrade is run. This includes
 * all changes from {@link ThemeUpgrader}, as well as removal and movement of
 * files/folders in the top level static/ directory.
 */
class LegacyPostUpgradeHandler {
  constructor(themeDir, configDir) {
    this.postUpgradeHandler = new PostUpgradeHandler(themeDir, configDir);
  }

  async handlePostUpgrade() {
    await this.postUpgradeHandler.handlePostUpgrade();
    const files = getFilesRecursively('static');
    for (const f of files) {
      this.handleStaticFile(f.dirpath, f.dirent.name);
    }
    fsExtra.removeSync('partials/layouts');
    removeEmptyDirectoriesRecursively('static');
  }

  /**
   * Defines how to handle a given file in the static/ folder.
   * @param {string} dirpath the path to the folder containing the file
   * @param {string} filename the name of the file, e.g. answers.scss
   */
  handleStaticFile(dirpath, filename) {
    const filepath = path.resolve(dirpath, filename);

    if (filename === 'fonts.scss') {
      fsExtra.mkdirpSync('static/scss');
      fs.writeFileSync('static/scss/fonts.scss', fs.readFileSync(filepath));
      deleteFile(filepath);
    } else if (dirpath.startsWith('static/assets/fonts')) {
      const filesToDelete = [
        'opensans-bold-webfont.woff',
        'opensans-semibold-webfont.woff',
        'opensans-regular-webfont.woff'
      ];
      if (filesToDelete.includes(filename)) {
        deleteFile(filepath);
      }
    } else if (dirpath.startsWith('static/assets/images')) {
      if (filename === 'yext-logo.svg') {
        deleteFile(filepath);
      }
    } else if (dirpath.startsWith('static/scss')) {
      const filesToPreserve = ['answers.scss', 'answers-variables.scss'];
      if (!filesToPreserve.includes(filename)) {
        deleteFile(filepath);
      }
    } else {
      deleteFile(filepath);
    }
  }
}

module.exports = LegacyPostUpgradeHandler;
