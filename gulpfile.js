const gulp = require('gulp');

gulp.task('hello', function() {
    console.log("hello world");
})

gulp.task('copy', function() {
    gulp.src('dev/*')
        .pipe(gulp.dest('dist'));
})