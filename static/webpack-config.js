const path = require('path');
const fs = require('file-system');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

module.exports = function () {
  const jamboConfig = JSON.parse(fs.readFileSync('jambo.json'))
  const htmlPlugins = [];
  if (fs.existsSync(jamboConfig.dirs.output)) {
    fs.recurseSync(jamboConfig.dirs.output, ['**/*.html'], (filepath, relative) => {
      htmlPlugins.push(new HtmlPlugin({
        filename: relative,
        template: path.join(jamboConfig.dirs.output, relative),
        inject: false
      }));
    });
  }

  return {
    mode: 'production',
    entry: {
      'bundle': `./${jamboConfig.dirs.output}/static/entry.js`,
      'iframe': `./${jamboConfig.dirs.output}/static/js/iframe.js`,
      'answers': `./${jamboConfig.dirs.output}/static/js/iframe.js`,
      'iframe-prod': `./${jamboConfig.dirs.output}/static/js/iframe-prod.js`,
      'iframe-staging': `./${jamboConfig.dirs.output}/static/js/iframe-staging.js`,
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, jamboConfig.dirs.output),
      library: 'HitchhikerJS',
      libraryTarget: 'window'
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: 'bundle.css' }),
      ...htmlPlugins,
      new webpack.EnvironmentPlugin(
        ['JAMBO_INJECTED_DATA']
      ),
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
          query: {
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
          loader: 'file-loader?name=[name].[contenthash].[ext]',
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
                  minifyCSS: true,
                  minifyJS: true,
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
