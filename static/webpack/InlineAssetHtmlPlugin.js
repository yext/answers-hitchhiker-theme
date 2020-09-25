'use strict'

const jsdom = require('jsdom');
const HtmlPlugin = require('html-webpack-plugin');

/**
 * The InlineAssetHtmlPlugin will take HTML files added through the HtmlWebpackPlugin
 * and inline js and css assets into the HTML, saving a request to the desired asset.
 * It does so by looking for script/link tags with the "data-webpack-inline" attribute.
 * It then replaces that tag with the content of the file from the webpack compilation.
 */
class InlineAssetHtmlPlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.compilation.tap('InlineAssetHtmlPlugin', compilation => {
      const hooks = HtmlPlugin.getHooks(compilation);
      hooks.beforeEmit.tap('InlineAssetHtmlPlugin', assets => {
        assets.html = this.getHtmlWithInlineAssets(assets.html, compilation.assets);
      });
    });
  }

  /**
   * Returns the the html with script/link tags asset content inlined in the HTML if specified.
   * HTML elements are only replaced with inlined versions if they have the data attribute
   * "data-webpack-inline"
   * @param {String} html The html of the page to analyze tags and replace with inlined 
   * @param {Object<String, RawSource>} assetsMap Mapping from asset name to asset content,
   *                                    provided by webpack compilation
   */
  getHtmlWithInlineAssets (html, assetsMap) {
    const dom = new jsdom.JSDOM(html);
    dom.window.document.querySelectorAll('script[data-webpack-inline]').forEach((scriptNode) => {
      const fileContents = assetsMap[scriptNode.src];
      if (!fileContents) {
        console.error(`Unable to find desired inline asset '${scriptNode.src}' in webpack compilation`);
        return;
      }

      const inlineScriptNode = dom.window.document.createElement('script');
      inlineScriptNode.innerHTML = fileContents.source();
      inlineScriptNode.dataset.fileName = scriptNode.src;
      scriptNode.parentNode.insertBefore(inlineScriptNode, scriptNode.nextSibling);
      scriptNode.remove();
    });

    dom.window.document.querySelectorAll('link[data-webpack-inline]').forEach((linkNode) => {
      const fileContents = assetsMap[linkNode.href];
      if (!fileContents) {
        console.error(`Unable to find desired inline asset '${linkNode.href}' in webpack compilation`);
        return;
      }

      const styleNode = dom.window.document.createElement('style');
      styleNode.innerHTML = fileContents.source();
      styleNode.dataset.fileName = linkNode.href;
      linkNode.parentNode.insertBefore(styleNode, linkNode.nextSibling);
      linkNode.remove();
    });
    return dom.serialize();
  }
}

module.exports = InlineAssetHtmlPlugin;
