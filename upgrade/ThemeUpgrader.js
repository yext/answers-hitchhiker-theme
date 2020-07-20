const fsPromises = require('fs').promises;
const fsExtra = require('fs-extra');
const path = require('path');
const { mergeJson, checkIfFileIsModified } = require('./utils');

class ThemeUpgrader {
  constructor (themeDir, configDir) {
    this.themeDir = themeDir;
    this.configDir = configDir;
    this.globalConfigFile = 'global_config.json';
  }

  async upgrade() {
    await this.removeFromTheme('.git', '.gitignore', 'tests');
    const themeGlobalConfig = path.join(this.themeDir, this.globalConfigFile);
    if (await checkIfFileIsModified(themeGlobalConfig)) {
      await this.mergeGlobalConfig();
    }
    await this.copyRootLevelFiles('package.json', 'Gruntfile.js', 'webpack-config.js', 'package-lock.json');
  }

  /**
   * @param  {...string} removalPaths 
   */
  async removeFromTheme(...removalPaths) {
    const promisesArray = removalPaths.map(p => fsExtra.remove(path.join(this.themeDir, p)));
    await Promise.all(promisesArray);
  }

  /**
   * Merges the theme's global_config with the user's current global_config.
   */
  async mergeGlobalConfig() {
    const userGlobalConfigPath = path.join(this.configDir, this.globalConfigFile);
    const themeGlobalConfigPath = path.join(this.themeDir, this.globalConfigFile);
    const mergedCommentJson = await mergeJson(themeGlobalConfigPath, userGlobalConfigPath);
    await fsPromises.writeFile(userGlobalConfigPath, mergedCommentJson);
  }

  /**
   * @param  {...string} staticFilesToUpdate 
   */
  async copyRootLevelFiles(...staticFilesToUpdate) {
    await Promise.all(staticFilesToUpdate.map(filename => {
      const srcPath = path.resolve(this.themeDir, 'static', filename);
      return fsPromises.copyFile(srcPath, filename);
    }));
  }
}

exports.ThemeUpgrader = ThemeUpgrader;
