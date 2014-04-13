'use strict';

var time = require('time-grunt'),
    path = require('path'),
    folderMount = function folderMount(connect, point) {
        return connect.static(path.resolve(point));
    };

module.exports = function(grunt) {

    // Show elapsed time at the end
    time(grunt);

    // Project configuration.
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            require('connect-livereload')(),
                            folderMount(connect, 'app/')
                        ];
                    }
                }
            }
        },
        watch: {
            main: {
                options: {
                    livereload: true
                },
                files: ['app/**'],
                tasks: ['jshint']
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                ignores: ['app/js/vendor/**/*.js']
            },
            files: ['app/js/**/*.js'],
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('server', ['server:local']);
    grunt.registerTask('server:local', ['jshint', 'connect:server', 'watch:main']);

    grunt.registerTask('default', ['server']);

};
