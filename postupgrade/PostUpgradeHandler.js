const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const { mergeJson, isGitSubmodule } = require('./utils');
const { spawnSync } = require('child_process');

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
    if (!isGitSubmodule(this.themeDir)) {
      this.removeFromTheme('.git', '.gitignore', 'tests');
    }
    this.copyStaticFilesToTopLevel(
      'package.json', 'Gruntfile.js', 'webpack-config.js', 'package-lock.json');
    spawnSync('npm', ['install'], { stdio: 'inherit' });

    const userGlobalConfigPath = 
      path.relative(process.cwd(), path.join(this.configDir, this.globalConfigFile));
    const themeGlobalConfigPath = 
      path.relative(process.cwd(), path.join(this.themeDir, this.globalConfigFile));
    if (fsExtra.pathExistsSync(themeGlobalConfigPath)) {
      const mergedGlobalConfig = await this.mergeThemeGlobalConfig(userGlobalConfigPath, themeGlobalConfigPath);
      fs.writeFileSync(userGlobalConfigPath, mergedGlobalConfig);
    }
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
   * @param {string} userGlobalConfigPath The path to the user's current global config
   * @param {string} themeGlobalConfigPath The path to the global config in the theme
   * @return {string} The comment-json merged global config
   */
  async mergeThemeGlobalConfig(userGlobalConfigPath, themeGlobalConfigPath) {
    const updatedCommentJson = fs.readFileSync(themeGlobalConfigPath, 'utf-8');
    const originalCommentJson = fs.readFileSync(userGlobalConfigPath, 'utf-8');
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
