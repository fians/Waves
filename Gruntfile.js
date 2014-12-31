module.exports = function(grunt) {
    grunt.initConfig({

        less: {
            build: {
                options: {},
                files: {
                    'dist/waves.css': 'src/less/waves.less'
                }
            },
            minified: {
                options: {
                    cleancss:true
                },
                files: {
                    'dist/waves.min.css': 'src/less/waves.less'
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
                }
            }
        },
   
        uglify: {
            options: {
                mangle: true,
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
        
        //convert less to stylus
        execute: {
            less2stylus2: {
                options: {
                    cwd: './node_modules/less2stylus',
                },
                call: function(grunt, options, async) {
                    var done = async();
                    var exec = require('child_process').exec;
                    exec('cd node_modules/less2stylus && ./less2stylus ../../src/less/waves.less', function (error, stdout, stderr) {
                        grunt.log.writeln('Executing less2styus...');

                        if (error) {
                            grunt.log.writeln('Error! ' + error);
                        }

                        var fs = require('fs');
                        fs.writeFile("src/stylus/waves.styl", stdout, function(err) {
                            if(err) {
                                grunt.log.writeln(err);
                            } else {
                                grunt.log.writeln("Stylus file was saved!");
                            }

                            done(); // let grunt resume
                        });
                    });
                }
            }
        },

        watch: {
            script: {
               options: {
                    spawn: false,
                    event: ['added', 'deleted', 'changed']
                },
                files: ['src/**/*'],
                tasks: ['less', 'jshint', 'uglify', 'copy', 'execute']
            },
            grunt: {
                files: ['Gruntfile.js']
            }
        }
    });
    
    // Load module
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-execute');
    
    // Create grunt task
    grunt.registerTask('build', ['less', 'jshint', 'uglify', 'copy', 'execute']);
    grunt.registerTask('default', ['less', 'jshint', 'uglify', 'copy', 'execute', 'watch']);
};
