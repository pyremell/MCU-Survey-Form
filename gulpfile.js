var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');

// Gulp Watch
var browserSync = require('browser-sync').create();

var useref = require('gulp-useref');

// Other requires
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('sass', function() {
  return gulp.src('app/assets/**/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('app/assets/styles'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Gulp watch
gulp.task('watch', ['browserSync'], function() {
  gulp.watch('app/assets/**/*.scss', ['sass']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/index.html', browserSync.reload);
  gulp.watch('app/assets/**/*.js', browserSync.reload);
});

// Browser Sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

// useref
gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// imagemin
gulp.task('images', function() {
  return gulp.src('app/assets/images/**/*.+(png|jpg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      // Setting interlaced to true for jpegs
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/assets/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('cache:clear', function(callback) {
  return cache.clearAll(callback)
});

// Combined tasks for Gulp builds
gulp.task('build', function() {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
});

// Combined tasks for workflow
gulp.task('default', function (callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback
  )
});
