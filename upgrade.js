#!/usr/bin/env node
const fsPromises = require('fs').promises;
const fsExtra = require('fs-extra');
const path = require('path');
const { parse, assign, stringify } = require('comment-json');

function getJamboParam (param) {
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

const themeDir = `${getJamboParam('dirs.themes')}/${getJamboParam('defaultTheme')}`;
const configDir = getJamboParam('dirs.config');

main();

async function main() {
  try {
    const isLegacyUpgrade = process.argv.find(arg => arg === '--isLegacy');
    if (isLegacyUpgrade) {
      await legacyUpgradeTheme();
    } else {
      await upgradeTheme();
    }
  } catch (e) {
    console.error(e.message, e.stack);
    console.error('Error occurred on node version:', process.version);
  }
}

async function upgradeTheme() {
  await mergeGlobalConfig('global_config.json');
  await copyRootLevelFiles(['package.json', 'Gruntfile.js', 'webpack-config.js', 'package-lock.json']);

  async function mergeGlobalConfig(filename) {
    const mergeJson = async (incomingPath, originalPath) => {
      const incoming = await fsPromises.readFile(incomingPath, 'utf-8');
      const original = await fsPromises.readFile(originalPath, 'utf-8');
      const parsedOriginal = parse(original);
      const parsedIncoming = parse(incoming);
      const merged = assign(parsedIncoming, parsedOriginal);
      return stringify(merged, null, 2);
    }
    const mergedJson = await mergeJson(path.join(themeDir, filename), path.join(configDir, filename));
    await fsPromises.writeFile(filename, mergedJson);
  }

  async function copyRootLevelFiles(staticFilesToUpdate) {
    await Promise.all(staticFilesToUpdate.map(filename => {
      const srcPath = path.resolve(themeDir, 'static', filename);
      return fsPromises.copyFile(srcPath, filename);
    }));
  }
}

async function legacyUpgradeTheme() {
  let preservedFontsFileContent;

  const files = await getFilesRecursively('static');
  await Promise.all(files.map(async f => handleStaticFile(f.dirpath, f.dirent)));
  if (preservedFontsFileContent) {
    await fsExtra.mkdirp('static/scss');
    await fsPromises.writeFile('static/scss/fonts.scss', preservedFontsFileContent);
  }
  await fsExtra.remove('partials/layouts');

  async function handleStaticFile (dirpath, dirent) {
    const filename = dirent.name;
    const filepath = path.resolve(dirpath, filename);

    if (filename === 'fonts.scss') {
      preservedFontsFileContent = await fsPromises.readFile(filepath);
      await deleteFile(filepath);
    } else if (dirpath.startsWith('static/assets/fonts')) {
      const filesToDelete = [
        'opensans-bold-webfont.woff',
        'opensans-semibold-webfont.woff',
        'opensans-regular-webfont.woff'
      ];
      if (filesToDelete.includes(filename)) {
        await deleteFile(filepath);
      }
    } else if (dirpath.startsWith('static/assets/images')) {
      if (filename === 'yext-logo.svg') {
        await deleteFile(filepath);
      }
    } else if (dirpath.startsWith('static/scss')) {
      const filesToPreserve = ['answers.scss', 'answers-variables.scss'];
      if (!filesToPreserve.includes(filename)) {
        await deleteFile(filepath);
      }
    } else {
      await deleteFile(filepath);
    }
  }
}

/**
 * @param {string} dirpath 
 * @returns {Array<{{dirpath: string, dirent: fs.Dirent}}>}
 */
async function getFilesRecursively(dirpath) {
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

async function deleteFile(filepath) {
  await fsPromises.unlink(filepath);
}
