const HttpServer = require('../test-utils/server');
const Photographer = require('./photographer');
const MultilangPhotographer = require('./multilangphotographer');
const StandardPageNavigator = require('./standardpagenavigator');
const IframePageNavigator = require('./iframepagenavigator');
const Camera = require('./camera');
const queryConfig = require('./queries.json');
const puppeteer = require('puppeteer');
const percySnapshot = require('@percy/puppeteer');
const PORT = 5042;

async function defaultSnapshots(page) {
  const standardPageNavigator = new StandardPageNavigator(page, `http://localhost:${PORT}`);
  const standardCamera = new Camera(percySnapshot, page);
  await (new Photographer(standardPageNavigator, standardCamera).captureSnapshots());
}

async function iframeSnapshots(page) {
  const iframePageNavigator = new IframePageNavigator(page, `http://localhost:${PORT}`, 'iframe_test');
  const iframeCamera = new Camera(percySnapshot, page, true);
  await (new Photographer(iframePageNavigator, iframeCamera).captureSnapshots());
}

async function nonEnglishSnapshots(page) {
  const standardPageNavigator = new StandardPageNavigator(page, `http://localhost:${PORT}`);
  const standardCamera = new Camera(percySnapshot, page);
  standardPageNavigator.setCurrentLocale('es');
  standardCamera.setLocale('es');
  await (new MultilangPhotographer(standardPageNavigator, standardCamera, queryConfig.es).captureSnapshots());
}

async function RtlSnapshots(page) {
  const standardPageNavigator = new StandardPageNavigator(page, `http://localhost:${PORT}`);
  const standardCamera = new Camera(percySnapshot, page);
  standardPageNavigator.setCurrentLocale('ar');
  standardCamera.setLocale('ar');
  await (new MultilangPhotographer(standardPageNavigator, standardCamera, queryConfig.ar).captureSnapshots());
}

async function runPercyTest() {
  const server = new HttpServer({
    dir: 'test-site/public',
    port: PORT
  });
  server.start();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const snapshotType = process.argv[2];
  if (snapshotType === 'rtl') {
    await RtlSnapshots(page);
  } else if (snapshotType === 'non-english') {
    await nonEnglishSnapshots(page);
  }else if (snapshotType === 'iframe') {
    await iframeSnapshots(page);
  } else {
    await defaultSnapshots(page);
  }

  await browser.close();
  server.shutdown();
};

runPercyTest();