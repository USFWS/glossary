/*jshint expr: true*/
(function () {
  'use strict';

  var expect = require('chai').expect;
  var dom = require('../js/util').dom;

  var glossary = require('../js/glossary.js');
  var terms = require('./mocks/terms.json');

  var lunrIndex = function () {
    this.field('name', { boost: 10 });
    this.field('description');
    this.field('related', { boost: 5 });
    this.field('acronym', { boost: 3 });
    this.ref('id');
  };

  describe('The glossary', function() {
    var container, activeClass, toggleButton, toggleClass;

    afterEach( function () {
      glossary.destroy();
    });

    describe('upon initialization with default options', function () {

      beforeEach( function () {
        glossary.init({
          terms: terms,
          lunrIndex: lunrIndex
        });
        container = glossary._getOption('container');
        activeClass = glossary._getOption('activeClass');
      });

      it('should be inactive', function () {
        expect(dom.hasClass(container, activeClass)).to.be.false;
      });

      it('should render one list item per term', function () {
        var listItems = glossary._getOption('list').querySelectorAll('.glossary-term');
        expect(terms.length).to.equal(listItems.length);
      });

    });

    describe('upon initialization with custom options', function () {

      it('should accept a CSS selector as a target to append the glossary container', function () {
        var customTargetClass = 'custom-target';
        var customTarget = dom.create('section', customTargetClass, document.body);
        glossary.init({
          terms: terms,
          lunrIndex: lunrIndex,
          target: '.' + customTargetClass
        });
        container = glossary._getOption('container');
        expect(dom.hasClass(container.parentNode, customTargetClass)).to.be.true;
        dom.remove(customTarget);
      });

      it('should be active', function () {
        glossary.init({
          terms: terms,
          lunrIndex: lunrIndex,
          active: true
        });
        container = glossary._getOption('container');
        activeClass = glossary._getOption('activeClass');
        expect(dom.hasClass(container, activeClass)).to.be.true;
      });

      it('should use the custom activeClass', function () {
        var activeClass = 'visible';
        glossary.init({
          terms: terms,
          lunrIndex: lunrIndex,
          activeClass: activeClass,
          active: true
        });
        container = glossary._getOption('container');
        expect(dom.hasClass(container, activeClass)).to.be.true;
      });

      it('should have the \'glossary-left\' class w/ position:"left"', function () {
        glossary.init({
          terms: terms,
          lunrIndex: lunrIndex,
          position: 'left'
        });
        container = glossary._getOption('container');
        expect(dom.hasClass(container, 'glossary-left')).to.be.true;
      });

    });

    describe('functions controlling display', function () {

      beforeEach( function () {
        glossary.init({
          terms: terms,
          lunrIndex: lunrIndex
        });
        container = glossary._getOption('container');
        activeClass = glossary._getOption('activeClass');
      });

      describe('toggle', function () {

        it('should be a function', function () {
          expect(glossary.toggle).to.be.a.function;
        });

        it('should remove the active class if it is present', function () {
          expect(dom.hasClass(container, activeClass)).to.be.false;
          glossary.toggle();
          expect(dom.hasClass(container, activeClass)).to.be.true;
        });

        it('should add the active class if it is not present', function () {
          glossary.show();
          expect(dom.hasClass(container, activeClass)).to.be.true;
          glossary.toggle();
          expect(dom.hasClass(container, activeClass)).to.be.false;
        });

        it('should toggle the glossary when an element with the toggle class is clicked', function () {
          var toggleClass = glossary._getOption('toggleClass');
          var toggle = dom.create('button', toggleClass, document.body);
          toggle.click();
          expect(dom.hasClass(container, activeClass)).to.be.true;
          dom.remove(toggle);
        });
      });

      describe('show', function () {

        it('should be a function', function () {
          expect(glossary.show).to.be.a.function;
        });

        it('should add the activeClass to the container', function () {
          glossary.show();
          expect(dom.hasClass(container, activeClass)).to.be.true;
        });
      });

      describe('hide', function () {

        it('should be a function', function () {
          expect(glossary.hide).to.be.a.function;
        });

        it('should remove the activeClass from the container', function () {
          glossary.hide();
          expect(dom.hasClass(container, activeClass)).to.be.false;
        });
      });
    });

    describe('search input', function () {
      var input;

      beforeEach( function () {
        glossary.init({
          terms: terms,
          lunrIndex: lunrIndex,
        });
         input = glossary._getOption('input');
      });

      it('should be empty to start', function () {
        expect(input.value).to.equal('');
      });

      it('setValue should be a function', function () {
        expect(glossary.setValue).to.be.a.function;
      });

      it('should equal the value passed into setValue', function () {
        var newValue = 'Winning';
        glossary.setValue(newValue);
        expect(input.value).to.equal(newValue);
      });

      it('should update the input value when user clicks on a related term', function () {
        var relatedText = 'Related Term';
        var list = glossary._getOption('list'); // event listener is on the list
        var related = dom.create('span', 'related-term', list);
        related.innerHTML = relatedText;
        related.click();
        expect(input.value).to.equal(relatedText);
      });

    });

  });
})();
