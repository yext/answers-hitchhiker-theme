/**
 * Returns true if every parameter is truthy.
 * 
 * @param  {...any} args 
 * @returns {boolean}
 */
module.exports = function all(...args) {
  return args.filter(item => item).length === args.length;
}