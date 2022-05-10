#!/usr/bin/env node

const HttpServer = require('../test-utils/server');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const StandardPageNavigator = require('../percy/standardpagenavigator');
const puppeteer = require('puppeteer');
const PageOperator = require('../browser-automation/pageoperator');
const getTestingLocations = require('../browser-automation/testlocations');
const PORT = 5042;

/**
 * specifies options to be used by axe-core engine within axe-core/puppeteer.
 * API documentation: https://github.com/dequelabs/axe-core/blob/master/doc/API.md
 * - set reporter to 'no-passes' to only return violation results
 * - set runOnly with tag values below to run WCAG standards:
 *    - WCAG 2.0 Level A, AA
 *    - WCAG 2.1 Level A, AA
 */
const config = {
  reporter: "no-passes",
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  }
}

async function wcagTester() {
  const server = new HttpServer({
    dir: 'test-site/public',
    port: PORT
  });
  server.start();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const standardPageNavigator = new StandardPageNavigator(page, `http://localhost:${PORT}`);
  const analyzer = new AxePuppeteer(page).options(config);

  let results = [];
  try {
    const operator = new PageOperator(standardPageNavigator, page, getTestingLocations());
    while (operator.hasNextTestLocation()) {
      await operator.nextTestLocation();
      results.push(await analyzer.analyze());
    }
  } catch (e) {
    console.log(e);
    await browser.close();
    await server.shutdown();
    process.exit(1);
  }

  const failedResults = [];
  results.forEach(result => {
    const { url, violations } = result;
    if (violations && violations.length > 0) {
      failedResults.push({ url, violations });
    }
  });

  await browser.close();
  await server.shutdown();

  if (failedResults.length > 0) {
    console.error(`${failedResults.length} pages failed to be WCAG complaint:`);
    console.log(JSON.stringify(failedResults, null, 2));
    process.exit(1);
  }
};

wcagTester();