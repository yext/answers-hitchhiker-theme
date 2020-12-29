const PercyScript = require('@percy/script');
const { ServerResponse } = require('http');
const httpServer = require('http-server');
const path = require('path');
const { waitTillHTMLRendered } = require('./utils');

const PORT = 5042;
const TEST_URL = `http://localhost:${PORT}`;

const captureHomepage = async (page, percySnapshot) => {
  await page.goto(`${TEST_URL}`);
  await waitTillHTMLRendered(page)
  await percySnapshot('homepage');
}

const captureUniversalSearch = async (page, percySnapshot) => {
  await page.goto(`${TEST_URL}/?query=a`);
  await waitTillHTMLRendered(page)
  await percySnapshot('universal-search');
}

const captureVerticalSearch = async (page, percySnapshot) => {
  await page.goto(`${TEST_URL}/events?query=a`);
  await waitTillHTMLRendered(page)
  await percySnapshot('vertical-search');
}

const captureVerticalGridSearch = async (page, percySnapshot) => {
  await page.goto(`${TEST_URL}/people?query=a`);
  await waitTillHTMLRendered(page)
  await percySnapshot('vertical-grid-search');
}

const captureVerticalMapSearch = async (page, percySnapshot) => {
  await page.goto(`${TEST_URL}/locations?query=a`);
  await waitTillHTMLRendered(page)
  await percySnapshot('vertical-map-search');
}

PercyScript.run(captureHomepage);
PercyScript.run(captureUniversalSearch);
PercyScript.run(captureVerticalSearch);
PercyScript.run(captureVerticalGridSearch);
PercyScript.run(captureVerticalMapSearch);
