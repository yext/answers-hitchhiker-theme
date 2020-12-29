
    var ___HTML_ASSET_LOADER_GET_SOURCE_FROM_IMPORT___ = function(staticAssetModule) {
      const getHashedPath = require("html-loader/dist/runtime/getUrl.js");
      return getHashedPath(staticAssetModule);
    }
var ___HTML_ASSET_LOADER_MATCH_0___ = ___HTML_ASSET_LOADER_GET_SOURCE_FROM_IMPORT___(require('static/assets/chizuru.gif'));
var ___HTML_ASSET_LOADER_MATCH_1___ = ___HTML_ASSET_LOADER_GET_SOURCE_FROM_IMPORT___(require('static/assets/chizuru.gif'));
// Module
var code = "<script> ANSWERS.registerTemplate(\"cards/test-name\",\"<img src='" + ___HTML_ASSET_LOADER_MATCH_0___ + "'>\\n<img src='../../" + ___HTML_ASSET_LOADER_MATCH_1___ + "'>\");</script> ";
// Exports
module.exports = code;