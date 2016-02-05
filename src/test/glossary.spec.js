/*jshint expr: true*/
(function () {
  'use strict';

  var expect = require('chai').expect;

  var glossary = require('../js/glossary.js');
  var terms = require('./mocks/terms.json');

  describe('The glossary', function() {

    beforeEach(function () {
      glossary.init({
        terms: terms,
        lunrIndex: function () {
          this.field('name', { boost: 10 });
          this.field('description');
          this.field('related', { boost: 5 });
          this.field('acronym', { boost: 3 });
          this.ref('id');
        }
      });
    });

    afterEach(function () {
      glossary.remove();
    });

    describe('upon initialization', function () {

      it('should be inactive', function () {
        expect(glossary.isActive()).to.be.false;
      });

      it('should render one list item per term', function () {
        var listItems = glossary.getOption('list').querySelectorAll('.glossary-term');
        expect(terms.length).to.equal(listItems.length);
      });

    });
  });
})();
