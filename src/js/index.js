(function () {
  'use strict';
  var glossary = require('./glossary');
  var data = require('./get-terms');
  var emitter = require('./mediator');

  var lunrIndex = function () {
    this.field('name', { boost: 10 });
    this.field('description');
    this.field('related', { boost: 5 });
    this.field('acronym', { boost: 3 });
    this.ref('id');
  };

  data.load('../data/terms.js');

  emitter.on('terms:loaded', function (terms) {

    glossary.init({
      terms: terms,
      container: '.glossary-container',
      lunrIndex: lunrIndex
    });

  });

})();
