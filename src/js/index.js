(function () {
  'use strict';
  var glossary = require('./glossary');
  var data = require('./get-terms');
  var emitter = require('./mediator');

  data.load('../data/terms.js');

  emitter.on('terms:loaded', function (terms) {

    glossary.init({
      terms: terms,
      container: '.glossary-container'
    });

  });

})();
