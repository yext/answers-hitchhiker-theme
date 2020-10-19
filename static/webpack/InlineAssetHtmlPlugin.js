const jsdom = require('jsdom');
const HtmlPlugin = require('html-webpack-plugin');

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
        assets.html = this.getHtmlWithInlineAssets(assets.html, compilation.assets);
      });
    });
  }

  /**
   * Returns the html with script/link tags asset content inlined in the HTML if specified.
   * HTML elements are only replaced with inlined versions if they have the data attribute
   * "data-webpack-inline"
   * @param {String} html The html of the page to analyze tags and replace with inlined 
   * @param {Object<String, RawSource>} assetsMap Mapping from asset name to asset content,
   *                                              provided by webpack compilation
   */
  getHtmlWithInlineAssets (html, assetsMap) {
    const dom = new jsdom.JSDOM(html);
    this._inlineScripts(dom, assetsMap);
    this._inlineLinks(dom, assetsMap);
    return dom.serialize();
  }

  /**
   * Update data-webpack-inline scripts in the DOM with the inlined assets
   * @param {Object} dom The parsed DOM, transformed with inline assets
   * @param {Object<String, RawSource>} assetsMap Mapping from asset name to asset content,
   *                                              provided by webpack compilation
   */
  _inlineScripts (dom, assetsMap) {
    dom.window.document.querySelectorAll('script[data-webpack-inline]').forEach((scriptNode) => {
      const scriptSource = scriptNode.src;
      const fileContents = assetsMap[scriptSource];
      if (!fileContents) {
        console.error(`Unable to find desired inline asset '${scriptNode.src}' in webpack compilation`);
        return;
      }

      scriptNode.innerHTML = fileContents.source();
      scriptNode.dataset.fileName = scriptSource;
      scriptNode.removeAttribute('src');
    });
  }

  /**
   * Replace data-webpack-inline links in the DOM with the inlined assets in a style tag
   * @param {Object} dom The parsed DOM, transformed with inline assets
   * @param {Object<String, RawSource>} assetsMap Mapping from asset name to asset content,
   *                                              provided by webpack compilation
   */
  _inlineLinks (dom, assetsMap) {
    dom.window.document.querySelectorAll('link[data-webpack-inline]').forEach((linkNode) => {
      const fileContents = assetsMap[linkNode.href];
      if (!fileContents) {
        console.error(`Unable to find desired inline asset '${linkNode.href}' in webpack compilation`);
        return;
      }

      const styleNode = dom.window.document.createElement('style');
      styleNode.innerHTML = fileContents.source();
      styleNode.dataset.fileName = linkNode.href;
      styleNode.dataset.webpackInline = '';
      linkNode.parentNode.insertBefore(styleNode, linkNode.nextSibling);
      linkNode.remove();
    });
  }
}

module.exports = InlineAssetHtmlPlugin;
