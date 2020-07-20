const fsPromises = require('fs').promises;
const { parse, assign, stringify } = require('comment-json');
const simpleGit = require('simple-git/promise')();

/**
 * Merges two comment-json files.
 * @param {string} incomingPath 
 * @param {string} originalPath 
 * @returns {Promise.<string>}
 */
exports.mergeJson = async function(incomingPath, originalPath) {
  const incoming = await fsPromises.readFile(incomingPath, 'utf-8');
  const original = await fsPromises.readFile(originalPath, 'utf-8');
  const parsedOriginal = parse(original);
  const parsedIncoming = parse(incoming);
  const merged = assign(parsedIncoming, parsedOriginal);
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
exports.getFilesRecursively = async function(dirpath) {
  const directoryEntries = await fsPromises.readdir(dirpath, { withFileTypes: true });
  const files = [];
  for (const dirent of directoryEntries) {
    if (dirent.isDirectory()) {
      const subfolderFiles = await getFilesRecursively(path.join(dirpath, dirent.name));
      files.push(...subfolderFiles);
    } else if (dirent.isFile()) {
      files.push({ dirpath, dirent })
    }
  }
  return files;
}

/**
 * Code from https://gist.github.com/fixpunkt/fe32afe14fbab99d9feb4e8da7268445
 * @param {string} dirpath 
 */
exports.removeEmptyDirectoriesRecursively = async function(dirpath) {
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

/**
 * Checks whether a given file has been modified by checking if
 * git lists it as a modified file in either the main repo or one of its submodules.
 * @param {string} filepath
 * @returns {Promise.<boolean>}
 */
exports.checkIfFileIsModified = async function(filepath) {
  const changedInMainRepo = await simpleGit.raw(['ls-files', '-m', filepath]);
  const submoduleLsFiles =
    await simpleGit.subModule(['foreach', '--quiet', `git ls-files -m ${filepath}`]);
  const changedInSubmodule = submoduleLsFiles
    .split('\n')
    .find(p => p === filepath);
  return changedInMainRepo || changedInSubmodule;
}

