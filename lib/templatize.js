'use strict';

var _ = require('lodash');

var templatize = {
  _hash: "_$HASH$_",
  _hashRE: /(_\$HASH\$_)/g,
  _template: /\${([\s\S]+?)}/g,
  _cache: {},

  parse: parse,
  serialize: serialize,
  unserialize: unserialize,
  mount: mount
};

function Templatize(obj, template) {
  var self = this;

  _.templateSettings.interpolate = template || self._template;

  self.serialize(obj);

  _.forEach(self._cache, function(value, key){
    self._cache[key] = self.parse(value, self._cache);
  });

  obj = self.unserialize(self._cache);

  return obj;
}

Templatize.prototype = templatize;

module.exports = Templatize;

/////////////////////////////

function parse(string, parser) {
  if (_.isArray(string)) {
    return string.map(function(item){
      var compiled = _.template(item);
      return compiled(parser);
    });
  } else if (!_.isFunction(string)) {
    var compiled = _.template(string);
    return compiled(parser);
  } else {
    return string;
  }
}

function serialize(obj, prefix) {
  var self = this;

  _.forEach(obj, function(value, key){
    var localprefix = key;

    if (prefix) {
      localprefix = prefix + self._hash + key;
    }

    if (_.isObject(value) && !_.isArray(value) && !_.isFunction(value)) {
      self.serialize(value, localprefix);
    } else if (_.isObject(value) && _.isArray(value)) {
      self._cache[localprefix] = value.map(function(item) {
        return item.replace(/(\.)/g, self._hash);
      });
    } else {
      self._cache[localprefix] = (typeof value === 'string')
        ? value.replace(/(\.)/g, self._hash)
        : value;
    }
  });
}

function mount(obj, key, value) {
  var self = this;
  var sub = key.split(self._hash);

  obj = obj || {};

  if (sub.length > 1) {
    key = sub.shift();
    obj[key] = self.mount(obj[key], sub.join(self._hash), value);
  } else {
    obj[key] = (typeof value === 'string')
      ? value.replace(self._hashRE, '.')
      : (!_.isArray(value))
        ? value
        : value.map(function(item){
          return item.replace(self._hashRE, '.');
        });
  }

  return obj;
}

function unserialize(cache, obj){
  var self = this;

  _.forEach(cache, function(value, key){
    obj = self.mount(obj, key, value);
  });

  return obj;
}
