'use strict';

var _ = require('lodash');
var configurable = require('./configurable.js');
var gulpfy = require('./gulpify.js');

module.exports = function(userConfig, options) {
    var settings = _normalize(userConfig, options);

    configurable.init(settings);
    configurable.tasks();
    configurable.subtasks();
    configurable.templatize();

    console.log(configurable.settings);

    // gulpfy.init();
    // gulpfy.tasks();
    // gulpfy.bundles();
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
