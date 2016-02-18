(function () {
  'use strict';

  var dom = require('./util.dom');

  var _ = {
    defaults: require('lodash.defaults'),
    each: require('lodash.foreach'),
    isArray: require('lodash.isArray'),
    isNode: require('is-dom'),
    map: require('lodash.map')
  };

  module.exports._ = _;
  module.exports.dom = dom;
})();
