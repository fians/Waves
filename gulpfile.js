
/**
 * Gulp build file
 */

var gulp 		= require('gulp');
var plumber 	= require('gulp-plumber');
var uglify 		= require('gulp-uglify');
var concat 		= require('gulp-concat');
var minifyCSS 	= require('gulp-minify-css');
var sourcemaps 	= require('gulp-sourcemaps');
var jshint 		= require('gulp-jshint');

var path = {
	css: {
		src: 'src/css/*.css',
		files: 'src/css/**/*.css',
		dest: './dist/'
	},
	js: {
		src: ['src/js/*.js'],
		files: 'src/js/**/*.js',
		dest: './dist/'
	}
}

gulp.task('cssmin', function(){
	return gulp.src(path.css.src)
			.pipe(plumber(function(err){
				console.log(err.message);
				this.emit('end');
			}))
			.pipe(gulp.dest(path.css.dest))
			.pipe(concat('waves.min.css'))
			.pipe(minifyCSS())
			.pipe(gulp.dest(path.css.dest));
});

gulp.task('uglify', function(){
	return gulp.src(path.js.src)
			.pipe(plumber(function(err){
				console.log(err.message);
				this.emit('end');
			}))
			.pipe(jshint())
  			.pipe(jshint.reporter('default'))
    		.pipe(sourcemaps.init())
			.pipe(gulp.dest(path.js.dest))
			.pipe(concat('./waves.min.js'))
			.pipe(uglify({
				preserveComments: 'some'
			}))
			.pipe(sourcemaps.write('./', {
				includeContent: false
			}))
			.pipe(gulp.dest(path.js.dest));
});

gulp.task('watch', function(){
	gulp.watch(path.css.files, ['cssmin']);
	gulp.watch(path.js.files, ['uglify']);
});

gulp.task('default', ['cssmin', 'uglify', 'watch']);