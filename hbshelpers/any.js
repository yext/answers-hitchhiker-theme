module.exports = function(...args) {
  return args.filter(item => item).length > 1;
}