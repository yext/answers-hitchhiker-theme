const fs = require('fs');
const { parse, assign, stringify } = require('comment-json');
const path = require('path');
const simpleGit = require('simple-git/promise')();

/**
 * @typedef {import('comment-json').CommentJSONValue} CommentJSONValue
 * @typedef {import('comment-json').CommentToken} CommentToken
 */

/**
 * Merges two comment-json files, with the original having higher priority.
 * Prunes away duplicated commented out props.
 *
 * @param {string} incomingConfig 
 * @param {string} originalConfig
 * @returns {string}
 */
exports.mergeGlobalConfigs = function (incomingConfig, originalConfig) {
  const incoming = parse(incomingConfig);
  const original = parse(originalConfig);
  const propCommentsFromOriginal = parseAllPropComments(original);
  const incomingPruned = pruneComments(incoming, propCommentsFromOriginal);
  const partiallyMerged = assign(incomingPruned, original);
  const merged = addMissingPropComments(partiallyMerged, incoming);
  return stringify(merged, null, 2);
}

/**
 * Adds any comment props in {@link incoming} that are missing from {@link partiallyMerged}
 * 
 * @param {CommentJSONValue} partiallyMerged 
 * @param {CommentJSONValue} incoming 
 * @returns {CommentJSONValue} the updated json
 */
function addMissingPropComments(partiallyMerged, incoming) {
  const propCommentsFromIncoming = parseAllPropComments(incoming);
  const preexistingPropComments = parseAllPropComments(partiallyMerged);
  const missingPropComments = propCommentsFromIncoming.filter(incomingComment => {
    return !preexistingPropComments.find(c => isEqualComment(c, incomingComment));
  });
  Object.getOwnPropertySymbols(incoming).forEach(symbol => {
    if (!incoming[symbol]) {
      return;
    }
    incoming[symbol].forEach(comment => {
      const index = missingPropComments.findIndex(c => isEqualComment(c, comment));
      if (index < 0) {
        return;
      }
      const missingComment = missingPropComments[index]
      partiallyMerged[symbol].unshift(missingComment);
      missingPropComments.splice(index, 1);
    });
  });
  return partiallyMerged;
}

/**
 * Whether or not a CommentToken is a LineComment that "look like" a config option
 * 
 * @param {CommentToken[]} comment 
 * @returns {boolean}
 */
function isPropComment(comment) {
  return !comment.inline && comment.type === 'LineComment' && comment.value.match(/^\s?"\w+":/);
}

/**
 * Parses all "commented out" config values from a CommentJSONValue.
 *
 * @param {CommentJSONValue} jsonWithComments
 * @returns {CommentToken[]}
 */
function parseAllPropComments(commentJsonValue) {
  return getPropCommentSymbols(commentJsonValue).flatMap(symbol => {
    const commentArr = commentJsonValue[symbol] || [];
    return commentArr.filter(c => isPropComment(c));
  });
}
exports.parseAllPropComments = parseAllPropComments;

/**
 * 
 * @param {CommentToken} c1 
 * @param {CommentToken} c2 
 * @returns {boolean}
 */
function isEqualComment(c1, c2) {
  return c1.value === c2.value
    && c1.type === c2.type
    && c1.inline === c2.inline;
}

/**
 * Removes all comments in CommentJSONValue that have the same value and type as the given
 * comments.
 *
 * @param {CommentJSONValue} commentJsonValue
 * @param {CommentToken[]} comments
 * @returns {CommentJSONValue} the updated value
 */
function pruneComments(commentJsonValue, comments) {
  return getPropCommentSymbols(commentJsonValue).reduce((prunedJson, symbol) => {
    if (!commentJsonValue[symbol]) {
      return prunedJson;
    }
    prunedJson[symbol] = commentJsonValue[symbol].filter(commentToCheck => {
      return !comments.find(c => isEqualComment(c, commentToCheck));
    });
    return prunedJson;
  }, { ...commentJsonValue });
}
exports.pruneComments = pruneComments

/**
 * Returns an array of global symbols for before, before:[prop], and after:[prop] comments.
 * These are the comment types that can be used for commented out config props.
 * 
 * @param {CommentJSONValue} commentJsonValue
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
