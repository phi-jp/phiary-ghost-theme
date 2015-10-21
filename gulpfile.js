
var gulp = require('gulp');
var less = require('gulp-less');
var pleeease = require('gulp-pleeease');

gulp.task('less', function() {
  gulp
    .src(['assets/less/main.less'])
    .pipe(less({
      ieCompat: false,
    }))
    .pipe(pleeease({
      minifier: false,
      // autoprefixer: {"browsers": ["last 2 versions"]}
    }))
    .pipe(gulp.dest('assets/css/'))
    ;
});

gulp.task('watch', function() {
  gulp.watch(['assets/less/*', 'assets/less/**/*'], ['less']);
});

gulp.task('default', ['watch']);