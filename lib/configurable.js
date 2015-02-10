'use strict';

var fs = require('fs');
var _ = require('lodash');
var utils = require('./utils.js');
var configDefault = require('./config.js');

var manager = {
    _options: null,
    _tasks: null,

    settings: null,

    init: init,
    tasks: tasks,
    subtasks: subtasks
};

module.exports = manager;

/////////////////////////////

function _loadTask(key, value) {
    var filepath = manager._options.tasks + '/' + key + '/index.js';
    var task = {
        settings: value
    };

    if (value && fs.existsSync(filepath)) {
        task = require(filepath);

        if (!_.isBoolean(value) && !_.isObject(value)) {
            value = {src: value};
        }

        task.settings = _.extend(task.settings, value);
    };

    return task;
}

function _parse(task, subtask) {
    var realName = subtask.name.replace(task.name+':', '');
    var configKey = subtask.config || realName;

    var userSettings = manager.settings[task.name][configKey];


}

/*-------------------------*/

function init(settings) {
    manager._options = settings.options;
    manager.settings = _.extend(configDefault, settings.userConfig);
}

function tasks() {
    _.forEach(manager.settings, function(value, key) {
        var task = _loadTask(key, value);
        var settings = (typeof task.settings === 'string')
            ? task.settings
            : _.extend(task, task.settings);

        delete settings.settings;

        manager.settings[key] = settings;
    });
}

function subtasks() {
    _.forEach(manager.settings, function(task, key){
        if (_.isObject(task) && task.name) {
            var subtasks = utils.requireAll(manager._options.tasks + '/' + task.name);

            _.forEach(subtasks, function(subtask){
                var realName = subtask.name.replace(task.name+':', '');
                var configKey = subtask.config || realName;

                if (manager.settings[task.name][configKey] === false) {
                    var sequence = manager.settings[task.name].sequence;
                    sequence = utils.removeItem(sequence, subtask.name);
                    manager.settings[task.name].sequence = sequence;
                } else {
                    var settings;
                    var userSettings = manager.settings[task.name][configKey];

                    if(!_.isObject(userSettings)) {
                        userSettings = {};
                    }

                    subtask.settings = _.extend(task.settings || {}, userSettings);

                    settings = (typeof subtask.settings === 'string')
                        ? subtask.settings
                        : _.extend(subtask, subtask.settings);

                    delete settings.settings;

                    manager.settings[task.name][realName] = settings;
                }
            });
        }
    });
}
