const webpackConfig = require('./webpack-config');

module.exports = function(grunt) {
  grunt.initConfig({
    webpack: {
      myConfig: webpackConfig
    }
  });

  grunt.loadNpmTasks('grunt-webpack');
}