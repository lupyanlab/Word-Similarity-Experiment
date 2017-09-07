const gulp = require('gulp');
const htmlreplace = require('gulp-html-replace');

gulp.task('default', function() {
    console.log("hello world");
})

gulp.task('copy', function() {
    gulp.src('dev/*')
        .pipe(gulp.dest('prod'));
})

gulp.task('switchjs', ['copy'], function() {
    gulp.src('dev/index.html')
        .pipe(htmlreplace({
            'js': 'prod.js'
        }))
        .pipe(gulp.dest('prod'));
})

gulp.task('prod', ['copy', 'switchjs']);