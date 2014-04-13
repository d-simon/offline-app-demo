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
            before: {
                src: ['dist', 'temp']
            },
            after: {
                src: ['temp']
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: [
                        'index.html',
                        '.htaccess',
                        'favicon.ico',
                        'img/**'
                    ],
                    dest: 'dist/'
                }]
            },
        },
        dom_munger: {
            readscripts: {
                options: {
                    read: {
                        selector: 'script[data-build!="exclude"]',
                        attribute: 'src',
                        writeto: 'appjs',
                        isPath: true
                    }
                },
                src: 'app/index.html'
            },
            readcss: {
                options: {
                    read: {
                        selector: 'link[rel="stylesheet"]',
                        attribute: 'href',
                        writeto: 'appcss',
                        isPath: true
                    }
                },
                src: 'app/index.html'
            },
            readless: {
                options: {
                    read: {
                        selector: 'link[rel="stylesheet/less"]',
                        attribute: 'href',
                        writeto: 'appless',
                        isPath: true
                    }
                },
                src: 'app/index.html'
            },
            removescripts: {
                options: {
                    remove: 'script[data-remove!="exclude"]',
                    append: {
                        selector: 'head',
                        html: '<script src="app.full.min.js"></script>'
                    }
                },
                src: 'dist/index.html'
            },
            removecss: {
                options: {
                    remove: 'link[data-remove!="exclude"]',
                    append: {
                        selector: 'head',
                        html: '<link rel="stylesheet" href="css/app.full.min.css">'
                    }
                },
                src: 'dist/index.html'
            }
        },
        ngmin: {
            main: {
                src: '<%= dom_munger.data.appjs %>',
                dest: '<%= dom_munger.data.appjs %>'
            }
        },
        cssmin: {
            main: {
                src: ['temp/app.css', '<%= dom_munger.data.appcss %>'],
                dest: 'dist/css/app.full.min.css'
            }
        },
        concat: {
            build: {
                src: ['<%= dom_munger.data.appminjs %>'],
                dest: 'dist/app.full.min.js'
            },
            dev: {
                src: ['<%= dom_munger.data.appjs %>'],
                dest: 'dist/app.full.min.js'
            }
        },
        uglify: {
            main: {
                src: '<%= dom_munger.data.appjs %>',
                dest: '<%= dom_munger.data.appminjs %>'
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
        manifest: {
            generate: {
                options: {
                    basePath: "dist/",
                    network: ["check-online.gif"],
                    fallback: ["/ /index.html"],
                    preferOnline: false,
                    timestamp: true
                },
                src: ['**/*.html','**/*.js','**/*.css','**/*.png','**/*.ico'],
                dest: "dist/offlineapp.appcache"
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('server', ['server:local']);
    grunt.registerTask('server:local', ['jshint', 'connect:server', 'watch:main']);

    grunt.registerTask('build', ['jshint', 'clean:before', 'dom_munger:readcss', 'dom_munger:readless', 'dom_munger:readscripts', 'cssmin', 'ngmin', 'uglify', 'concat:build', 'copy', 'dom_munger:removecss', 'dom_munger:removescripts', 'htmlmin', 'clean:after', 'manifest:generate']);
    grunt.registerTask('build:dev', ['jshint', 'clean:before', 'dom_munger:readcss', 'dom_munger:readless', 'dom_munger:readscripts', 'cssmin', 'concat:dev', 'copy', 'dom_munger:removecss', 'dom_munger:removescripts', 'clean:after', 'manifest:generate']);


    grunt.registerTask('default', ['build']);

};
