const HttpServer = require('../test-utils/server');
const path = require('path');

/**
 * Initalizes an http server for the provided fixture context
 * @param {*} ctx the context from the fixture
 */
export async function setupServer (ctx) {
  const server = new HttpServer({
    dir: path.resolve(__dirname, '../../test-site/public'),
    port: 9999
  })
  server.start();
  ctx.server = server;
}

/**
 * Shuts down the server for the provided fixture context
 * @param {*} ctx the context from the fixture
 */
export async function shutdownServer (ctx) {
  ctx.server.shutdown();
}