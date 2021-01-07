const { transformSync } = require('@babel/core');

/**
 * Babel-ifies the enclosed code, using the config below.
 * 
 * @param {import('handlebars').HelperOptions} options 
 * @returns {string|null}
 */
module.exports = function babel(options) {
  const srcCode = options.fn(this);
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
};
