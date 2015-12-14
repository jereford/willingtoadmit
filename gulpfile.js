
var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	browserify = require('gulp-browserify'),
	cache = require('gulp-cache'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	declare = require('gulp-declare'),
	flatten = require('gulp-flatten'),
	filter = require('gulp-filter'),
	ghPages = require('gulp-gh-pages'),
	imSoStylish = require('jshint-stylish'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	sass = require('gulp-ruby-sass'),
	imagemin = require('gulp-imagemin'),
	hint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	web = require('gulp-webserver'),
	wrap = require('gulp-wrap');



var do_browserify = true,
	src = '/',
	dest = 'app/',
	bowerStyles = ['!bower_components/**/*.min.css', 'bower_components/**/*.css'],
	bowerScripts = 'bower_components/**/*.min.js';

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

	return gulp.src(dest + 'scss/**/*.scss')
		.pipe(sass({
			 "sourcemap=none": true // hack to allow auto-prefixer to work
		}))
		.pipe(autoprefixer())
		.pipe(gulp.dest(dest + 'css'));
});

gulp.task('deploy', function() {
  return gulp.src(dest + "**/*")
    .pipe(ghPages());
});

gulp.task('libs', function() {

	gulp.src(bowerScripts)
	.pipe(concat('libs.js'))
	.pipe(gulp.dest(dest + 'js'));

	gulp.src(bowerStyles)
	.pipe(flatten())
	.pipe(cssmin())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(dest + 'css/libs'));
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
