var gulp = require("gulp");
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');


// それぞれのプラグインで行う処理を書いていく
gulp.task('concat', function() {
  return gulp.src('src/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dest'));
});

gulp.task('uglify', ['concat'], function() {
  return gulp.src('dest/app.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('dest'));
});

gulp.task('default', ['uglify']);