const { execSync } = require('child_process')
const ConfigMerger = require('./config-merger');
const path = require('path');

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
  template: 'vertical-standard',
  cardName: 'standard'
}];

const testSiteDir = path.resolve(__dirname, '..');

verticalConfiguration.forEach(config => {
  execSync(`npx jambo vertical --name ${config.name} --verticalKey ${config.verticalKey} --template ${config.template} --cardName ${config.cardName}`);
  new ConfigMerger(testSiteDir).mergeConfigForPage(config.name);
});
