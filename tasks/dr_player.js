/*
 * grunt-dr-player
 * https://github.com/drdk/grunt-dr-player
 *
 * Copyright (c) 2014 DR
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask("dr-player", "Main subtask controller", function() {

    var config = grunt.config.get("dr-player")[this.name];

    config.options = _.defaults(config.options, {
      tempPath: config.options.rootPath + "dr-player-tmp/",
      jsPath: config.options.rootPath + "src/assets/libs/dr-player/",
      cssPath: config.options.rootPath + "src/assets/css/dr-player/"
    });

    var tasksConfig = {

      uglify: {
        files: {},
        development: {
          options: {
            compress: false,
            mangle: false,
            beautify: true
          },
          files: '<%=uglify.files%>'
        },
        production: {
          options: {
            compress: true,
            mangle: false,
            sourceMap: true
          },
          files: '<%=uglify.files%>'
        }
      },

      less: {
        files: {
          cssPath: 'src/css/index.less'
        },
        development: {
          options: {
            compress: false,
            sourceMap: true,
            outputSourceFiles: true
          },
          files: '<%=less.files%>'
        },
        production: {
          options: {
            compress: true,
            sourceMap: true,
            cleancss: true,
            outputSourceFiles: false
          },
          files: '<%=less.files%>'
        }
      }
    };

    (function /*processYAMLfile*/ () {
      grunt.file.expand('*.js.yaml').forEach(function (file) {
        var index, path;
        var outputName = file.slice(0, file.length - 5);
        var concatFiles = grunt.file.readYAML(file).files;
        for (index in concatFiles) {
          path = concatFiles[index];
          concatFiles[index] = file.slice(0, file.lastIndexOf('/')) + '/' + path;
        }
        tasksConfig.uglify.files[outputName] = concatFiles;
      });
    })();

    grunt.initConfig(tasksConfig);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.task.run('uglify:production', 'less:production');

  });
};
