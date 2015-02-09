'use strict';

var playground = require('./index.js')({

    name: 'component',

    scripts: {
        name: '${name} works',
        path: '${paths.dist}/js '
    }

});
