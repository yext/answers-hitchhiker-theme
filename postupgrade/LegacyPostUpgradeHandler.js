const fs = require('fs');
const fsExtra = require('fs-extra');
const PostUpgradeHandler = require('./PostUpgradeHandler');
const fileSystem = require('file-system');
const { removeEmptyDirectoriesRecursively } = require('./utils');

/**
 * LegacyPostUpgradeHandler performs legacy-specific filesystem changes after the Theme repository
 * has been upgraded.
 */
class LegacyPostUpgradeHandler {
  constructor(themeDir, configDir) {
    this.postUpgradeHandler = new PostUpgradeHandler(themeDir, configDir);
  }

  async handlePostUpgrade() {
    await this.postUpgradeHandler.handlePostUpgrade();
    fileSystem.recurseSync('static', ['**/*'], (filepath, relative, filename) => {
      if (filename) {
        this.handleStaticFile(filepath, filename);
      }
    });
    fsExtra.removeSync('partials/layouts');
    removeEmptyDirectoriesRecursively('static');
  }

  /**
   * Defines how to handle a given file in the static/ folder.
   * @param {string} filepath the path of the file e.g. static/answers.scss
   * @param {string} filename just the file's name e.g. answers.scss
   */
  handleStaticFile(filepath, filename) {
    if (filepath === 'static/scss/fonts.scss') {
      return;
    } else if (filename === 'fonts.scss') {
      fsExtra.mkdirpSync('static/scss');
      fs.writeFileSync('static/scss/fonts.scss', fs.readFileSync(filepath));
      fs.unlinkSync(filepath);
    } else if (filepath.startsWith('static/assets/fonts')) {
      const filesToDelete = [
        'opensans-bold-webfont.woff',
        'opensans-semibold-webfont.woff',
        'opensans-regular-webfont.woff'
      ];
      if (filesToDelete.includes(filename)) {
        fs.unlinkSync(filepath);
      }
    } else if (filepath.startsWith('static/assets/images')) {
      if (filename === 'yext-logo.svg') {
        fs.unlinkSync(filepath);
      }
    } else if (filepath.startsWith('static/scss')) {
      const filesToPreserve = ['answers.scss', 'answers-variables.scss'];
      if (!filesToPreserve.includes(filename)) {
        fs.unlinkSync(filepath);
      }
    } else {
      fs.unlinkSync(filepath);
    }
  }
}

module.exports = LegacyPostUpgradeHandler;
