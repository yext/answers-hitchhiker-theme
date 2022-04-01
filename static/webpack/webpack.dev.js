module.exports = () => {
  return {
    mode: 'development',
    devtool: 'eval',
    optimization: {
      minimize: false
    }
  };
}