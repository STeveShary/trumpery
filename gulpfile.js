var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  gutil = require('gulp-util'),
  nodemon = require('gulp-nodemon'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  del = require('del');

gulp.task('default', function() {
  return gulp.src(['test/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        should: require('should')
      }
    }));
});

gulp.task('mocha', function() {
    return gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['lib/**', 'test/**'], ['mocha']);
});

gulp.task('develop', ['watch-mocha', 'prepareJs', 'setCombinedScriptLoad'],function() {
  nodemon({script: 'bin/www', etx: 'html js css', ignore: 'public/dist/**/*'})
    .on('restart', ['prepareJs', function() {
      console.log('App restarted!')
    }]);
});

gulp.task('prepareJs', ['clean'], function() {
  gulp.src([
    'public/js/lib/jquery-1.11.2-min.js',
    'public/js/boilerplate.js',
    'public/js/lib/angular.min.js',
    'public/js/lib/angular-animate.min.js',
    'public/js/lib/angular-cookies.min.js',
    'public/js/lib/lodash.js',
    'public/js/lib/ngroute.js',
    'public/js/controllers/services.js',
    'public/js/controllers/controllers.js',
    'public/js/controllers/play.js',
    'public/js/application.js',
    '!public/js/test/**/*.js'])
    .pipe(concat('app-combined.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist'));
});

gulp.task('setCombinedScriptLoad', function() {
  // Save original index.html... just in case
  del(['client/orig/**']);
  gulp.src('public/index.html')
    .pipe(gulp.dest('client/orig'));

  gulp.src('client/gulpified/index.html')
    .pipe(gulp.dest('public/'));
});

gulp.task('restoreIndividualScriptLoad', function() {
  del(['public/dist/**']);
  gulp.src('client/orig/index.html')
    .pipe(gulp.dest('public/'));
});

gulp.task('clean', function(cb) {
  del(['public/dist/**'],
    cb);
});