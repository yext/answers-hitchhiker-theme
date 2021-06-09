const path = require('path');
const fs = require('file-system');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const { merge } = require('webpack-merge');

module.exports = function () {
  const jamboConfig = require('./jambo.json');
  const htmlPlugins = [];

  const htmlAssetPathToOutputFilename = {
    'static/js/overlay/button-frame/button.html': 'overlay-button.html'
  };
  if (fs.existsSync(jamboConfig.dirs.output)) {
    fs.recurseSync(jamboConfig.dirs.output, ['**/*.html'], (filepath, relative) => {
      const outputFilename = htmlAssetPathToOutputFilename[relative] || relative;

      htmlPlugins.push(new HtmlPlugin({
        filename: outputFilename,
        template: path.join(jamboConfig.dirs.output, relative),
        inject: false
      }));
    });
  }

  const plugins = [
    new MiniCssExtractPlugin({
      filename: pathData => {
        const chunkName = pathData.chunk.name;
        return {
          HitchhikerJS: 'bundle.css',
        }[chunkName] || '[name].css'
      }
    }),
    ...htmlPlugins,
    new webpack.EnvironmentPlugin({
      JAMBO_INJECTED_DATA: null
    }),
    new RemovePlugin({
      after: {
        root: `${jamboConfig.dirs.output}`,
        include: ['static'],
        log: false
      }
    })
  ];

  const commonConfig = {
    devtool: 'source-map',
    stats: 'errors-warnings',
    performance: {
      maxAssetSize: 1536000,
      maxEntrypointSize: 1024000
    },
    target: ['web', 'es5'],
    entry: {
      'HitchhikerJS': `./${jamboConfig.dirs.output}/static/entry.js`,
      'iframe': `./${jamboConfig.dirs.output}/static/js/iframe.js`,
      'answers': `./${jamboConfig.dirs.output}/static/js/iframe.js`,
      'overlay-button': `./${jamboConfig.dirs.output}/static/js/overlay/button-frame/entry.js`,
      'overlay': `./${jamboConfig.dirs.output}/static/js/overlay/parent-frame/yxtanswersoverlay.js`,
      'iframe-prod': `./${jamboConfig.dirs.output}/static/js/iframe-prod.js`,
      'iframe-staging': `./${jamboConfig.dirs.output}/static/js/iframe-staging.js`,
      'VerticalFullPageMap': `./${jamboConfig.dirs.output}/static/js/VerticalFullPageMap.js`
    },
    resolve: {
      alias: {
        static: path.resolve(__dirname, jamboConfig.dirs.output, 'static'),
      }
    },
    output: {
      filename: pathData => {
        const chunkName = pathData.chunk.name;
        return {
          VerticalFullPageMap: 'locator-bundle.js',
          HitchhikerJS: 'bundle.js',
        }[chunkName] || '[name].js'
      },
      library: '[name]',
      path: path.resolve(__dirname, jamboConfig.dirs.output),
      libraryTarget: 'window',
      publicPath: ''
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              }
            }
          ],
        },
        {
          test: /\.(png|ico|gif|jpe?g|svg|webp|eot|otf|ttf|woff2?)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]'
          }
        },
        {
          test: /\.html$/i,
          use: [
            {
              loader: path.resolve(__dirname, `./${jamboConfig.dirs.output}/static/webpack/html-asset-loader.js`),
            },
            {
              loader: 'html-loader',
              options: {
                minimize: {
                  removeAttributeQuotes: false,
                  collapseWhitespace: true,
                  conservativeCollapse: true,
                  keepClosingSlash: true,
                  minifyCSS: false,
                  minifyJS: false,
                  removeComments: true,
                  removeScriptTypeAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  useShortDoctype: true
                },
                attributes: false
              }
            }
          ]
        }
      ],
    },
  };

  const isDevelopment = (process.env || {}).IS_DEVELOPMENT_PREVIEW === 'true';
  if (isDevelopment) {
    const devConfig = require(
      `./${jamboConfig.dirs.output}/static/webpack/webpack.dev.js`
    )();
    return merge(commonConfig, devConfig);
  } else {
    const prodConfig = require(
      `./${jamboConfig.dirs.output}/static/webpack/webpack.prod.js`
    )();
    return merge(commonConfig, prodConfig);
  }
};
