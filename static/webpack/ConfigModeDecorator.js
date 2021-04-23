const clonedeep = require('lodash.clonedeep');
const InlineAssetHtmlPlugin = require('./InlineAssetHtmlPlugin');

const BABEL_RULE = {
  test: /\.js$/,
  exclude: [
    /node_modules\//
  ],
  loader: 'babel-loader',
  options: {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      ['@babel/plugin-transform-runtime', {
        'corejs': 3
      }],
      '@babel/syntax-dynamic-import',
      '@babel/plugin-transform-arrow-functions',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-object-assign',
    ]
  }
};

/**
 * ConfigModeDecorate updates a webpack config for either 'development'
 * or 'production' mode optimizations.
 */
module.exports = class ConfigModeDecorator {
  /**
   * Decorates the webpack config for either 'development' or
   * 'production' mode
   *
   * @param {Object} webpackConfig 
   * @returns {Object}
   */
  decorate(webpackConfig) {
    const configToDecorate = clonedeep(webpackConfig);
    return this._isDevelopment()
      ? this._decorateForDev(configToDecorate)
      : this._decorateForProd(configToDecorate);
  }

  /**
   * Sets mode to development, removes minification step.
   * 
   * @param {Object} configToDecorate 
   * @returns {Object}
   */
  _decorateForDev(configToDecorate) {
    configToDecorate.mode = 'development';
    configToDecorate.optimization = {
      minimize: false
    };
    return configToDecorate;
  }

  /**
   * Sets mode to production, adds inlining plugin, adds babel rule.
   * 
   * @param {Object} configToDecorate 
   * @returns {Object}
   */
  _decorateForProd(configToDecorate) {
    configToDecorate.mode = 'production';
    configToDecorate.plugins = [...configToDecorate.plugins, new InlineAssetHtmlPlugin()];
    if (!configToDecorate.module) {
      configToDecorate.module = {};
    }
    const moduleRules = configToDecorate.module.rules || [];
    configToDecorate.module.rules = [...moduleRules, BABEL_RULE];
    return configToDecorate;
  }

  _isDevelopment() {
    const env = process.env || {};
    return env.IS_DEVELOPMENT_PREVIEW === 'true';
  }
}