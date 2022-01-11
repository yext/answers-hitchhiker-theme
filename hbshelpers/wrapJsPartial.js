/**
 * This is a block helper for injecting inline JS using handlebars.
 *
 * First, it wraps the statement in an iife to prevent namespacing issues.
 *  
 * Then, it adds an extra new line to the end of the iife.
 * This is necesssary because handlebars removes the first new line it sees after a partial invocation,
 * which can result in certain js parsing issues, for example if the last line of the partial is a
 * single line js comment, the line immediately after the partial will be included in the comment.
 *
 * @param {import('handlebars').HelperOptions} opts
 */
module.exports = function wrapJsPartial(opts) {
  return `(() => { \n${opts.fn()}\n })()\n`;
}