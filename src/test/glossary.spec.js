/*jshint expr: true*/
(function () {
  'use strict';

  var expect = require('chai').expect;
  var glossary = require('../js/glossary.js');

  describe('The glossary', function() {
    it('should be inactive when it initializes', function () {
      glossary.init();
      expect(glossary.isActive()).to.be.false;
    });
  });
})();
