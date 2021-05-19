const { transformSync } = require('@babel/core');

/**
 * Babel-ifies the enclosed code, using the config below. Note that if the 
 * IS_DEVELOPMENT_PREVIEW environment variable is set to 'true', the enclosed
 * code is returned verbatim. This is an optimization for the build preview. 
 * 
 * @param {import('handlebars').HelperOptions} options 
 * @returns {string|null}
 */
module.exports = function babel(options) {
  const srcCode = options.fn(this);

  if (process.env.IS_DEVELOPMENT_PREVIEW === 'true' ) {
    return srcCode;
  } else {
    return transformSync(srcCode, {
      compact: true,
      minified: true,
      comments: false,
      sourceType: 'script',
      presets: ['@babel/preset-env'],
      plugins: [
        '@babel/syntax-dynamic-import',
        '@babel/plugin-transform-arrow-functions',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-transform-object-assign',
      ]
    }).code;
  }
};
