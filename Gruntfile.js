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
        },
        clean: {
            before:{
                src:['dist', 'temp']
            },
            after: {
                src:['temp']
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/',
                        src: [
                            'index.html',
                            '.htaccess',
                            'offlineapp.appcache',
                            'favicon.ico',
                            'img/**'
                        ],
                        dest: 'dist/'
                    }
                ]
            },
        },
        dom_munger:{
            readscripts: {
                options: {
                    read:{selector:'script[data-build!="exclude"]',attribute:'src',writeto:'appjs', isPath:true}
                },
                src:'app/index.html'
            },
            readcss: {
                options: {
                    read:{selector:'link[rel="stylesheet"]',attribute:'href',writeto:'appcss', isPath:true}
                },
                src:'app/index.html'
            },
            readless: {
                options: {
                    read:{selector:'link[rel="stylesheet/less"]',attribute:'href',writeto:'appless', isPath:true}
                },
                src:'app/index.html'
            },
            removescripts: {
                options:{
                    remove:'script[data-remove!="exclude"]',
                    append:{selector:'head',html:'<script src="app.full.min.js"></script>'}
                },
                src:'dist/index.html'
            },
            removecss: {
                options:{
                    remove:'link[data-remove!="exclude"]',
                    append:{selector:'head',html:'<link rel="stylesheet" href="css/app.full.min.css">'}
                },
                src:'dist/index.html'
            }
        },
        ngmin: {
            main: {
                src:'temp/app.full.js',
                dest: 'temp/app.full.js'
            }
        },
        less: {
            main: {
                src:['<%= dom_munger.data.appless %>'],
                dest:'temp/app.css'
            }
        },
        cssmin: {
            main: {
                src:['temp/app.css', '<%= dom_munger.data.appcss %>'],
                dest:'dist/css/app.full.min.css'
            }
        },
        concat: {
            main: {
                src: ['<%= dom_munger.data.appjs %>'],
                dest: 'temp/app.full.js'
            }
        },
        uglify: {
            main: {
                src: 'temp/app.full.js',
                dest:'dist/app.full.min.js'
            }
        },
        htmlmin: {
            main: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist/index.html'
                }
            }
        },
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('server', ['server:local']);
    grunt.registerTask('server:local', ['jshint', 'connect:server', 'watch:main']);

    grunt.registerTask('build',['jshint','clean:before','dom_munger:readcss','dom_munger:readless','dom_munger:readscripts','cssmin','concat','ngmin','uglify','copy','dom_munger:removecss','dom_munger:removescripts','htmlmin','clean:after']);


    grunt.registerTask('default', ['build']);

};
