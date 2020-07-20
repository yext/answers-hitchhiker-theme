#!/usr/bin/env node
const { LegacyUpgrader } = require('./LegacyUpgrader');
const { getJamboParam } = require('./utils');

(async () => {
  try {
    const themeDir = `${getJamboParam('dirs.themes')}/${getJamboParam('defaultTheme')}`;
    const configDir = getJamboParam('dirs.config');
    const legacyUpgrader = new LegacyUpgrader(themeDir, configDir);
    await legacyUpgrader.upgrade();
  } catch (e) {
    console.error(e.message, e.stack);
    console.error('Error occurred on node version:', process.version);
  }
})();
