/*jshint expr: true*/
(function () {
  'use strict';

  var expect = require('chai').expect;
  var dom = require('../js/util').dom;

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
      glossary.destroy();
    });

    describe('upon initialization', function () {

      it('should be inactive', function () {
        var container = glossary.getOption('container');
        var isActive = dom.hasClass(container, 'active');
        expect(isActive).to.be.false;
      });

      it('should render one list item per term', function () {
        var listItems = glossary.getOption('list').querySelectorAll('.glossary-term');
        expect(terms.length).to.equal(listItems.length);
      });

    });

    describe('trigger buttons should manage the active class', function () {

      it('add \'active\' class if it is not already in the container\'s class list', function () {
        var container = glossary.getOption('container');
        var toggleButton = glossary.getOption('toggle').click();
        var isActive = dom.hasClass(container, 'active');
        expect(isActive).to.be.true;
      });

      it('remove \'active\' class if it is already in the container\'s class list', function () {
        var container = glossary.getOption('container');
        var toggleButton = glossary.getOption('toggle');
        toggleButton.click(); // Click one makes the glossary active
        toggleButton.click(); // Click two makes the glossary in-active
        var isActive = dom.hasClass(container, 'active');
        expect(isActive).to.be.false;
      });

    });

  });
})();
