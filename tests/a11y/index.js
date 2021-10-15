const HttpServer = require('../test-utils/server');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const StandardPageNavigator = require('../percy/standardpagenavigator');
const A11yReporter = require('./a11yreporter');
const puppeteer = require('puppeteer');
const PORT = 5042;

const config = {
  reporter: "no-passes",
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag2aaa'],
  },
  rules: {
    'color-contrast': { enabled: false }
  }
}

async function runA11yTest() {
  const server = new HttpServer({
    dir: 'test-site/public',
    port: PORT
  });
  server.start();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const standardPageNavigator = new StandardPageNavigator(page, `http://localhost:${PORT}`);
  const analyzer = await new AxePuppeteer(page).options(config);
  const results = await new A11yReporter(standardPageNavigator, analyzer).analyze();

  console.log(results);
  console.log(JSON.stringify(results, null, 2));
  
  await browser.close();
  server.shutdown();
};

runA11yTest();
