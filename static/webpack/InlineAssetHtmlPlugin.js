'use strict'

/**
 * The InlineAssetHtmlPlugin will take HTML files added through the HtmlWebpackPlugin
 * and inline js and css assets into the HTML, saving a request to the desired asset.
 * It does so by looking for script/link tags with the "data-webpack-inline" attribute.
 * It then replaces that tag with the content of the file from the webpack compilation.
 */
class InlineAssetHtmlPlugin {
  constructor(htmlWebpackPlugin) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InlineAssetHtmlPlugin', compilation => {
      const hooks = this.htmlWebpackPlugin.getHooks(compilation);
      hooks.beforeEmit.tap('InlineAssetHtmlPlugin', assets => {
        assets.html = this.getHtmlWithInlineAssets(assets.html, compilation.assets);
      });
    });
  }

  /**
   * Returns the the html with script/link tags asset content inlined in the HTML if specified
   * HTML elements  are only replaced with inlined versions if they have the data attribute
   * "data-webpack-inline"
   * @param {String} html The html of the page to analyze tags and replace with inlined 
   * @param {Object<String, RawSource>} assetsMap Mapping from asset name to asset content,
   *                                 provided by webpack compilation
   */
  getHtmlWithInlineAssets (html, assetsMap) {
    const cssInlineRegExp = /<link rel="stylesheet" href="([^>]*\.css)" data-webpack-inline>/gmi;
    const scriptInlineRegExp = /<script src="([^>]*\.js)" data-webpack-inline><\/script>/gmi;
    let newHtml = html;
    newHtml = newHtml.replace(scriptInlineRegExp, (match, p1) => {
      if (assetsMap[p1]) {
        return `<script>${assetsMap[p1].source()}</script>`;
      }
      console.error("Unable to find desired inline script in webpack compilation");
    });
    newHtml = newHtml.replace(cssInlineRegExp, (match, p1) => {
      if (assetsMap[p1]) {
        return `<style>${assetsMap[p1].source()}</style>`;
      }
      console.error("Unable to find desired inline link in webpack compilation");
    });
    return newHtml;
  }
}

module.exports = InlineAssetHtmlPlugin;
