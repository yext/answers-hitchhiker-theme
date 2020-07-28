const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const { mergeJson } = require('./utils');
const simpleGit = require('simple-git/promise')();

/**
 * PostUpgradeHandler performs filesystem changes after the Theme repository has been upgraded.
 */
class PostUpgradeHandler {
  constructor (themeDir, configDir) {
    this.themeDir = themeDir;
    this.configDir = configDir;
    this.globalConfigFile = 'global_config.json';
  }

  async handlePostUpgrade() {
    this.removeFromTheme('.git', '.gitignore', 'tests');
    const themeGlobalConfigPath = 
      path.relative(process.cwd(), path.join(this.themeDir, this.globalConfigFile));
    if (fsExtra.pathExistsSync(themeGlobalConfigPath)) {
      const mergedGlobalConfig = await this.mergeThemeGlobalConfig(themeGlobalConfigPath);
      fs.writeFileSync(themeGlobalConfigPath, mergedGlobalConfig);
    }
    this.copyStaticFilesToTopLevel(
      'package.json', 'Gruntfile.js', 'webpack-config.js', 'package-lock.json');
  }

  /**
   * @param  {...string} removalPaths 
   */
  removeFromTheme(...removalPaths) {
    for (const p of removalPaths) {
      fsExtra.removeSync(path.join(this.themeDir, p));
    }
  }

  /**
   * Merges the theme's global_config with the user's current global_config.
   */
  async mergeThemeGlobalConfig(themeGlobalConfigPath) {
    const updatedCommentJson = fs.readFileSync(themeGlobalConfigPath, 'utf-8');
    const originalCommentJson = await simpleGit.show([`HEAD:${themeGlobalConfigPath}`]);
    return mergeJson(updatedCommentJson, originalCommentJson);
  }

  /**
   * @param  {...string} staticFilesToCopy 
   */
  copyStaticFilesToTopLevel(...staticFilesToCopy) {
    for (const filename of staticFilesToCopy) {
      const srcPath = path.resolve(this.themeDir, 'static', filename);
      fs.copyFileSync(srcPath, filename);
    }
  }
}

module.exports = PostUpgradeHandler;
