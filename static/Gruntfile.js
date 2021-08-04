const webpackConfig = require('./webpack-config');
const { spawnSync } = require("child_process");
const jamboConfig = require('./jambo.json');

const outputDir = jamboConfig.dirs.output;

module.exports = function (grunt) {
  grunt.initConfig({
    webpack: {
      myConfig: webpackConfig
    },
    watch: {
      all: {
        files: ['**', '!**/node_modules/**', `!${outputDir}/**`],
        tasks: ['jambobuild']
      },
    },
  });

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('jambobuild', 'Jambo build.', jambobuild);
}

/**
 * Spawns a jambo and webpack build and prints sends all output to the console
 */
function jambobuild () {
  const spawnedProcess = spawnSync('npx jambo build && npx webpack --config webpack-config.js', {
    shell: true,
    stdio: 'inherit'
  });

  if (spawnedProcess.error) {
    console.error(spawnedProcess.error.message);
  }

  const { stderr, stdout } = spawnedProcess;
  stderr && console.error(stderr);
  stdout && console.log(stdout);
}