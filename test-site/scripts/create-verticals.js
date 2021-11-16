const { execSync } = require('child_process')
const process = require('process');
const path = require('path');
const ConfigMerger = require('./config-merger');
const PagePatcher = require('./page-patcher');
const yargs = require('yargs')

const argv = yargs
  .option('pageNames', { type: 'array' })
  .parse();

const verticalConfiguration = {
  events: {
    verticalKey: 'events',
    template: 'vertical-standard',
    cardName: 'event-custom'
  },
  events_custom_cta_icons: {
    verticalKey: 'events',
    template: 'vertical-standard'
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
  locations_google: {
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
  },
  products: {
    verticalKey: 'products',
    template: 'vertical-grid',
    cardName: 'multilang-product-prominentvideo'
  },
  products_clickable_image: {
    verticalKey: 'products',
    template: 'vertical-grid',
    cardName: 'product-prominentimage-clickable'
  },
  financial_professionals: {
    verticalKey: 'financial_professionals',
    template: 'vertical-standard',
    cardName: 'financial-professional-location'
  },
  healthcare_professionals: {
    verticalKey: 'healthcare_professionals',
    template: 'vertical-grid',
    cardName: 'professional-standard'
  },
  jobs: {
    verticalKey: 'jobs',
    template: 'vertical-standard',
    cardName: 'job-standard'
  },
  help_articles: {
    verticalKey: 'help_articles',
    template: 'vertical-standard',
    cardName: 'document-standard'
  },
  menu_items: {
    verticalKey: 'menu_items',
    template: 'vertical-grid',
    cardName: 'menuitem-standard'
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
  if (argv.pageNames && !argv.pageNames.includes(pageName)) {
    return;
  }
  let verticalCommand =
    `npx jambo vertical --name ${pageName} --verticalKey ${config.verticalKey} --template ${config.template} --locales es ar`
  if (config.cardName) {
    verticalCommand += ` --cardName ${config.cardName}`
  }
  execSync(verticalCommand);
  configMerger.mergeConfigForPage(pageName);
  pagePatcher.applyPatchToPage(pageName);
  configMerger.mergeConfigForPage(pageName + '.es');
  pagePatcher.applyPatchToPage(pageName + '.es');
  configMerger.mergeConfigForPage(pageName + '.ar');
  pagePatcher.applyPatchToPage(pageName + '.ar');
});
