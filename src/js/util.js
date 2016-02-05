(function () {
  'use strict';

  var dom = {
    insert: require('insert'),
    classList: require('class-list')
  };

  var _ = {
    defaults: require('lodash.defaults')
  };

  module.exports._ = _;
  module.exports.dom = dom;
})();
