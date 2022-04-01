const path = require('path');
const fs = require('file-system');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const { merge } = require('webpack-merge');
const { parse } = require('comment-json');
const RtlCssPlugin = require('rtlcss-webpack-plugin');

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
  let globalConfig = {};
  if (fs.existsSync(globalConfigPath)) {
    globalConfigRaw = fs.readFileSync(globalConfigPath, 'utf-8');
    globalConfig = parse(globalConfigRaw);
  }

  const cssRtlPlugin = [];
  const isRTL = require(`./${jamboConfig.dirs.output}/static/common/rtl`);
  const localeConfigPath = `./${jamboConfig.dirs.config}/locale_config.json`;
  if (fs.existsSync(localeConfigPath)) {
    localeConfigRaw = fs.readFileSync(localeConfigPath, 'utf-8');
    localeConfig = parse(localeConfigRaw);
    const hasRtlLocale = Object.keys(localeConfig.localeConfig).some((locale) => isRTL(locale));
    if(hasRtlLocale) {
      cssRtlPlugin.push(new RtlCssPlugin({
        filename: '[name].rtl.css'
      }));
    }
  }

  const { useJWT } = globalConfig;

  let jamboInjectedData = process.env.JAMBO_INJECTED_DATA || null;
  if (useJWT && jamboInjectedData) {
    const getCleanedJamboInjectedData =
      require(`./${jamboConfig.dirs.output}/static/webpack/getCleanedJamboInjectedData.js`);
    jamboInjectedData = JSON.parse(jamboInjectedData)
    jamboInjectedData = getCleanedJamboInjectedData(jamboInjectedData)
    jamboInjectedData = JSON.stringify(jamboInjectedData)
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
    ...cssRtlPlugin,
    ...htmlPlugins,
    new webpack.DefinePlugin({
      'process.env.JAMBO_INJECTED_DATA': JSON.stringify(jamboInjectedData)
    }),
    new RemovePlugin({
      after: {
        root: `${jamboConfig.dirs.output}`,
        test: [
          {
            folder: 'static',
            method: absoluteFilePath => {
              const filePathRelativeToOutput = path.relative(jamboConfig.dirs.output, absoluteFilePath);
              const isFileWithinStaticAssetOutputDir = filePathRelativeToOutput.startsWith('static/assets');
              return !isFileWithinStaticAssetOutputDir;
            },
            recursive: true
          }
        ],
        log: false
      }
    })
  ];

  const commonConfig = {
    stats: 'errors-warnings',
    performance: {
      maxAssetSize: 1536000,
      maxEntrypointSize: 1024000
    },
    target: ['web', 'es5'],
    entry: {
      'bundle': `./${jamboConfig.dirs.output}/static/entry.js`,
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
          VerticalFullPageMap: 'locator-bundle.js'
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
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]'
          }
        }
      ],
    },
  };

  const isDevelopment = (process.env || {}).IS_DEVELOPMENT_PREVIEW === 'true';
  if (isDevelopment) {
    const devConfig = require(
      `./${jamboConfig.dirs.output}/static/webpack/webpack.dev.js`
    )(jamboConfig);
    return merge(commonConfig, devConfig);
  } else {
    const prodConfig = require(
      `./${jamboConfig.dirs.output}/static/webpack/webpack.prod.js`
    )(jamboConfig);
    return merge(commonConfig, prodConfig);
  }
};
