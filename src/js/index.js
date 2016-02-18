(function () {
  'use strict';
  var glossary = require('./glossary');
  var highlighter = require('./highlighter');
  var data = require('./get-terms');
  var emitter = require('./mediator');
  var dom = require('./util').dom;

  var lunrIndex = function () {
    this.field('name', { boost: 10 });
    this.field('description');
    this.field('related', { boost: 5 });
    this.field('acronym', { boost: 3 });
    this.ref('id');
  };

  var highlightClass = 'open-glossary';

  document.body.addEventListener('click', toggleGlossary);

  data.load('./data/terms.js');

  emitter.on('terms:loaded', function (terms) {

    var words = [];
    terms.forEach( function (term) {
      words.push(term.name);
    });

    glossary.init({
      terms: terms,
      containerClass: '.glossary-container',
      lunrIndex: lunrIndex
    });

    highlighter.init({
      words: words,
      content: document.querySelector('.content'),
      class: highlightClass
    });

  });

  function toggleGlossary(e) {
    if (dom.hasClass(e.target, highlightClass)) {
      glossary.setValue(e.target.textContent);
      glossary.show();
    }
  }

})();
