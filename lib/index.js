'use strict';

var _ = require('lodash');
var configurable = require('./configurable.js');
var gulpfy = require('./gulpify.js');

module.exports = function(userConfig, options) {
    var settings = _normalize(userConfig, options);

    configurable.init(settings);
    configurable.tasks();
    configurable.subtasks();


    console.log(configurable.settings);
    // configurable.bundles();

    // gulpify.init();
    // gulpify.create();
};

/////////////////////////////

function _normalize(userConfig, options) {
    var defaultOptions = {
        tasks: __dirname + '/../../../tasks'
    };

    if (typeof userConfig ===  'string') {
        var tmp = userConfig;
        userConfig = options;
        options = {
            tasks: tmp
        };
    }

    options = _.extend(defaultOptions, options);

    return {
        userConfig: userConfig,
        options: options
    };
}
