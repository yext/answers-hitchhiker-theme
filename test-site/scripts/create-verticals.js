const { execSync } = require('child_process')
const process = require('process');
const path = require('path');
const ConfigMerger = require('./config-merger');
const PagePatcher = require('./page-patcher');

const verticalConfiguration = {
  events: {
    verticalKey: 'events',
    template: 'vertical-standard',
    cardName: 'event-custom'
  },
  faqs: {
    verticalKey: 'faq',
    template: 'vertical-standard',
    cardName: 'faq-accordion'
  },
  locations: {
    verticalKey: 'KM',
    template: 'vertical-map',
    cardName: 'location-standard'
  },
  locations_full_page_map: {
    verticalKey: 'KM',
    template: 'vertical-full-page-map',
    cardName: 'location-standard'
  },
  locations_full_page_map_with_filters: {
    verticalKey: 'KM',
    template: 'vertical-full-page-map',
    cardName: 'location-standard'
  },
  people: {
    verticalKey: 'people',
    template: 'vertical-grid',
    cardName: 'standard'
  }
};

const pagesDir = path.resolve(__dirname, '../pages');
const patchesDir = path.resolve(__dirname, '../pages-patches');
const pagePatcher = new PagePatcher({ pagesDir, patchesDir });

const configDir = path.resolve(__dirname, '../config');
const overridesDir = path.resolve(__dirname, '../config-overrides');
const configMerger = new ConfigMerger({ configDir, overridesDir });

// Change dir into the theme dir so that jambo can find the theme's custom commands
const testSiteDir = path.resolve(__dirname, '..');
process.chdir(testSiteDir);

Object.entries(verticalConfiguration).forEach(([pageName, config]) => {
  execSync(`npx jambo vertical --name ${pageName} --verticalKey ${config.verticalKey} --template ${config.template} --cardName ${config.cardName}`);
  configMerger.mergeConfigForPage(pageName);
  pagePatcher.applyPatchToPage(pageName);
});
