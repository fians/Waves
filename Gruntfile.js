var fs = require('fs');

module.exports = function(grunt) {
    grunt.initConfig({

        less: {
            build: {
                files: {
                    'dist/waves.css': 'src/less/waves.less'
                }
            },
            test: {
                files: {
                    'tests/less/waves.css': 'src/less/waves.less',
                }
            }
        },

        cssmin: {
            options: {
                sourceMap: false
            },
            target: {
                files: {
                    'dist/waves.min.css': 'dist/waves.css',
                    'tests/less/waves.min.css': 'tests/less/waves.css',
                    'tests/sass/waves.min.css': 'tests/sass/waves.css',
                    'tests/scss/waves.min.css': 'tests/scss/waves.css'
                }
            }
        },
        
        jshint: {
            
            files: [
                'gruntfile.js', 
                'src/js/*.js',
            ],
            
            options: {
                globals: {
                    console: true
                },
                reporterOutput: ''
            }
        },
   
        uglify: {
            options: {
                mangle: true,  // false when debugging
                compress: {
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                    drop_console: true
                },
                sourceMap: true,
                sourceMapName: 'dist/waves.min.js.map',
                preserveComments: 'some'
            },
            js: {
                files: {
                    'dist/waves.min.js': ['src/js/waves.js']
                }
            }
        },

        // Copy to dist
        copy: {
			js: {
                expand: true,
                cwd: 'src/js',
				src: 'waves.js',
				dest: 'dist/'
			},
            docs: {
                expand: true,
                cwd: 'dist',
                src: ['waves.min.css', 'waves.min.js'],
                dest: 'docs/static'
            }
		},

        'sass-convert': {
            options: {
                from: 'scss',
                to: 'sass',
                indent: 2
            },
            files: {
                cwd: 'src/scss',
                src: '*.scss',
                dest: 'src/sass'
            }
        },
        
        sass: {
            test: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.sass', '**/*.scss'],
                    dest: 'tests/',
                    ext: '.css'
                }]
            }
        },
        
        clean: {
            test: ['tests/*']
        },

        watch: {
            script: {
               options: {
                    spawn: false,
                    event: ['added', 'deleted', 'changed']
                },
                files: ['src/**/*.js', 'src/**/*.less'],
                tasks: ['build']
            },
            grunt: {
                files: ['Gruntfile.js']
            }
        }
    });

    grunt.registerTask('execute:less2scss', 'Convert less to scss.', function() {
        var done = this.async();
        var text = fs.readFileSync('src/less/waves.less', {encoding:'utf8'});

        //replace @ with $
        text = text.replace(/@(?!import|media|keyframes|-)/g, '$');
        //replace mixins
        text = text.replace(/\.([\w\-]*)\s*\((.*)\)\s*\{/g, '@mixin $1($2){');
        //replace includes
        text = text.replace(/\.([\w\-]*\(.*\)\s*;)/g, '@include $1');
        //replace string literals
        //eg. ~'!important' -> #{"!important"}
        text = text.replace(/~(?:\"|\')(.*)(?:\"|\')/g, '#{"$1"}');

        //NOTE: for true less->scss transpiling we'd need to replace spin to adjust-hue (not needed but anyway)

        fs.writeFileSync('src/scss/waves.scss', text);

        done();
    });

    grunt.registerTask('execute:test', 'Convert less to scss.', function() {
        var done = this.async();
        var lessTest = fs.readFileSync('tests/less/waves.min.css', {encoding:'utf8'});
        var sassTest = fs.readFileSync('tests/sass/waves.min.css', {encoding:'utf8'});
        var scssTest = fs.readFileSync('tests/scss/waves.min.css', {encoding:'utf8'});
        
        var failure = false;
        if (lessTest != sassTest) {
            grunt.log.writeln('ERROR: sass failed test.');
            failure = true;
        }
        
        if (lessTest != scssTest) {
            grunt.log.writeln('ERROR: scss failed test.');
            failure = true;
        }
        
        if (sassTest != scssTest) {
            grunt.log.writeln('WARNING: sass files aren\'t equal?');
            failure = true;
        }
        
        if (!failure) grunt.log.writeln('PASS: conversions generated same CSS');
        
        done();
    });
    
    // Load module
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-sass-convert');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    
    // Create grunt task
    grunt.registerTask('build', [
        'less:build', 
        'jshint', 
        'uglify', 
        'copy',
        'execute:less2scss', 
        'sass-convert', 
        'sass:test', 
        'less:test', 
        'cssmin',
        'execute:test',
        'clean:test'
    ]);
    
    grunt.registerTask('default', ['build', 'watch']);
};
