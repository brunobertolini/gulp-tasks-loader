'use stirct';

var config = {

    name: 'scripts',
    description: 'Scripts optimization',

    bundle: ['build'],

    sequence: [
        'scripts:jshint',
        'scripts:tmp-create',
        'scripts:ng-directives',
        // 'scripts:templateCache',
        'scripts:test-dev',
        'scripts:build',
        'scripts:test-build',
        'scripts:bundle',
        // 'scripts:test-bundle',
        'scripts:tmp-clean'
    ],

    settings: {
        qualityReport: './reports/quality',
        minify: { root: 'src' },
        bundle: false,

        src: [
            './src/module/**/*.module.js',
            './src/module/**/*.js',
        ],

        tests: {
            shared: [
                './lib/angular/angular.js',
                './lib/angular-mocks/angular-mocks.js'
            ],

            libs: [],

            spec: [
                './test/**/*.spec.js',
                './src/modules/**/*.spec.js'
            ]
        },

        path: {
            tmp: './tmp',
            build: './build/js'
        }
    }
};

module.exports = config;
