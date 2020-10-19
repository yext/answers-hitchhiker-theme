const loaderUtils = require('loader-utils');

/*
 * This webpack loader finds all instances of `\"static/assets/images/<filename>\"` in an
 * HTML source, adds it as an import at the top of the file, and replaces its usages with
 * the import. This allows webpack to use the file-loader to return a correct relative path
 * to an asset. We also get asset hashing.
 *
 * Note: this must be run after the HTML loader, as it relies on the following
 * (1) the html has been converted to javascript
 * (2) the double quotes are escaped (for the regex step)
 * (3) an html-loader helper function is available
 *
 * After this loader, you will see imports like the following at the top of the file
 * var ___HTML_ASSET_LOADER_MATCH_0___ = ___HTML_ASSET_LOADER_GET_SOURCE_FROM_IMPORT___(require("./static/assets/images/test2.svg"));
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
    var ___HTML_ASSET_LOADER_GET_SOURCE_FROM_IMPORT___ = function(relativePath, asset) {
      const getHashedPath = require("html-loader/dist/runtime/getUrl.js");
      return relativePath + getHashedPath(asset);
    }`;

  source = source.replace(regex, function(match, group1) {
    const variableName = `___HTML_ASSET_LOADER_MATCH_${matchNumber}___`;
    const requirePath = loaderUtils.stringifyRequest(this, loaderUtils.urlToRequest(group1));
    const relativePath = requirePath.substring(1, requirePath.indexOf('static')); // TODO this is a hack
    const importString = `var ${variableName} = ___HTML_ASSET_LOADER_GET_SOURCE_FROM_IMPORT___('${relativePath}', require(${requirePath}));`;

    matchNumber += 1;
    imports.push(importString);
    return `\\"" + ${variableName} + "\\"`;
  });

  source = getUrlImport + '\n' + imports.join('\n') + '\n' + source;
  return source;
}

