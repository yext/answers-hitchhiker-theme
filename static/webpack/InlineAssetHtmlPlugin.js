const jsdom = require('jsdom');
const HtmlPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

/**
 * The InlineAssetHtmlPlugin will take HTML files added through the HtmlWebpackPlugin
 * and inline js and css assets into the HTML, saving a request to the desired asset.
 * It does so by looking for script/link tags with the "data-webpack-inline" attribute.
 * It then replaces that tag with the content of the file from the webpack compilation.
 */
class InlineAssetHtmlPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('InlineAssetHtmlPlugin', compilation => {
      const hooks = HtmlPlugin.getHooks(compilation);
      hooks.beforeEmit.tap('InlineAssetHtmlPlugin', assets => {
        const assetsMap = compilation.assets;
        assets.html = this.getHtmlWithInlineAssets(assets.html, assetsMap);
        const outputDir = compilation.options.output.path;
        const relativeDir = path.dirname(assets.outputName);
        const assetsDir = path.resolve(outputDir, relativeDir);
        this._copyAssetsToOutputDir(assetsDir, assetsMap);
      });
    });
  }

  /**
   * Copies all assets to the given assetsDir directory.
   * 
   * @param {string} assetsDir
   * @param {Object<String, Source>} assetsMap Mapping from asset name to asset content,
   *                                           provided by webpack compilation
   */
  _copyAssetsToOutputDir(assetsDir, assetsMap) {
    Object.entries(assetsMap).forEach(([fileName, fileSource]) => {
      fs.writeFileSync(path.resolve(assetsDir, fileName), fileSource.source());
    });
  }

  /**
   * Returns the html with script/link tags asset content inlined in the HTML if specified.
   * HTML elements are only replaced with inlined versions if they have the data attribute
   * "data-webpack-inline"
   *
   * @param {String} html The html of the page to analyze tags and replace with inlined 
   * @param {Object<String, Source>} assetsMap Mapping from asset name to asset content,
   *                                           provided by webpack compilation
   */
  getHtmlWithInlineAssets (html, assetsMap) {
    const dom = new jsdom.JSDOM(html);
    this._inlineScripts(dom, assetsMap);
    this._inlineLinks(dom, assetsMap);
    return dom.serialize();
  }

  /**
   * Update data-webpack-inline scripts in the DOM with the inlined assets
   *
   * @param {Object} dom The parsed DOM, transformed with inline assets
   * @param {Object<String, Source>} assetsMap Mapping from asset name to asset content,
   *                                           provided by webpack compilation
   */
  _inlineScripts (dom, assetsMap) {
    dom.window.document.querySelectorAll('script[data-webpack-inline]').forEach((scriptNode) => {
      const scriptSource = scriptNode.src;
      const fileContents = this._getAssetContents(scriptSource, assetsMap);

      scriptNode.innerHTML = fileContents;
      scriptNode.dataset.fileName = scriptSource;
      scriptNode.removeAttribute('src');
    });
  }

  /**
   * Replace data-webpack-inline links in the DOM with the inlined assets in a style tag
   *
   * @param {Object} dom The parsed DOM, transformed with inline assets
   * @param {Object<String, Source>} assetsMap Mapping from asset name to asset content,
   *                                           provided by webpack compilation
   */
  _inlineLinks (dom, assetsMap) {
    dom.window.document.querySelectorAll('link[data-webpack-inline]').forEach((linkNode) => {
      const fileContents = this._getAssetContents(linkNode.href, assetsMap);

      const styleNode = dom.window.document.createElement('style');
      styleNode.innerHTML = fileContents;
      styleNode.dataset.fileName = linkNode.href;
      styleNode.dataset.webpackInline = '';
      linkNode.parentNode.insertBefore(styleNode, linkNode.nextSibling);
      linkNode.remove();
    });
  }

  /**
   * Get the webpack source for a particular asset url, after stripping off
   * the relative path.
   *
   * @param {string} url The src or href value of the asset
   * @param {Object<String, Source>} assetsMap Mapping of asset name to asset content
   * @returns {string}
   */
  _getAssetContents(url, assetsMap) {
    const assetName = path.basename(url);
    const assetSource = assetsMap[assetName];
    if (!assetSource) {
      throw new Error(
        `Unable to find inline asset '${assetName}' in webpack compilation.\n` +
        `The following assets are available: \n${Object.keys(assetsMap).join('\n')}`
      );
    }
    return assetSource.source();
  }
}

module.exports = InlineAssetHtmlPlugin;
