const PercyScript = require('@percy/script');
const HttpServer = require('./server');
const SnapshotDirector = require('./snapshotdirector');
const StandardPhotographer = require('./standardphotographer');
const IframePhotographer = require('./iframephotographer');
const Camera = require('./camera');

const PORT = 5042;

PercyScript.run(async (page, percySnapshot) => {
  const server = new HttpServer({
    dir: 'test-site/public',
    port: PORT
  })

  server.start();

  const standardPhotographer = new StandardPhotographer({
    page: page,
    siteUrl: `http://localhost:${PORT}`,
  });
  const iframePhotographer = new IframePhotographer({
    page: page,
    siteUrl: `http://localhost:${PORT}`,
    iframePage: 'iframe_test'
  });
  const standardCamera = new Camera({ percySnapshot: percySnapshot });
  const iframeCamera = new Camera({ 
    percySnapshot: percySnapshot,
    iframeMode: true
  });

  await (new SnapshotDirector({
    photographer: standardPhotographer,
    camera: standardCamera
  }).direct());
  await (new SnapshotDirector({
    photographer: iframePhotographer,
    camera: iframeCamera
  }).direct());

  server.shutdown();
});