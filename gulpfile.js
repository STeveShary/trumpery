var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  gutil = require('gulp-util'),
  nodemon = require('gulp-nodemon');

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

gulp.task('develop', ['watch-mocha'],function() {
  nodemon({script: 'bin/www', etx: 'html js css', ignore: ''})
    .on('restart', function() {
      console.log('App restarted!')
    });
});