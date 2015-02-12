'use strict';

var _ = require('lodash');
var gulp = require('gulp-help')(require('gulp'));
var runSequence = require('run-sequence');
var configurable = require('./configurable.js');

var gulpfy = {
    _config: [],

    tasks: tasks,
    create: create
};

module.exports = gulpfy;

/////////////////////////////

function _add(originalTask) {
    var task = _.clone(originalTask);
    var gulpTask = false;

    if (_.isObject(task) && task.name) {
        gulpTask = {
            name: task.name,
            description: task.description || false,
            dependencies: task.dependencies || [],
            sequence: task.sequence,
            callback: task.callback
        };

        _.forEach(task, function(value, key){
            var isSubtask = task[key].name;
            if ((gulpTask[key] !== undefined && value !== undefined) || isSubtask) {
                delete task[key];
            }
        });

        gulpTask.options = task;
    }

    return gulpTask;
}

/*-------------------------*/

function tasks() {
    _.forEach(configurable.settings, function(originalTask){
        var task = _add(originalTask);

        if (task) {
            gulpfy._config.push(task);

            _.forEach(originalTask, function(subtask){
               var subtask = _add(subtask);

                if (subtask) {
                    subtask.options = _.extend(_.clone(task.options), subtask.options);
                    gulpfy._config.push(subtask);
                }
            });
        }
    });
}

function create() {
    var tasks = gulpfy._config.map(function(task){
        return task.name;
    });

    gulpfy._config.forEach(function(task){
        var parentName = task.name.split(':');

        if (parentName.length > 1) {
            var inParent = configurable.settings[parentName[0]].sequence.indexOf(task.name);

            if (inParent > -1) {
                task.description = false;
            }
        }

        task.sequence = _.intersection(task.sequence || [], tasks);
        task.dependencies = _.intersection(task.dependencies || [], tasks);

        if (task.sequence.length || task.dependencies.length || task.callback) {

            if (task.sequence.length) {
                task.callback = function(done) {
                    var sequence = task.sequence;

                    if (task.callback) {
                        sequence.push(task.callback);
                    }

                    sequence.push(done);
                    runSequence.apply({}, sequence);
                };
            }

            gulp.task(task.name, task.description, task.dependencies, task.callback);
        }
    });
}
