const path = require('path');
const fs = require('file-system');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ClosurePlugin = require('closure-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

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

  const entries = {
    bundle: './static/entry.js',
  }
  if (process.env.HIDE_IFRAME != 'true') {
    Object.assign(
      entries, 
      { iframe: './static/js/iframe.js', },
    );
  }

  return {
    mode: 'production',
    entry: entries,
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
        ['STAGING_DOMAIN', 'PROD_DOMAIN']
      ),
    ],
    optimization: {
      minimizer: [new ClosurePlugin()]
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'resolve-url-loader',
            'sass-loader'
          ],
        },
        {
          test: /\.(png|ico|gif|jpe?g|svg|webp|eot|otf|ttf|woff2?)$/,
          loader: 'file-loader?name=[name].[contenthash].[ext]',
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
          options: {
            attributes: {
              /**
               * @param {String} _ the html attribute like 'href' or 'src'
               * @param {String} value the path to the static asset
               */
              urlFilter: (_, value) => {
                const assetsDir = '../static/assets/';
                return value.startsWith(assetsDir);
              },
              list: [
                {
                  tag: 'img',
                  attribute: 'src',
                  type: 'src',
                },
                {
                  tag: 'link',
                  attribute: 'href',
                  type: 'src',
                },
                {
                  tag: 'meta',
                  attribute: 'content',
                  type: 'src',
                }
              ]
            }
          }
        }
      ],
    },
  }
};
