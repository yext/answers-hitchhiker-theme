const loaderUtils = require('loader-utils');

/*
 * This webpack loader finds all instances of `\"./static/assets/images/<filename>\"` in an
 * HTML source, adds it as an import at the top of the file, and replaces its usages with
 * the import. This allows webpack to use the file-loader to return a correct relative path
 * to an asset. We also get asset hashing, and won't have duplicated assets.
 *
 * Note: this must be run after the HTML loader, as it relies on the following
 * (1) the html has been converted to javascript
 * (2) the double quotes are escaped (for the regex step)
 * (3) an html-loader helper function is available
 *
 * After this loader, you will see imports like the following at the top of the file
 * var ___HTML_ASSET_LOADER_MATCH_0___ =
 *   ___HTML_ASSET_LOADER_GET_SOURCE_FROM_IMPORT___(require("../static/assets/images/my-image.svg"));
 * 
 * In the browser, these usages will be changed to something that looks like
 * "../my-image.abcd1234.svg", where abcd1234 is the hash of this particular asset.
 * 
 * @param {string} source The source code of the file from the previous loader
 * @return {string} The modified source with updated asset imports
 */
module.exports = function loader(source) {
  const options = loaderUtils.getOptions(this) || {};

  let matchNumber = 0;
  const imports = [];
  const regex = options.regex;
  const getUrlImport = `
    var ___HTML_ASSET_LOADER_GET_SOURCE_FROM_IMPORT___ = function(relativePath, staticAssetModule) {
      const getHashedPath = require("html-loader/dist/runtime/getUrl.js");
      return relativePath + getHashedPath(staticAssetModule);
    }`;

  source = source.replace(regex, function(match, group1) {
    const variableName = `___HTML_ASSET_LOADER_MATCH_${matchNumber}___`;
    const sliceIndex = group1.indexOf('static/');
    const relativePath = group1.slice(0, sliceIndex);
    const staticAssetPath = group1.slice(sliceIndex);
    const importString =
      `var ${variableName} = ___HTML_ASSET_LOADER_GET_SOURCE_FROM_IMPORT___('${relativePath}', require('${staticAssetPath}'));`;

    matchNumber += 1;
    imports.push(importString);
    return `\\"" + ${variableName} + "\\"`;
  });

  return getUrlImport + '\n' + imports.join('\n') + '\n' + source;
}
