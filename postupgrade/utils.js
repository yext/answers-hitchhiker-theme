const fs = require('fs');
const { parse, assign, stringify } = require('comment-json');
const path = require('path');

/**
 * Merges two comment-json files, with the original having higher priority.
 * @param {string} updatedCommentJson 
 * @param {string} originalCommentJson 
 * @returns {string}
 */
exports.mergeJson = function(updatedCommentJson, originalCommentJson) {
  const merged = assign(parse(updatedCommentJson), parse(originalCommentJson));
  return stringify(merged, null, 2);
}

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
