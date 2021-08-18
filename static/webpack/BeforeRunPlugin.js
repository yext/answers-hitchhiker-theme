const { execSync } = require('child_process');

 class BeforeRunPlugin {
  constructor (scripts) {
    this.scripts = scripts;
  }

  apply(compiler) {
    compiler.hooks.beforeRun.tap('before-run-plugin', compiler => {
      if (this.scripts && this.scripts.length > 0) {
        this.scripts.forEach((script) => {
          execSync(script);
        });
      }
    });
  }
 }

 module.exports = BeforeRunPlugin;