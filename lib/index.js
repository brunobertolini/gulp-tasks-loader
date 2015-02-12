'use strict';

var gulp = require('gulp-help')(require('gulp'));
var _ = require('lodash');
var configurable = require('./configurable.js');
var gulpfy = require('./gulpify.js');

module.exports = function(userConfig, options) {
    var settings = _normalize(userConfig, options);

    configurable.init(settings);
    configurable.tasks();
    configurable.subtasks();
    configurable.bundles();
    configurable.templatize();

    gulpfy.tasks();
    gulpfy.create();
};

/////////////////////////////

function _normalize(userConfig, options) {
    if (typeof userConfig ===  'string') {
        var tmp = userConfig;
        userConfig = options;
        options = {
            tasks: tmp
        };
    }

    return {
        userConfig: userConfig,
        options: options
    };
}
