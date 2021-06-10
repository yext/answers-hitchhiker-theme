const PercyScript = require('@percy/script');
const HttpServer = require('../test-utils/server');
const Photographer = require('./photographer');
const StandardPageNavigator = require('./standardpagenavigator');
const IframePageNavigator = require('./iframepagenavigator');
const Camera = require('./camera');

const PORT = 5042;

PercyScript.run(async (page, percySnapshot) => {
  const server = new HttpServer({
    dir: 'test-site/public',
    port: PORT
  })

  server.start();

  const standardPageNavigator = new StandardPageNavigator(page, `http://localhost:${PORT}`);
  const iframePageNavigator = new IframePageNavigator(page, `http://localhost:${PORT}`, 'iframe_test');
  
  const es_standardPageNavigator = new StandardPageNavigator(page, `http://localhost:${PORT}`);
  const es_iframePageNavigator = new IframePageNavigator(page, `http://localhost:${PORT}/es/`, 'iframe_test');

  const standardCamera = new Camera(percySnapshot);
  // const iframeCamera = new Camera(percySnapshot, true);

  await (new Photographer(es_standardPageNavigator, standardCamera).captureSnapshotsES());


  // await (new Photographer(standardPageNavigator, standardCamera).captureSnapshots());
  
  // await (new Photographer(iframePageNavigator, iframeCamera).captureSnapshots());
  // await (new Photographer(es_iframePageNavigator, iframeCamera).captureSnapshotsES());

  server.shutdown();
});