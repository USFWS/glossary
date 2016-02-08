(function () {
  'use strict';

  var lunr = require('lunr');

  var _ = require('./util')._;
  var dom = require('./util').dom;
  var emitter = require('./mediator');
  var template = require('../templates/term.jade');

  var options = {}, index;
  var defaults = {
    active: false,
    target: document.body,
    position: 'right',
    terms: [],
    minLength: 2
  };

  function init(opts) {
    options = _.defaults(opts, defaults);
    createGlossary();
    createIndex();
    registerHandlers();
    render(options.terms);
  }

  function createGlossary() {
    if (!_.isNode(options.target))
      throw new Error('You provided an invalid DOM node to append the container.');

    options.container = dom.create('aside', 'glossary-container', options.target);
    options.input = dom.create('input', 'glossary-search', options.container);
    options.list = dom.create('ol', 'glossary-list', options.container);
    options.target.appendChild(options.container);
  }

  function createIndex() {
    index = lunr(options.lunrIndex);
    options.terms.forEach(function (term, i) {
      index.add({
        id: i,
        name: term.name,
        description: term.description,
        related: JSON.stringify(term.related)
      });
    });
  }

  function registerHandlers() {
    options.input.addEventListener('keyup', searchKeyup);
  }

  function destroy() {
    // Remove the glossary and all event listeners from the page
    options.input.removeEventListener('keyup', searchKeyup);
    dom.remove(options.container);
  }

  function render(terms) {
    options.list.innerHTML = template({
      terms: terms
    });
  }

  function searchKeyup() {
    var value = options.input.value;
    var filtered = [];

    if (value.length === 0) render(options.terms);
    if (value.length < options.minLength) return;

    search(value).forEach(function(hit) {
      filtered.push(options.terms[hit.ref]);
    });
    render(filtered);
  }

  function search(query) {
    return index.search(query);
  }

  function isActive() {
    return options.active;
  }

  function getOption(name) {
    if (options[name]) return options[name];
    else throw new Error('Option [' + name + '] does not exist');
  }

  exports.init = init;
  exports.isActive = isActive;
  exports.destroy = destroy;

  exports.getOption = getOption;
})();
