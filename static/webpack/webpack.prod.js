const InlineAssetHtmlPlugin = require('./InlineAssetHtmlPlugin');

module.exports = () => {
  const mode = 'production';
  const plugins = [ new InlineAssetHtmlPlugin() ];

  const legacyProdConfig = {
    mode,
    plugins,
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
    }
  };
  const modernProdConfig = { 
    mode, 
    plugins,
    output: {
      filename: pathData => {
        const chunkName = pathData.chunk.name;
        return {
          VerticalFullPageMap: 'locator-bundle-modern.js',
          HitchhikerJS: 'bundle-modern.js',
        }[chunkName] || '[name]-modern.js'
      },
      library: '[name]',
      path: path.resolve(__dirname, jamboConfig.dirs.output),
      libraryTarget: 'window',
      publicPath: ''
    }
  };

  return { legacyProdConfig, modernProdConfig };
}