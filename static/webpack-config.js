const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ClosurePlugin = require('closure-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './entry.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [new CleanWebpackPlugin(), new MiniCssExtractPlugin({ filename: 'bundle.css' })],
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
          'sass-loader'
        ],
      },
    ],
  },
};