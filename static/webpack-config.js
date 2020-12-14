const path = require('path');
const fs = require('file-system');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

module.exports = function () {
  const jamboConfig = require('./jambo.json');
  const InlineAssetHtmlPlugin = require(
    `./${jamboConfig.dirs.output}/static/webpack/InlineAssetHtmlPlugin`
  );

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

  return {
    mode: 'production',
    target: ['web', 'es5'],
    entry: {
      'bundle': `./${jamboConfig.dirs.output}/static/entry.js`,
      'iframe': `./${jamboConfig.dirs.output}/static/js/iframe.js`,
      'answers': `./${jamboConfig.dirs.output}/static/js/iframe.js`,
      'overlay-button': `./${jamboConfig.dirs.output}/static/js/overlay/button-frame/entry.js`,
      'overlay': `./${jamboConfig.dirs.output}/static/js/overlay/parent-frame/yxtanswersoverlay.js`,
      'iframe-prod': `./${jamboConfig.dirs.output}/static/js/iframe-prod.js`,
      'iframe-staging': `./${jamboConfig.dirs.output}/static/js/iframe-staging.js`,
    },
    resolve: {
      alias: {
        static: path.resolve(__dirname, jamboConfig.dirs.output, 'static'),
      }
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, jamboConfig.dirs.output),
      library: 'HitchhikerJS',
      libraryTarget: 'window',
      publicPath: ''
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: '[name].css' }),
      ...htmlPlugins,
      new InlineAssetHtmlPlugin(),
      new webpack.EnvironmentPlugin({
        JAMBO_INJECTED_DATA: null
      }),
      new RemovePlugin({
        after: {
          root: `${jamboConfig.dirs.output}`,
          include: ['static'],
          log: true
        }
      })
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
        },
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
              options: {
                regex: /\\"([./]*static\/assets\/[^"]*)\\"/g
              }
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
  }
};
