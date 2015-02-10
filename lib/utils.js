'use strict';

var fs = require('fs');

var utils = {
    requireAll: requireAll,
    removeItem: removeItem
};

module.exports = utils;

/////////////////////////////

function requireAll(dirname) {
    var files;
    var tasks = {};

    if (dirname && fs.statSync(dirname).isDirectory() ) {

        files = fs.readdirSync(dirname);

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
    }

    return tasks;
}

function removeItem(arr, item) {
    var pos = arr.indexOf(item);

    if (pos > -1) {
        arr.splice(pos, 1);
    }

    return arr;
}
