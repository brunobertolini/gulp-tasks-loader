'use strict';

var packagePath = __dirname + '/../../package.json';

var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')({config: path.normalize(packagePath)});

var config = {
    name: 'scripts:jshint',
    description: 'Run lint into js code',
    callback: callback
};

module.exports = config;

/////////////////////////////

function callback(settings) {
    return gulp.src(settings.src)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'))
        .pipe($.size({title: 'scripts:jshint'}));
}
