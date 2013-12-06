/*jslint indent:2, node:true*/

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-jslint');

  grunt.initConfig({

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
          stubModules: ['text'],
          paths: {
            jquery: 'empty:',
            foundation: 'empty:',
            lodash: 'empty:',
            angular: 'empty:',
            text: 'bower_components/requirejs-text/text'
          },
          excludes: [
            'jquery',
            'foundation',
            'lodash',
            'angular',
            'text'
          ],
          out: 'bmpFoundation.min.js'
        }
      }
    }

  });

  grunt.registerTask('build', ['requirejs']);
  grunt.registerTask('test', ['jslint']);
  // Default task(s).
  grunt.registerTask('default', ['test', 'build']);

};
