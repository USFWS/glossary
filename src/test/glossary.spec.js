/*jshint expr: true*/
(function () {
  'use strict';

  var expect = require('chai').expect;
  var dom = require('../js/util').dom;

  var glossary = require('../js/glossary.js');
  var terms = require('./mocks/terms.json');

  var container, activeClass, toggleButton, toggleClass;

  var lunrIndex = function () {
    this.field('name', { boost: 10 });
    this.field('description');
    this.field('related', { boost: 5 });
    this.field('acronym', { boost: 3 });
    this.ref('id');
  };

  describe('The glossary', function() {

    afterEach( function () {
      glossary.destroy();
    });

    describe('upon initialization with default options', function () {

      beforeEach( function () {
        glossary.init({
          terms: terms,
          lunrIndex: lunrIndex
        });
        container = glossary.getOption('container');
        activeClass = glossary.getOption('activeClass');
        toggleButton = glossary.getOption('close');
      });

      it('should be inactive', function () {
        expect(dom.hasClass(container, activeClass)).to.be.false;
      });

      it('should render one list item per term', function () {
        var listItems = glossary.getOption('list').querySelectorAll('.glossary-term');
        expect(terms.length).to.equal(listItems.length);
      });

      it('toggle button should add the activeClass if it is not already in the container\'s class list', function () {
        toggleButton.click();
        expect(dom.hasClass(container, activeClass)).to.be.true;
      });

      it('toggle button should remove the activeClass if it is already in the container\'s class list', function () {
        glossary.show(); // Adds the active class
        toggleButton.click(); // Removes the active class
        console.log(dom.hasClass(container, activeClass));
        expect(dom.hasClass(container, activeClass)).to.be.false;
      });

    });

    describe('upon initialization with custom options', function () {
      var customTarget = dom.create('section', 'container', document.body);

      beforeEach( function () {
        glossary.init({
          terms: terms,
          lunrIndex: lunrIndex,
          target: '.container',
          active: true,
          activeClass: 'visible',
          position: 'left',
          toggleClass: 'toggle-glossary'
        });
        container = glossary.getOption('container');
        activeClass = glossary.getOption('activeClass');
        toggleClass = glossary.getOption('toggleClass');
      });

      it('should accept a CSS selector as a target to append the glossary container', function () {
        // querySelector returns null if it doesn't find anything.
        expect(customTarget.querySelector('.glossary-container')).to.not.equal.null;
      });

      it('should be active', function () {
        expect(glossary.getOption('active')).to.be.true;
      });

      it('should use the custom activeClass', function () {
        expect(dom.hasClass(container, activeClass)).to.be.true;
      });

      it('should be have the \'glossary-left\' class', function () {
        expect(dom.hasClass(container, 'glossary-left')).to.be.true;
      });

      it('a button with custom toggleClass should toggle the glossary', function () {
        var toggle = dom.create('button', toggleClass, document.body);
        // Glossary is active upon init
        expect(dom.hasClass(container, activeClass)).to.be.true;
        toggle.click(); // click a button w/toggle class should close the glossary
        expect(dom.hasClass(container, activeClass)).to.be.false;
      });
    });

    // xdescribe('search', function () {
    //   beforeEach( function () {
    //     glossary.init({
    //       terms: terms,
    //       lunrIndex: lunrIndex,
    //       target: '.container',
    //       active: true,
    //       activeClass: 'visible',
    //       position: 'left',
    //       toggleClass: 'toggle-glossary'
    //     });
    //   });
    //
    //   it('should filter the glossary terms based on the input', function () {
    //     var list, listItems;
    //     glossary.setValue('Recovery');
    //     list = glossary.getOption('list');
    //     listItems = glossary.getOption('list').querySelectorAll('.glossary-term');
    //     expect(listItems.length).to.equal(1);
    //   });
    // });

  });
})();
