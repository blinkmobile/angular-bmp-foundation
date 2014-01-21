/*jslint indent:2, node:true*/

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-jqlint');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.initConfig({

    jqlint: {
      all: {
        src: [
          '**/*.js',
          '!**/*.min.js',
          '!node_modules/**/*',
          '!bower_components/**/*'
        ],
        options: {
          errorsOnly: true,
          failOnError: true
        }
      }
    },

    jslint: {
      all: {
        src: [
          '**/*.js',
          '**/*.json',
          '!**/*.min.js',
          '!node_modules/**/*',
          '!bower_components/**/*'
        ],
        directives: {},
        options: {
          errorsOnly: true,
          failOnError: true
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          name: 'bmpFoundation',
          include: ['bmpFoundation'],
          inlineText: true,
          paths: {
            jquery: 'empty:',
            foundation: 'empty:',
            lodash: 'empty:',
            angular: 'empty:',
            text: 'bower_components/requirejs-text/text'
          },
          exclude: [
            'jquery',
            'foundation',
            'lodash',
            'angular',
            'text'
          ],
          out: 'bmpFoundation.min.js'
        }
      }
    },

    connect: {
      temporary: {
        options: {
          port: 9001,
          base: '.'
        }
      },
      keepalive: {
        options: {
          port: 0,
          base: '.',
          keepalive: true
        }
      }
    },

    mocha: {
      all: {
        options: {
          urls: [
            'http://127.0.0.1:9001/tests/eventBindings/index.html',
            'http://127.0.0.1:9001/tests/revealAlert/index.html',
            'http://127.0.0.1:9001/tests/revealConfirm/index.html'
          ],
          run: true
        }
      }
    }

  });

  grunt.registerTask('build', ['requirejs']);
  grunt.registerTask('test', ['connect:temporary', 'jslint', 'jqlint', 'mocha']);
  // Default task(s).
  grunt.registerTask('default', ['test', 'build']);

};
