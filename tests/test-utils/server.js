const http = require('http');
const handler = require('serve-handler');

/**
 * A simple http server
 */
class HttpServer {
  /**
   * Constructs the server
   * 
   * @param {Object} config - The server config
   * @param {string} config.dir - The public directory to serve at
   * @param {number} config.port - The port to serve at
   */
  constructor ({dir, port}) {
    this._server = http.createServer((request, response) => {
      return handler(request, response, {
        "public": dir
      });
    });

    this._port = port;
  }

  /**
   * Starts the server
   */
  start () {
    this._server.listen(this._port);
  }

  /**
   * Shuts down the server
   */
  shutdown () {
    this._server.close();
  }
}

module.exports = HttpServer;