'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var browserSync = require('browser-sync');
var less = require('gulp-less');
var path = require('path');
var path = require('path');

gulp.task('test', function(done){
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});


gulp.task('jshint', function() {
    return gulp.src('./src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('serve', ['watch'], function() {
    browserSync({
        server : {
            baseDir:'./src'
        }
    });
});

gulp.task('less', function() {
    return gulp.src('./src/less/**/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('./src/css/'));
});

gulp.task('reload', function() {
   browserSync.reload();
});

gulp.task('watch', function(){
    gulp.watch('./src/less/**/*.less', ['less']);
    gulp.watch('./src//**/*.html', ['reload']);
    gulp.watch('./src/js/*/*.js', ['reload']);

});

gulp.task('default', ['serve']);





