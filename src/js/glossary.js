(function () {
  'use strict';
  var _ = require('./util')._;
  var xhr = require('xhr');

  var options = {};
  var defaults = {
    active: false,
    termClass: 'glossary-term',
    content: 'main-content'
  };

  function init(opts) {
    options = _.defaults(opts, defaults);
    if (options.dataUrl) downloadTerms();
  }

  function downloadTerms() {
    xhr.get(options.dataUrl, function (err, res) {
      if (err) console.error(err);
      options.terms = JSON.parse(res.body);
    });
  }

  function isActive() {
    return options.active;
  }

  exports.init = init;
  exports.isActive = isActive;
})();
