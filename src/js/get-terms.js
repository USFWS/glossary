(function () {
  'use strict';

  var xhr = require('xhr');
  var emitter = require('./mediator');

  var terms;

  function init(path) {
    xhr.get(path, function (err, res) {
      if (err) throw new Error('Could not download terms with the given path.');
      terms = JSON.stringify(res.body);
      emitter.emit('terms:loaded', terms);
    });
  }

  module.exports.load = init;
})();
