module.exports = function(grunt) {
  grunt.registerTask('default', 'My "default" task', function() {
    grunt.log.write('Performing my "default" task').ok();
  });
}