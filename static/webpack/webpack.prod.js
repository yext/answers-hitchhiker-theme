const { ESBuildMinifyPlugin } = require('esbuild-loader')

module.exports = () => {
  const InlineAssetHtmlPlugin = require('./InlineAssetHtmlPlugin');
  return {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
      new InlineAssetHtmlPlugin()
    ],
    module: {
      rules: [
        {
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
        }
      ]
    },
    optimization: {
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es5',
          css: true
        })
      ]
    },
  };
}