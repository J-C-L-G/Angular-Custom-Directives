var gulp = require('gulp'),
    del = require('del'),
    rename = require('gulp-rename'),
    inject = require('gulp-inject');

gulp.task('clean',function(){
    return del('./build');
});

gulp.task('copyFiles',['clean'],function(){
    gulp.src('./src/**')
        .pipe(gulp.dest('./build'));
});

gulp.task('libraries',['copyFiles'],function(){
    return gulp.src([ './bower_components/**/*.min.css',
        './bower_components/**/*.min.js',
        './bower_components/highcharts/**/*.js'])
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('./build/lib'));
});

gulp.task('inject',['libraries'],function(){
    gulp.src('./src/index.html')
        /*Bower CSS*/
        .pipe(inject(gulp.src(['./build/lib/*.css','./build/lib/*.full.css'], {read: false}), {starttag: '<!-- inject:bower:css -->', relative:true}))
        /*Custom CSS*/
        .pipe(inject(gulp.src('./build/styles/*.css', {read: false}), {starttag: '<!-- inject:custom:css -->', relative:true}))
        /*Libraries*/
        .pipe(inject(gulp.src('./build/lib/**/*jquery*.js', {read: false}), {starttag: '<!-- inject:libraries:jQuery:js -->', relative:true}))
        .pipe(inject(gulp.src('./build/lib/**/*handsontable.full.*.js', {read: false}), {starttag: '<!-- inject:libraries:handsontable:js -->', relative:true}))
        .pipe(inject(gulp.src(['./build/lib/**/*highcharts.js','./build/lib/**/*highcharts-3d.js','./build/lib/**/exporting.js'], {read: false}), {starttag: '<!-- inject:libraries:highcharts:js -->', relative:true}))
        /*Angular*/
        .pipe(inject(gulp.src('./build/lib/**/angular.min.js', {read: false}), {starttag: '<!-- inject:angular:js -->', relative:true}))
        /*Angular Route*/
        .pipe(inject(gulp.src('./build/lib/**/angular-route.min.js', {read: false}), {starttag: '<!-- inject:angular-route:js -->', relative:true}))
        /*Angular Module, Routes & Components */
        .pipe(inject(gulp.src(['./build/app/**/*.Module.js','./build/**/*.Routes.js','./build/app/**/*.js'], {read: false}), {starttag: '<!-- inject:angular-components:js -->', relative:true}))
        .pipe(gulp.dest('./build'));
});

gulp.task('default',['clean', 'copyFiles','libraries','inject']);