'use strict';

var config = {
    name: 'scripts',
    description: 'Scripts optimization',
    dependencies: [],

    sequence: [
        'jshint',
        'test-devmode'
    ],

    settings: {
        paths: {
            dist: '{$paths.assets}/js',
            tmp: './tmp/'
        },

        src: [
            '{$paths.src}/**/module.js',
            '{$paths.src}/**/*.js'
        ]
    }
};

module.exports = config;
