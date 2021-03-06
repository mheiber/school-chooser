module.exports = function(grunt)
{
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig
    ({
        srcDir: 'site/src',
        distDir: 'site/dist',
        tempDir: 'site/temp',
        sass:{
            dist:{
                // options:{
                //     outputStyle: 'compressed'
                // },
                files:{
                    '<%= distDir %>/css/main.css': '<%= srcDir %>/scss/main.scss'
                }
            }
        },
        copy: {
            html: {
                expand:true,
                cwd:'<%= srcDir %>',
                src: ['**/*.html'],
                dest: '<%= distDir %>'
            },
            data: {
                expand:true,
                cwd:'<%= srcDir %>',
                src: ['data/*.json'],
                dest: '<%= distDir %>'
            },
            fonts: {
                expand:true,
                cwd:'<%= srcDir %>',
                src: ['fonts/**/*.eot','fonts/**/*.woff','fonts/**/*.ttf','fonts/**/*.svg'],
                dest: '<%= distDir %>'
            },
            misc_files: {
                expand:true,
                cwd:'<%= srcDir %>',
                src: ['favicon.ico','apple-touch-icon-precomposed.png','robots.txt'],
                dest: '<%= distDir %>'
            },
            scripts_to_temp: {
                expand:true,
                cwd:'<%= srcDir %>',
                src: ['js/**/*.js'],
                dest: '<%= tempDir %>'
            }
        },
        clean: {
            on_start: ['<%= distDir %>'],
            on_finish: ['<%= tempDir %>']
        },
        requireJSOptimise: 'uglify2',
        requirejs: {
            compile: {
                options: {
                    keepBuildDir: true,
                    removeCombined: true,
                    generateSourceMaps:false,
                    optimize: '<%= requireJSOptimise %>',
                    uglify2: {
                        mangle:true
                    },
                    preserveLicenseComments: false,
                    baseUrl: '<%= tempDir %>/js',
                    dir:'<%= distDir %>/js',
                    paths: {
                        'backbone': 'lib/backbone-1.1.1',
                        'jquery': 'lib/jquery-1.11.0',
                        'lodash': 'lib/lodash-2.4.1.compat',
                        'd3': 'lib/d3-3.4.1'
                    },
                    shim: {
                        'backbone': {
                            deps: ['lodash', 'jquery'],
                            exports: 'Backbone'
                        }
                    },
                    modules: [
                        {
                            name: 'main'
                        },
                        {
                            name: 'views/basic-info',
                            exclude: [
                                'jquery',
                                'lodash',
                                'backbone',
                                'i18n',
                                'i18n!nls/content'
                            ]
                        },
                        {
                            name: 'views/ranking',
                            exclude: [
                                'jquery',
                                'lodash',
                                'backbone',
                                'i18n',
                                'i18n!nls/content'
                            ]
                        },
                        {
                            name: 'views/results',
                            exclude: [
                                'jquery',
                                'lodash',
                                'backbone',
                                'i18n',
                                'i18n!nls/content'
                            ]
                        }
                    ]
                }
            }
        },
        jshint:{
            files: [
                'Gruntfile.js',
                '<%= srcDir %>/js/**/*.js'
            ],
            options: {
                jshintrc: true,
                ignores: [
                    '<%= srcDir %>/js/i18n.js',
                    '<%= srcDir %>/js/lib/**/*.js',
                    '<%= srcDir %>/js/plugins/**/*.js'
                ] }
        },
        watch: {
            gruntFile: {
                files: ['Gruntfile.js'],
                tasks: ['watch'],
                options: {
                    nospawn: false
                }
            },
            sass: {
                files: ['<%= srcDir %>/scss/**/*.scss'],
                tasks: ['sass'],
                options: {
                    nospawn: false
                }
            },
            scripts: {
                files: ['<%= srcDir %>/js/**/*.js'],
                tasks: ['setup-dev','jshint','scripts'],
                options: {
                    nospawn: false
                }
            },
            html: {
                files: ['<%= srcDir %>/**/*.html'],
                tasks: ['copy:html'],
                options: {
                    nospawn: false
                }
            },
            data: {
                files: ['<%= srcDir %>/data/**/*.json'],
                tasks: ['copy:data'],
                options: {
                    nospawn: false
                }
            }
        }
    });

    grunt.registerTask('setup-dev', 'Development settings', function()
    {
        grunt.config.set('requireJSOptimise', 'none');
    });

    grunt.registerTask('scripts', [
        'copy:scripts_to_temp',
        'requirejs',
        'clean:on_finish'
    ]);
    grunt.registerTask('default', [
        'clean:on_start',
        'sass',
        'copy:html',
        'copy:data',
        'copy:fonts',
        'copy:misc_files',
        'scripts'
    ]);
    grunt.registerTask('heroku', ['default']);
    grunt.registerTask('dev', ['setup-dev','jshint','default']);
};