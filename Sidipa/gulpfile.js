var gulp = require('gulp');
var uglyfly = require('gulp-uglyfly');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('scripts_index', function () {
    return gulp.src(['./public/js/index/Canvas.js', './public/js/index/Graph.js', './public/js/index/Onda.js', './public/js/index/config.js', './public/js/index/clientSocket.js'])
    .pipe(concat('sidipa.min.js'))
    .pipe(uglyfly())
    .pipe(gulp.dest('./public/js/lib/'));
});


gulp.task('mincss', function () {
    return gulp.src('./public/css/*.css')
		.pipe(autoprefixer({
        browsers: ['> 5%','iOS 7','Firefox <= 20','ie 6-8'],
        cascade: false
    }))
        .pipe(minifyCSS())
		.pipe(gulp.dest('./public/css/min/'));
});