'use strict';

var fs = require('fs');
var _ = require('lodash');
var utils = require('./utils.js');
var Templatize = require('./templatize.js');

var manager = {
    _tasks: null,
    _options: {
        tasks: __dirname + '/../../../tasks'
    },

    settings: null,

    init: init,
    tasks: tasks,
    subtasks: subtasks,
    templatize: templatize
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

        task.settings = _.merge(task.settings, value);
    };

    return task;
}

/*-------------------------*/

function init(settings) {
    manager._options = _.merge(manager._options, settings.options);
    manager.settings = settings.userConfig;
}

function tasks() {
    _.forEach(manager.settings, function(value, key) {
        var settings;
        var task = _loadTask(key, value);

        task.settings = task.settings || {};

        settings = ( _.isObject(task.settings) && !_.isArray(task.settings) )
            ? _.merge(task, task.settings)
            : task.settings;

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

                if (manager.settings[task.name][configKey] === undefined || manager.settings[task.name][configKey]) {
                    var settings;
                    var userSettings = manager.settings[task.name][configKey];

                    if(!_.isObject(userSettings) || _.isArray(userSettings)) {
                        userSettings = {};
                        userSettings[realName] = manager.settings[task.name][configKey];
                    }

                    subtask.settings = _.merge(task.settings || {}, userSettings);

                    settings = (typeof subtask.settings === 'string')
                        ? subtask.settings
                        : _.merge(subtask, subtask.settings);

                    delete settings.settings;

                    manager.settings[task.name][realName] = settings;
                }
            });
        }
    });
}

function templatize() {
    manager.settings = new Templatize(manager.settings, manager._options.template);
}

