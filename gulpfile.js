var gulp = require('gulp');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');

var path = {
	css: {
		src: 'src/css/*.css',
		files: 'src/css/**/*.css',
		dest: '.'
	},
	js: {
		src: ['src/js/*.js'],
		files: 'src/js/**/*.js',
		dest: '.'
	}
}

gulp.task('cssmin', function(){
	return gulp.src(path.css.src)
		.pipe(plumber(function(err){
			console.log(err.message);
			this.emit('end'); // https://github.com/floatdrop/gulp-plumber/issues/8#issuecomment-41465386
		}))
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
	.pipe(concat('waves.min.js'))
	.pipe(uglify({
		preserveComments: 'some'
	}))
	.pipe(gulp.dest(path.js.dest));
});

gulp.task('watch', function(){
	gulp.watch(path.css.files, ['cssmin']);
	gulp.watch(path.js.files, ['uglify']);
});

gulp.task('default', ['cssmin', 'uglify', 'watch']);