const fsPromises = require('fs').promises;
const fsExtra = require('fs-extra');
const path = require('path');
const { mergeJson, simpleGit } = require('./utils');

class ThemeUpgrader {
  constructor (themeDir, configDir) {
    this.themeDir = themeDir;
    this.configDir = configDir;
    this.globalConfigFile = 'global_config.json';
  }

  async upgrade() {
    await this.removeFromTheme('.git', '.gitignore', 'tests');
    const themeGlobalConfigPath = path.join(this.themeDir, this.globalConfigFile);
    if (await fsExtra.pathExists(themeGlobalConfigPath)) {
      await this.mergeThemeGlobalConfig(themeGlobalConfigPath);
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
  async mergeThemeGlobalConfig(themeGlobalConfigPath) {
    const updatedCommentJson = await fsPromises.readFile(themeGlobalConfigPath, 'utf-8');
    const originalCommentJson = await simpleGit.show([`HEAD:${themeGlobalConfigPath}`]);
    const mergedCommentJson = await mergeJson(updatedCommentJson, originalCommentJson);
    await fsPromises.writeFile(themeGlobalConfigPath, mergedCommentJson);
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
