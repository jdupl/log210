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
    nodemon: {
      dev: {
        script: 'app.js'
      }
    },
    mochaTest: {
      test: {
        src: ['test/**/*.js']
      }
    },
    mocha_istanbul: {
      coverage: {
        src: 'test/',
        options: {
          mask: '**/*.js'
        }
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
    },
    execute: {
      target: {
        src: ['scripts/insert-admin.js']
      }
    }
  });
  grunt.registerTask('test', ['env:test', 'mochaTest']);
  grunt.registerTask('coverage', ['env:test', 'mocha_istanbul:coverage']);
  grunt.registerTask('watch-test', ['watch:test']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('serve', ['env:dev', 'execute', 'nodemon']);
  grunt.registerTask('default', ['env:test', 'mocha_istanbul:coverage', 'env:dev', 'nodemon']);
};
