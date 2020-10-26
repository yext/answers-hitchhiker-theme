/**
 * CssRelativeUrlTransformer is a postcss plugin that, for all "url()" attributes 
 * which contain relative urls, prepends them with a given relativePath.
 * This is needed because url() attributes from an imported stylesheet are
 * relative to the stylesheet itself, while url() attributes that are inlined
 * are relative to the webpage's url.
 * 
 * For more info on postcss plugins see:
 * https://github.com/postcss/postcss/blob/master/docs/writing-a-plugin.md
 * 
 * @param {string} relativePath does not have a slash at the end, e.g. "../.."
 * @returns {import('postcss').Plugin}
 */
module.exports = (relativePath) => {
  const PROCESSED = Symbol('processed');

  /**
   * Checks whether a css url() is absolute.
   * 
   * @param {string} url
   * @returns {boolean}
   */
  function isAbsoluteCssUrl(url) {
    return url.includes('//') || url.startsWith('/') || url.startsWith('#') || url.startsWith('data:');
  }

  /**
   * For a given css value, prepend all url attributes with a relative path.
   *
   * @param {string} cssValue the value half of a css key:value pair, something like
   *                          url(opensans-bold-webfont.woff) format("woff")
   * @returns {string}
   */
  function transformRelativeCssUrls(cssValue) {
    const urlAttributeRegex = /url\(["']?(.*?)\)/g;
    return cssValue.toString().replace(urlAttributeRegex, function(match, url) {
      if (isAbsoluteCssUrl(url)) {
        return match;
      }
      return match.replace(url, `${relativePath}/${url})`);
    });
  }

  return {
    postcssPlugin: 'CssRelativeUrlTransformer',

    /**
     * Transform all css key:value pairs that contain a "url()" attribute
     * Marks off processed nodes so they aren't revisited.
     *
     * @param {import('postcss').Declaration} decl https://postcss.org/api/#postcss-declaration
     */
    Declaration(decl) {
      if (!decl[PROCESSED] && decl.value.includes('url')) {
        decl.value = transformRelativeCssUrls(decl.value);
        decl[PROCESSED] = true;
      }
    }
  }
};

module.exports.postcss = true;