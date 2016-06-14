var gulp         = require('gulp'),
    jshint       = require('gulp-jshint'),
    concat       = require('gulp-concat'),
    rename       = require('gulp-rename'),
    uglify       = require('gulp-uglify'),
    minifyCss    = require('gulp-minify-css'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {

    return gulp
        .src('scss/index.scss')
        .pipe(sass()).on('error', sass.logError)
        .pipe(autoprefixer())
        // .pipe(minifyCss())
        .pipe(rename('index.min.css'))
        .pipe(gulp.dest('css'));

});

gulp.task('default', ['sass'], function () {

    gulp.watch(['scss/*.scss', 'scss/**/*.scss'], ['sass']);

});