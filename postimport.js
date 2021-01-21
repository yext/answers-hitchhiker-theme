#!/usr/bin/env node
const path = require('path');
const { spawnSync } = require('child_process');
const fs = require('fs');
const jamboConfig = require('../../jambo.json');

const themeName = 'answers-hitchhiker-theme';
const themeDir = path.join('themes', themeName);
copyTopLevelStaticFiles(themeDir);
// npm install needed for things like comment-json
spawnSync('npm', ['install'], { stdio: 'inherit' });

const { assign, stringify } = require('comment-json');

const configDir = jamboConfig.dirs.config;
copyConfigFiles(themeDir, configDir);
copyStaticFiles(themeDir);
updateDefaultTheme(jamboConfig, themeName);
jamboOverrideLayoutFiles();

/**
 * Copies over top-level files from the theme's static folder
 * into the root directory.
 * For example will copy themes/answers-hitchhiker-theme/static/package.json
 * to package.json
 * 
 * @param {string} themeDir path to the theme
 */
function copyTopLevelStaticFiles(themeDir) {
  const packageJsonFiles = [
    'package.json',
    'package-lock.json',
    'Gruntfile.js',
    'webpack-config.js',
  ];
  const themeStaticDir = path.join(themeDir, 'static');
  syncContents(themeStaticDir, '', packageJsonFiles);
}

/**
 * Copies over config files from the theme into the root directory's config folder.
 * 
 * @param {string} themeDir path to the theme
 * @param {string} configDir path to the root config folder
 */
function copyConfigFiles(themeDir, configDir) {
  if (!fs.existsSync('config')) {
    fs.mkdirSync('config');
  }
  const configFiles = ['locale_config.json', 'global_config.json'];
  syncContents(themeDir, configDir, configFiles);
}

/**
 * Copies over static scss, js, and top-level files.
 * e.g. will copy themes/answers-hitchhiker-theme/static/scss/answers.scss
 * into static/scss/answers.scss
 * 
 * @param {string} themeDir path to the theme
 */
function copyStaticFiles(themeDir) {
  const scssFiles = [
    'scss/answers.scss',
    'scss/answers-variables.scss',
    'scss/fonts.scss',
    'scss/header.scss',
    'scss/footer.scss',
    'scss/page.scss',
    'js/formatters-custom.js',
  ];
  const requiredDirs = ['static', 'static/scss', 'static/js']
  requiredDirs.forEach(dir => {
    !fs.existsSync(dir) && fs.mkdirSync(dir);
  });
  const themeStaticDir = path.join(themeDir, 'static');
  syncContents(themeStaticDir, 'static', scssFiles);
}

/**
 * Fork certain layout files from the theme.
 *
 * @param {string} themeName 
 */
function jamboOverrideLayoutFiles() {
  const files = [
    'layouts/header.hbs',
    'layouts/footer.hbs',
    'layouts/headincludes.hbs',
  ];
  files.forEach(filePath => {
    spawnSync('npx', ['jambo', 'override', '--path', filePath], { stdio: 'inherit' })
  });
}

function updateDefaultTheme(jamboConfig, themeName) {
  if (jamboConfig.defaultTheme !== themeName) {
    const updatedConfig = assign({ defaultTheme: themeName }, jamboConfig);
    fs.writeFileSync('jambo.json', stringify(updatedConfig, null, 2));
  }
}

/**
 * Copies over all files from srcFolder to destFolder, for each
 * file that exists.
 *
 * @param {string} srcFolder path to source folder
 * @param {string} destFolder path to destination folder
 * @param {Array<string>} fileNames list of files to copy
 */
function syncContents(srcFolder, destFolder, fileNames) {
  fileNames.forEach(fileName => {
    copyFileIfExists(
      path.join(srcFolder, fileName),
      path.join(destFolder, fileName)
    );
  });
}

/**
 * Copy a file to destPath if the srcPath exists.
 *
 * @param {string} srcPath 
 * @param {string} destPath 
 */
function copyFileIfExists(srcPath, destPath) {
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
}
