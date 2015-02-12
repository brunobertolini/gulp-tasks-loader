'use strict';

var gulp = require('gulp-playground')( __dirname + '/tasks', {

    // Project name
    name: 'search',

    // Tasks
    scripts: {
        src: './lib/**/*.js'
    },

    git: true,
    less: true
});
