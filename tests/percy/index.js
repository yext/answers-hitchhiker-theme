const PercyScript = require('@percy/script');
const HttpServer = require('./server');
const SnapshotDirector = require('./snapshotdirector');
const StandardPhotographer = require('./standardphotographer');
const IframePhotographer = require('./iframephotographer');

const PORT = 5042;

PercyScript.run(async (page, percySnapshot) => {
  const server = new HttpServer({
    dir: 'test-site/public',
    port: PORT
  })

  server.start();

  const standardPhotographer = new StandardPhotographer({
    page: page,
    percySnapshot: percySnapshot,
    siteUrl: `http://localhost:${PORT}`,
  });

  const iframePhotographer = new IframePhotographer({
    page: page,
    percySnapshot: percySnapshot,
    siteUrl: `http://localhost:${PORT}`,
    iframePage: 'iframe_test'
  });

  const snapshotDirector = new SnapshotDirector(standardPhotographer);
  await snapshotDirector.direct();
  snapshotDirector.setPhotographer(iframePhotographer);
  await snapshotDirector.direct();

  server.shutdown();
});