
    var ___HTML_ASSET_LOADER_GET_SOURCE_FROM_IMPORT___ = function(staticAssetModule) {
      const getHashedPath = require("html-loader/dist/runtime/getUrl.js");
      return getHashedPath(staticAssetModule);
    }
var ___HTML_ASSET_LOADER_MATCH_0___ = ___HTML_ASSET_LOADER_GET_SOURCE_FROM_IMPORT___(require('static/assets/chizuru.gif'));
var ___HTML_ASSET_LOADER_MATCH_1___ = ___HTML_ASSET_LOADER_GET_SOURCE_FROM_IMPORT___(require('static/assets/chizuru.gif'));
// Module
var code = "<img src=\"" + ___HTML_ASSET_LOADER_MATCH_0___ + "\"> <img src=\"../" + ___HTML_ASSET_LOADER_MATCH_1___ + "\">";
// Exports
module.exports = code;