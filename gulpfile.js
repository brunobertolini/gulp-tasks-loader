'use strict';

var playground = require('./lib')( __dirname + '/tasks', {

    name: 'component',

    bundles: ['build', 'ci', 'release'],

    scripts: {
        src:'ok',

        tests: true,
        jshint: {
            't': '${scripts.jshint.name}'
        }
    }
});
