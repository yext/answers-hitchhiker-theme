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

(async ()=> {
  const server = new HttpServer({
    dir: 'test-site/public',
    port: PORT
  });
  server.start();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const standardPageNavigator = new StandardPageNavigator(page, `http://localhost:${PORT}`);
  const iframePageNavigator = new IframePageNavigator(page, `http://localhost:${PORT}`, 'iframe_test');

  const standardCamera = new Camera(percySnapshot, page);
  const iframeCamera = new Camera(percySnapshot, page, true);

  await (new Photographer(standardPageNavigator, standardCamera).captureSnapshots());
  await (new Photographer(iframePageNavigator, iframeCamera).captureSnapshots());

  standardPageNavigator.setCurrentLocale('es');
  standardCamera.setLocale('es');
  
  await (new MultilangPhotographer(standardPageNavigator, standardCamera, queryConfig.es).captureSnapshots());

  await browser.close();
  server.shutdown();
})();
