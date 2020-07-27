const fs = require('fs');
const { parse, assign, stringify } = require('comment-json');
const path = require('path');

const simpleGit = require('simple-git/promise')();
exports.simpleGit = simpleGit;

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
 * @param {string} filepath 
 */
exports.deleteFile = function(filepath) {
  fs.unlinkSync(filepath);
}

/**
 * @param {string} dirpath 
 * @returns {Array.<{{dirpath: string, dirent: fs.Dirent}}>}
 */
function getFilesRecursively(dirpath) {
  const directoryEntries = fs.readdirSync(dirpath, { withFileTypes: true });
  const files = [];
  for (const dirent of directoryEntries) {
    if (dirent.isDirectory()) {
      const subfolderFiles = getFilesRecursively(path.join(dirpath, dirent.name));
      files.push(...subfolderFiles);
    } else if (dirent.isFile()) {
      files.push({ dirpath, dirent });
    }
  }
  return files;
}
exports.getFilesRecursively = getFilesRecursively;

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
