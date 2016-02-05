(function () {
  'use strict';

  var dom = {
    insert: require('insert'),
    ClassList: require('class-list'),
    isNode: require('is-dom')
  };

  var _ = {
    defaults: require('lodash.defaults')
  };

  module.exports._ = _;
  module.exports.dom = dom;
})();
