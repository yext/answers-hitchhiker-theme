const fs = require('fs');
const { parse, assign, stringify } = require('comment-json');
const path = require('path');
const simpleGit = require('simple-git/promise')();

/**
 * Merges two comment-json files, with the original having higher priority.
 * Prunes away duplicated commented out props.
 *
 * @param {string} newJson 
 * @param {string} originalJson 
 * @returns {string}
 */
exports.mergeGlobalConfigs = function (newJson, originalJson) {
  const originalParsed = parse(originalJson);
  const commentsFromOriginal = parseAllCommentedOutProps(originalParsed);
  const newPruned = pruneComments(parse(newJson), commentsFromOriginal);
  const merged = assign(newPruned, originalParsed);
  return stringify(merged, null, 2);
}

/**
 * Parses all "commented out" config values from a CommentJSONValue.
 *
 * @param {import('comment-json').CommentJSONValue} jsonWithComments
 * @returns {import('comment-json').CommentToken[]}
 */
function parseAllCommentedOutProps(commentJsonValue) {
  return getPropCommentSymbols(commentJsonValue).flatMap(symbol => {
    const commentArr = commentJsonValue[symbol] || [];
    // We only care about non-inline LineComments that "look like" a config option
    return commentArr.filter(c => {
      return !c.inline && c.type === 'LineComment' && c.value.match(/^\s?"\w+":/)
    })
  });
}
exports.parseAllCommentedOutProps = parseAllCommentedOutProps;

/**
 * Removes all comments in CommentJSONValue that have the same value and type as the given
 * comments.
 *
 * @param {import('comment-json').CommentJSONValue} commentJsonValue
 * @param {import('comment-json').CommentToken[]} comments
 * @returns {import('comment-json').CommentJSONValue} the updated value
 */
function pruneComments(commentJsonValue, comments) {
  return getPropCommentSymbols(commentJsonValue).reduce((prunedJson, symbol) => {
    if (!commentJsonValue[symbol]) {
      return prunedJson;
    }
    prunedJson[symbol] = commentJsonValue[symbol].filter(commentToCheck => {
      return !comments.find(c => {
        return c.value === commentToCheck.value
          && c.type === commentToCheck.type
          && c.inline === commentToCheck.inline;
      })
    });
    return prunedJson;
  }, { ...commentJsonValue });
}
exports.pruneComments = pruneComments

/**
 * Returns an array of global symbols for before, before:[prop], and after:[prop] comments.
 * These are the comment types that can be used for commented out config props.
 * 
 * @param {import('comment-json').CommentJSONValue} commentJsonValue
 * @returns {symbol[]}
 */
function getPropCommentSymbols(commentJsonValue) {
  const beforeAndAfterSymbols = Object.keys(commentJsonValue).flatMap(prop => {
    return [Symbol.for(`before:${prop}`), Symbol.for(`after:${prop}`)]
  });
  return beforeAndAfterSymbols.concat(Symbol.for('before'));
}
exports.getPropCommentSymbols = getPropCommentSymbols;

/**
 * Gets the value of a given --jambo command line argument.
 * @param {string} param 
 * @returns {string}
 */
exports.getJamboParam = function(param) {
  const getProcessArgument = (param) => {
    const nameIndex = process.argv.indexOf(param);
    if (nameIndex === -1) {
      throw new Error(`Expected jambo command line argument ${param}, but not found in ${process.argv}`);
    }
    const paramValueIndex = nameIndex + 1;
    return process.argv[paramValueIndex];
  }
  return getProcessArgument(`--jambo.${param}`);
}

/**
 * Will remove all empty directories on the given path, including the
 * path itself (if it is a directory).
 * @param {string} dirpath
 */
function removeEmptyDirectoriesRecursively(dirpath) {
  const stats = fs.lstatSync(dirpath);
  if (!stats.isDirectory()) {
    return;
  }
  let directoryEntries = fs.readdirSync(dirpath);
  if (directoryEntries.length > 0) {
    for (const filename of directoryEntries) {
      removeEmptyDirectoriesRecursively(path.join(dirpath, filename))
    }
    directoryEntries = fs.readdirSync(dirpath);
  }
  if (directoryEntries.length === 0) {
    fs.rmdirSync(dirpath);
  }
}
exports.removeEmptyDirectoriesRecursively = removeEmptyDirectoriesRecursively;

/**
 * Returns whether the given file path is registered as a git submodule.
 * @param {string} submodulePath
 * @returns {boolean}
 */
async function isGitSubmodule(submodulePath) {
  const submodulePaths = await simpleGit.subModule(['foreach', '--quiet', 'echo $sm_path']);
  return !!submodulePaths
    .split('\n')
    .find(p => p === submodulePath)
}
exports.isGitSubmodule = isGitSubmodule;
