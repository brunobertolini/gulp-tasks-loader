'use stirctsequence';

var config = {

    name: 'build',
    description: 'Prepare code for production',

    dependencies: [],

    sequence: [
        'less',
        'sass',
        'scripts',
        'image',
        'font',
        'html'
    ]
};

module.exports = config;
