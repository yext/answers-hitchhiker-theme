const webpackConfig = require('./webpack-config');
const { exec } = require("child_process");

module.exports = function(grunt) {
  grunt.initConfig({
    webpack: {
      myConfig: webpackConfig
    },
	  watch: {
		  all: {
		    files: ['cards/**/*.*', 'config/**/*.*', 'pages/**/*.*', 'static/**/*.*', 'partials/**/*.*'],
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
		}
	);
}
