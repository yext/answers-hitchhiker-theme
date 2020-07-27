const fsPromises = require('fs').promises;
const fsExtra = require('fs-extra');
const path = require('path');
const { mergeJson, simpleGit } = require('./utils');

/**
 * ThemeUpgrader is responsible for changes to the filesystem that occur after the theme
 * is upgraded. Notably, it removes unneeded/unwanted files and folders from the theme,
 * and also copies certain files into the top level directory, (e.g. the package.json).
 */
class ThemeUpgrader {
  constructor (themeDir, configDir) {
    this.themeDir = themeDir;
    this.configDir = configDir;
    this.globalConfigFile = 'global_config.json';
  }

  async upgrade() {
    await this.removeFromTheme('.git', '.gitignore', 'tests');
    const themeGlobalConfigPath = 
      path.relative(process.cwd(), path.join(this.themeDir, this.globalConfigFile));
    if (await fsExtra.pathExists(themeGlobalConfigPath)) {
      await this.mergeThemeGlobalConfig(themeGlobalConfigPath);
    }
    await this.copyStaticFilesToTopLevel('package.json', 'Gruntfile.js', 'webpack-config.js', 'package-lock.json');
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
  async copyStaticFilesToTopLevel(...staticFilesToUpdate) {
    await Promise.all(staticFilesToUpdate.map(filename => {
      const srcPath = path.resolve(this.themeDir, 'static', filename);
      return fsPromises.copyFile(srcPath, filename);
    }));
  }
}

exports.ThemeUpgrader = ThemeUpgrader;
