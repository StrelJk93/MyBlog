var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');

gulp.task('sass', function() {
	return gulp.src('_html/sass/*.sass')
		.pipe(sass())
		.pipe(gulp.dest('_html/css'))
		.pipe(browserSync.reload({
			stream: true,
		}))
});

gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: '_html',
		},
	})
});

gulp.task('js-libs', function() {
	return gulp.src([
			'_html/libs/jquery/dist/jquery.min.js',
			'_html/libs/bootstrap/dist/js/bootstrap.min.js',
			'_html/libs/angular/angular.min.js',
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('_html/js'))
});

gulp.task('js-main', function() {
	return gulp.src([
			'_html/js/main.js',
			'_html/js/controllers/**/*.js',
		])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('_html/js'))
})

gulp.task('css-libs', ['sass'], function() {
	return gulp.src('_html/css/libs.css')
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('_html/css'))
});

gulp.task('css-main', ['sass'], function() {
	return gulp.src('_html/css/main.css')
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('_html/css'))
})

gulp.task('watch', ['browserSync', 'css-libs', 'js-libs', 'js-main'], function() {
	gulp.watch('_html/sass/**/*.sass', ['sass']);
	gulp.watch('_html/*.html', browserSync.reload);
	gulp.watch('_html/js/**/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('build', ['clean', 'img', 'css-libs', 'js-libs', 'js-main'], function() {
	var buildCss = gulp.src([
			'_html/css/main.min.css',
			'_html/css/libs.min.css',
		])
		.pipe(gulp.dest('public/css'))

	var buildFonts = gulp.src('_html/fonts/**/*')
		.pipe(gulp.dest('public/fonts'))

	var buildJs = gulp.src([
			'_html/js/main.min.js',
			'_html/js/libs.min.js',
		])
		.pipe(gulp.dest('public/js'))
});

gulp.task('clean', function() {
	return del.sync([
			'public/js/main.min.js',
			'public/js/libs.min.js',
			'public/css/main.min.css',
			'public/css/libs.min.css',
		]);
});

gulp.task('img', function() {
	return gulp.src('_html/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('public/img'));
});
