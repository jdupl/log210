module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    mochaTest: {
      test: {
        src: ['test/**/*.js']
      }
    },
    mocha_istanbul: {
      coverage: {
        src: 'test'
      }
    },
    watch: {
      test: {
        files: ['**/*.js'],
        tasks: ['jshint','mochaTest']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'test/**/*.js']
    }
  });
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
  grunt.registerTask('watch-test', ['watch:test']);
  grunt.registerTask('lint', ['jshint']);
};
