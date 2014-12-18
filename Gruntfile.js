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
        
        watch: {
            script: {
               options: {
                    spawn: false,
                    event: ['added', 'deleted', 'changed']
                },
                files: ['src/**/*'],
                tasks: ['less', 'jshint', 'uglify', 'copy']
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
    
    // Create grunt task
    grunt.registerTask('build', ['less', 'jshint', 'uglify', 'copy']);
    grunt.registerTask('default', ['watch']);
};