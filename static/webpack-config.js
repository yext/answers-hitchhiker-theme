const path = require('path');
const fs = require('file-system');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const { merge } = require('webpack-merge');
const { parse } = require('comment-json');

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

  const globalConfigPath = `./${jamboConfig.dirs.config}/global_config.json`;
  let globalConfig = null;
  if (fs.existsSync(globalConfigPath)) {
    globalConfigRaw = fs.readFileSync(globalConfigPath, 'utf-8');
    globalConfig = parse(globalConfigRaw);
  }

  const useJWT = globalConfig && globalConfig.useJWT
  let jamboInjectedData = process.env.JAMBO_INJECTED_DATA || null;
  jamboInjectedData = (jamboInjectedData && JSON.parse(jamboInjectedData));

  const getCleanedJamboInjectedData =
    require(`./${jamboConfig.dirs.output}/static/webpack/getCleanedJamboInjectedData.js`);

  let updatedJamboInjectedData = useJWT 
    ? getCleanedJamboInjectedData(jamboInjectedData)
    : jamboInjectedData

  const plugins = [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    ...htmlPlugins,
    new webpack.DefinePlugin({
      'process.env.JAMBO_INJECTED_DATA': updatedJamboInjectedData
        ? JSON.stringify(JSON.stringify(updatedJamboInjectedData))
        : null
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
      'HitchhikerCSS': `./${jamboConfig.dirs.output}/static/css-entry.js`,
      'iframe': `./${jamboConfig.dirs.output}/static/js/iframe.js`,
      'iframe-jwt': `./${jamboConfig.dirs.output}/static/js/iframe-jwt.js`,
      'iframe-jwt-prod': `./${jamboConfig.dirs.output}/static/js/iframe-jwt-prod.js`,
      'iframe-jwt-staging': `./${jamboConfig.dirs.output}/static/js/iframe-jwt-staging.js`,
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
      filename: '[name].js',
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
