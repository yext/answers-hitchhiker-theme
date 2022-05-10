const HttpServer = require('../test-utils/server');
const StandardPageNavigator = require('./standardpagenavigator');
const IframePageNavigator = require('./iframepagenavigator');
const Camera = require('./camera');
const puppeteer = require('puppeteer');
const percySnapshot = require('@percy/puppeteer');
const PageOperator = require('../browser-automation/pageoperator');
const getTestingLocations = require('../browser-automation/testlocations');
const PORT = 5042;

async function defaultSnapshots(page) {
  const standardPageNavigator = new StandardPageNavigator(page, `http://localhost:${PORT}`);
  const standardCamera = new Camera(percySnapshot, page);
  await captureSnapshots(standardPageNavigator, page, standardCamera);
}

async function iframeSnapshots(page) {
  const iframePageNavigator = new IframePageNavigator(page, `http://localhost:${PORT}`, 'iframe_test');
  const iframeCamera = new Camera(percySnapshot, page, true);
  await captureSnapshots(iframePageNavigator, page, iframeCamera);
}

async function spanishSnapshots(page) {
  const standardPageNavigator = new StandardPageNavigator(page, `http://localhost:${PORT}`);
  const standardCamera = new Camera(percySnapshot, page);
  standardPageNavigator.setCurrentLocale('es');
  standardCamera.setLocale('es');
  await captureSnapshots(standardPageNavigator, page, standardCamera, 'es');
}

async function rtlSnapshots(page) {
  const standardPageNavigator = new StandardPageNavigator(page, `http://localhost:${PORT}`);
  const standardCamera = new Camera(percySnapshot, page);
  standardPageNavigator.setCurrentLocale('ar');
  standardCamera.setLocale('ar');
  await captureSnapshots(standardPageNavigator, page, standardCamera, 'ar');
}

async function captureSnapshots(navigator, page, camera, locale = 'en') {
  try {
    const operator = new PageOperator(navigator, page, getTestingLocations(locale));
    while (operator.hasNextTestLocation()) {
      const testConfig = await operator.nextTestLocation();
      if (testConfig.viewport) {
        testConfig.viewport === 'mobile'
          ? await camera.snapshotMobileOnly(testConfig.name)
          : await camera.snapshotDesktopOnly(testConfig.name);
      } else {
        await camera.snapshot(testConfig.name);
      }
    }
  } catch (e) {
    console.error('Error taking snapshot of', testConfig.name);
    console.error(e);
    process.exit(1);
  }
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
    await rtlSnapshots(page);
  } else if (snapshotType === 'spanish') {
    await spanishSnapshots(page);
  } else if (snapshotType === 'iframe') {
    await iframeSnapshots(page);
  } else {
    await defaultSnapshots(page);
  }

  await browser.close();
  server.shutdown();
};

runPercyTest();