'use strict';

var _ = require('lodash');
var settings = require('./config.js');

module.exports = function(config) {
    var configuration = new Configurable(config);
    return configuration;
};

/////////////////////////////

function Configurable(config) {
    this.options = config;
    this.normalize();
}

Configurable.prototype.template = /\${([\s\S]+?)}/g;

Configurable.prototype.normalize = function normalize() {
    this.options = _.extend(settings, this.options);
    this.options = this.templatize(this.options);
};

Configurable.prototype.templatize = function templatize(config) {
    var self = this;
    var options = {};

    _.forEach(config, function(value, key){
        var isObject = _.isObject(value);

        if (isObject) {
            options[key] = self.templatize(value);
        } else {
            options[key] = self.parse(value);
        }
    });

    return options;
};

Configurable.prototype.parse = function parse(value) {
    var compiled = _.template(value);
    return compiled(this.options);
};
