#!/usr/bin/env node
const { ThemeUpgrader } = require('./ThemeUpgrader')
const { getJamboParam } = require('./utils');

(async () => {
  try {
    const themeDir = `${getJamboParam('dirs.themes')}/${getJamboParam('defaultTheme')}`;
    const configDir = getJamboParam('dirs.config');
    const themeUpgrader = new ThemeUpgrader(themeDir, configDir);
    await themeUpgrader.upgrade();
  } catch (e) {
    console.error(e.message, e.stack);
    console.error('Error occurred on node version:', process.version);
  }
})();
