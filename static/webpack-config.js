const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ClosurePlugin = require('closure-webpack-plugin');

const jamboConfig = JSON.parse(fs.readFileSync('config.json'))

module.exports = {
  mode: 'production',
  entry: './static/entry.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, jamboConfig.dirs.output),
    library: 'HitchHikerJS',
    libraryTarget: 'window'
  },
  plugins: [new MiniCssExtractPlugin({ filename: 'bundle.css' })],
  optimization: {
    minimize: true,
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
        loader: 'file-loader',
      },
    ],
  },
};