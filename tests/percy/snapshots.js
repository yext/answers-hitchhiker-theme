const PercyScript = require('@percy/script');
const HttpServer = require('./server');
const { waitTillHTMLRendered } = require('./utils');

const PORT = 5042;
const TEST_SITE = `http://localhost:${PORT}`;


PercyScript.run(async (page, percySnapshot) => {
  const server = new HttpServer({
    dir: 'test-site/public',
    port: PORT
  })

  server.start();

  await captureHomepage(page, percySnapshot);
  await captureUniversalSearch(page, percySnapshot);
  await captureVerticalSearch(page, percySnapshot);
  await captureVerticalGridSearch(page, percySnapshot);
  await captureVerticalMapSearch(page, percySnapshot);

  server.shutdown();
});

async function captureHomepage (page, percySnapshot) {
  await page.goto(TEST_SITE);
  await waitTillHTMLRendered(page)
  await percySnapshot('homepage');
}

async function captureUniversalSearch (page, percySnapshot) {
  await page.goto(`${TEST_SITE}/?query=a`);
  await waitTillHTMLRendered(page)
  await percySnapshot('universal-search');
}

async function captureVerticalSearch (page, percySnapshot) {
  await page.goto(`${TEST_SITE}/events?query=a`);
  await waitTillHTMLRendered(page)
  await percySnapshot('vertical-search');
}

async function captureVerticalGridSearch (page, percySnapshot) {
  await page.goto(`${TEST_SITE}/people?query=a`);
  await waitTillHTMLRendered(page)
  await percySnapshot('vertical-grid-search');
}

async function captureVerticalMapSearch (page, percySnapshot) {
  await page.goto(`${TEST_SITE}/locations?query=a`);
  await waitTillHTMLRendered(page)
  await percySnapshot('vertical-map-search');
}