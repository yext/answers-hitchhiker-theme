#!/usr/bin/env node
const LegacyPostUpgradeHandler = require('./postupgrade/LegacyPostUpgradeHandler');
const PostUpgradeHandler = require('./postupgrade/PostUpgradeHandler');
const { getJamboParam } = require('./postupgrade/utils');

(async () => {
  try {
    const themeDir = `${getJamboParam('dirs.themes')}/${getJamboParam('defaultTheme')}`;
    const configDir = getJamboParam('dirs.config');
    if (process.argv.includes('--isLegacy')) {
      const legacyHandler = new LegacyPostUpgradeHandler(themeDir, configDir);
      await legacyHandler.handlePostUpgrade();
    } else {
      const handler = new PostUpgradeHandler(themeDir, configDir);
      await handler.handlePostUpgrade();
    }
  } catch (e) {
    console.error(e.message, e.stack);
    console.error('Error occurred on node version:', process.version);
  }
})();
