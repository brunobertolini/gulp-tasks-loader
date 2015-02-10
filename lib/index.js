'use strict';

var fs = require('fs');
var _ = require('lodash');
var settings = require('./config.js');
var configurable = require('./configurable.js');

var manager = {
    options: {
        tasks: __dirname + '/../tasks'
    },

    loader: loader
};

module.exports = function(config, options) {
    manager.options = _.extend(manager.options, options);

    manager.loader(config);
};

/////////////////////////////

function _requireAll(dirname) {
    var tasks = {};
    var files = fs.readdirSync(dirname);

    files.forEach(function(file){
        if (file !== 'index.js') {
            var filepath = dirname + '/' + file;

            if (fs.statSync(filepath).isDirectory()) {
                var recursive = _requireAll(filepath);
                tasks = _.extend(tasks, recursive);
            } else {
                var task = require(filepath);
                tasks[task.name] = task;
            }
        }

    });

    return tasks;
}

/*-------------------------*/

function loader(config) {
    var enables = [];

    _.forEach(config, function(value, key){
        var task = loadTask(key, value);

        if (task) {
            task.subtasks = subtasks(task);
            enables.push(task);
        }
    });

    console.log(enables[0]);
}

function loadTask(key, value) {
    var task = false;
    var filepath = manager.options.tasks + '/' + key + '/index.js';

    if (value && fs.existsSync(filepath)) {
        task = require(filepath);

        if (!_.isBoolean(value) && !_.isObject(value)) {
            value = {src: value};
        }

        task.settings = _.extend(task.settings, value);
    };

    return task;
}

function subtasks(task) {
    var basepath = manager.options.tasks + '/' + task.name;
    var subtasks = _requireAll(basepath);

    _.forEach(subtasks, function(subtask, key) {
        var index = (subtask.config) ? subtask.config : key.replace(task.name+':','');
        var config = task.settings[index];

        if (config !== undefined && !config) {
            delete subtasks[key];
        }

        if (_.isObject(config)) {
            subtask.settings = _.extend(subtask.settings || {}, config)
        }

        delete task.settings[index];
    });

    return subtasks;
}
