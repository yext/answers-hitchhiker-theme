const webpackConfig = require('./webpack-config');
const { exec } = require("child_process");
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
        tasks: ['jambobuild', 'webpack',],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('jambobuild', 'Jambo build.',
  function() {
    // Force task into async mode and grab a handle to the "done" function.
    var done = this.async();
    // Run some sync stuff.
    grunt.log.writeln('Processing task...');
    // And some async stuff.
    exec('npx jambo build', (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        done(false);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        done(false);
        return;
      }
      console.log(`${stdout}`);
      done();
    });
  });
}
