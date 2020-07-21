const fsPromises = require('fs').promises;
const { parse, assign, stringify } = require('comment-json');
const path = require('path');

const simpleGit = require('simple-git/promise')();
exports.simpleGit = simpleGit;

/**
 * Merges two comment-json files, with the original having higher priority.
 * @param {string} updatedCommentJson 
 * @param {string} originalCommentJson 
 * @returns {Promise.<string>}
 */
exports.mergeJson = async function(updatedCommentJson, originalCommentJson) {
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
exports.deleteFile = async function(filepath) {
  await fsPromises.unlink(filepath);
}

/**
 * @param {string} dirpath 
 * @returns {Promise.<Array.<{{dirpath: string, dirent: fs.Dirent}}>>}
 */
async function getFilesRecursively(dirpath) {
  const directoryEntries = await fsPromises.readdir(dirpath, { withFileTypes: true });
  const files = [];
  for (const dirent of directoryEntries) {
    if (dirent.isDirectory()) {
      const subfolderFiles = await getFilesRecursively(path.join(dirpath, dirent.name));
      files.push(...subfolderFiles);
    } else if (dirent.isFile()) {
      files.push({ dirpath, dirent });
    }
  }
  return files;
}
exports.getFilesRecursively = getFilesRecursively;

/**
 * Code from https://gist.github.com/fixpunkt/fe32afe14fbab99d9feb4e8da7268445
 * @param {string} dirpath 
 */
async function removeEmptyDirectoriesRecursively(dirpath) {
  const stats = await fsPromises.lstat(dirpath);
  if (!stats.isDirectory()) {
    return;
  }
  let directoryEntries = await fsPromises.readdir(dirpath);
  if (directoryEntries.length > 0) {
    await Promise.all(directoryEntries.map(filename =>
      removeEmptyDirectoriesRecursively(path.join(dirpath, filename))
    ));
    directoryEntries = await fsPromises.readdir(dirpath);
  }

  if (directoryEntries.length === 0) {
    await fsPromises.rmdir(dirpath);
  }
}
exports.removeEmptyDirectoriesRecursively = removeEmptyDirectoriesRecursively;
