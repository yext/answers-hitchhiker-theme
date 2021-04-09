const { execSync } = require('child_process')
const process = require('process');
const path = require('path');
const ConfigMerger = require('./config-merger');
const PagePatcher = require('./page-patcher');

const verticalConfiguration = [{
  name: 'events',
  verticalKey: 'events',
  template: 'vertical-standard',
  cardName: 'event-standard'
}, {
  name: 'faqs',
  verticalKey: 'faq',
  template: 'vertical-standard',
  cardName: 'faq-accordion'
}, {
  name: 'locations',
  verticalKey: 'KM',
  template: 'vertical-map',
  cardName: 'location-standard'
}, {
  name: 'people',
  verticalKey: 'people',
  template: 'vertical-grid',
  cardName: 'standard'
}];

const testSiteDir = path.resolve(__dirname, '..');
const pagesDir = path.resolve(__dirname, '../pages');
const patchesDir = path.resolve(__dirname, '../pages-patches');
const configDir = path.resolve(__dirname, '../config');
const overridesDir = path.resolve(__dirname, '../config-overrides');

const configMerger = new ConfigMerger({ configDir, overridesDir });
const pagePatcher = new PagePatcher({ pagesDir, patchesDir });

// Change dir into the theme dir so that jambo can find the theme's custom commands
process.chdir(testSiteDir);

verticalConfiguration.forEach(config => {
  execSync(`jambo vertical --name ${config.name} --verticalKey ${config.verticalKey} --template ${config.template} --cardName ${config.cardName}`);
  configMerger.mergeConfigForPage(config.name);
  pagePatcher.applyPatchToPage(config.name);
});
