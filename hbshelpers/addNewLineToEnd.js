
/**
 * This is a block helper.
 * Its intended use is to add a new line to the end of a handlebars partial that is used inside
 * inline javascript.
 *
 * This is necesssary because handlebars removes the first new line it sees after a partial invocation,
 * which can result in certain js parsing issues, for example if the last line of the partial is a
 * single line js comment, the line immediately after the partial will be included in the comment.
 *
 * @param {import('handlebars').HelperOptions} opts
 * @returns 
 */
export default function addNewLineToEnd(opts) {
  return opts.fn() + '\n';
}