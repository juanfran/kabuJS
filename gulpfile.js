var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task('default', function() {
  gulp.src('src/index.js')
    .pipe(uglify())
    .pipe(rename("kabu.min.js"))
    .pipe(gulp.dest('dist/'))
});
