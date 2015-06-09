var gulp = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	gutil = require('gulp-util'),
	less = require('gulp-less'),
	minify = require('gulp-minify-css'),
	path = require('path'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	browserify = require('browserify'),
	reactify = require('reactify'); 

gulp.task('browserify', function () {
	var bundler = browserify('./app/main.js');

	bundler
		.transform('reactify')
		.bundle()
		.pipe(source('./app/main.js'))
		.pipe(buffer())
		.pipe(rename('poen.js'))
		.pipe(gulp.dest('./public/'))
		.pipe(uglify().on('error', gutil.log))
		.pipe(rename('poen.min.js'))
		.pipe(gulp.dest('./public/'));
});

gulp.task('less', function () {
	gulp.src('./styles/poen.less')
		.pipe(less({ paths: [ './styles/*.css' ] }))
		.pipe(minify())
		.pipe(rename('poen.min.css'))
		.pipe(gulp.dest('./public/'));
});

gulp.task('watch', function () {
	gulp.watch('./app/**/*.js', ['browserify']);
	gulp.watch('./styles/**/*.less', ['less']);
});

gulp.task('default', ['browserify', 'less', 'watch']);