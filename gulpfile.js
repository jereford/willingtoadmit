
var gulp = require('gulp'),
	hint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	mincss = require('gulp-cssmin'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	filter = require('gulp-filter'),
	browserify = require('gulp-browserify'),
	imSoStylish = require('jshint-stylish'),
	sass = require('gulp-ruby-sass'),
	web = require('gulp-webserver');
	imagemin = require('gulp-imagemin');
	cache = require('gulp-cache');


var do_browserify = true;
var src = '/';
var dest = 'app/';

gulp.task('hint', function() {
	gulp.src(dest + 'js/app.js')
		.pipe(filter(function(file) {
			var fn = file.path.split('/')[file.path.split('/').length-1];
			return fn !== "bundle.js";
		}))
		.pipe(hint())
		.pipe(hint.reporter('jshint-stylish'));
});

 gulp.task('images', function() {
  return gulp.src('images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dest + 'img'));
});

gulp.task('sass', function() {

	gulp.src(dest + 'scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest(dest + 'css'));
});

gulp.task('libs', function() {

	gulp.src('bower_components/**/*.min.js')
	.pipe(concat('libs.js'))
	.pipe(gulp.dest(dest + 'js'));

	gulp.src('bower_components/**/*.css')
	.pipe(concat('libs.css'))
	.pipe(gulp.dest(dest + 'css'));
});

if(do_browserify) // there's a better way to do this
{
	gulp.task('browserify', function() {
			gulp.src(dest + 'js/app.js')
				.pipe(browserify())
				.pipe(rename('bundle.js'))
				.pipe(gulp.dest(dest + 'js'));
	});
} else {
	gulp.task('browserify', function() {});
}

gulp.task('scripts', ['hint', 'browserify']);

gulp.task('server', function() {

	gulp.src(dest).pipe(web({livereload:true, open:true}));
});

gulp.task('clean', function() {

	gulp.src(dest + '**/*.*', {read:false}).pipe(clean({force: true}));

});

gulp.task('build', ['clean', 'sass', 'scripts'], function() {

	gulp.src(dest + '**')
		.pipe(filter(function(file) {
			var ext = file.path.split('.')[1];
			return ext !== "js" && ext !== "css" && ext !== "scss";
		}))
		.pipe(gulp.dest(dest));

	if(do_browserify)
		gulp.src(dest + 'js/bundle.js').pipe(uglify()).pipe(gulp.dest(dest + 'js'));
	else
		gulp.src(dest + 'js/**/*.js').pipe(uglify()).pipe(gulp.dest(dest + 'js'));

	gulp.src(dest + 'css/**/*.css').pipe(mincss()).pipe(gulp.dest(dest + 'css'));


});

gulp.task('watch', function() {

	gulp.watch(dest + 'js/**/*.js', ['scripts']);
	gulp.watch(dest + 'scss/**/*.scss', ['sass']);
	gulp.watch(dest + 'img/**/*', ['images']);

});

gulp.task('default', ['sass', 'scripts', 'libs', 'images', 'server', 'watch']);
