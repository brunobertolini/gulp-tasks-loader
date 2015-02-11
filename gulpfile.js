'use strict';

var playground = require('./lib')( __dirname + '/tasks', {

    name: 'component',

    scripts: {
        src:'ok',

        tests: false,
        jshint: {
            't': '${scripts.jshint.name}'
        }
    }
});
