
var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('less', function() {
  gulp
    .src(['assets/less/main.less'])
    .pipe(less())
    .pipe(gulp.dest('assets/css/'))
    ;
});

gulp.task('watch', function() {
  gulp.watch(['assets/less/*', 'assets/less/**/*'], ['less']);
});

gulp.task('default', 'watch');