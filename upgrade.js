#!/usr/bin/env node
const { LegacyUpgrader } = require('./upgrade/LegacyUpgrader');
const { ThemeUpgrader } = require('./upgrade/ThemeUpgrader')
const { getJamboParam } = require('./upgrade/utils');

(async () => {
  try {
    const themeDir = `${getJamboParam('dirs.themes')}/${getJamboParam('defaultTheme')}`;
    const configDir = getJamboParam('dirs.config');
    if (process.argv.includes('--isLegacy')) {
      const legacyUpgrader = new LegacyUpgrader(themeDir, configDir);
      await legacyUpgrader.upgrade();
    } else {
      const themeUpgrader = new ThemeUpgrader(themeDir, configDir);
      await themeUpgrader.upgrade();
    }
  } catch (e) {
    console.error(e.message, e.stack);
    console.error('Error occurred on node version:', process.version);
  }
})();
