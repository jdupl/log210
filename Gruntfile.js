module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    env: {
      test: {
        NODE_ENV: 'test'
      },
      dev: {
        NODE_ENV: 'dev'
      },
      prod: {
        NODE_ENV: 'prod'
      }
    },
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
        tasks: ['env:test', 'jshint','mochaTest']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'test/**/*.js']
    }
  });
  grunt.registerTask('test', ['env:test', 'mochaTest']);
  grunt.registerTask('coverage', ['env:test', 'mocha_istanbul:coverage']);
  grunt.registerTask('watch-test', ['watch:test']);
  grunt.registerTask('lint', ['jshint']);
};
