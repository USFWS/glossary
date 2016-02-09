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
    toggleClass: 'glossary-toggle',
    closeText: 'Close',
    position: 'right',
    terms: [],
    minLength: 2
  };

  function init(opts) {
    options = _.defaults(opts, defaults);
    createGlossary();
    createSearchIndex();
    registerHandlers();
    render(options.terms);
  }

  function createGlossary() {
    var position = 'glossary-' + options.position;
    if (!_.isNode(options.target))
      throw new Error('You provided an invalid DOM node to append the container.');

    options.container = dom.create('aside', 'glossary-container', options.target);
    dom.addClass(options.container, position);
    options.input = dom.create('input', 'glossary-search', options.container);
    options.close = dom.create('button', options.toggleClass, options.container);
    options.close.innerHTML = options.closeText;
    options.list = dom.create('ol', 'glossary-list', options.container);
    options.target.appendChild(options.container);
  }

  function createSearchIndex() {
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
    options.list.addEventListener('click', updateInput);
    document.body.addEventListener('click', toggleGlossary);
  }

  function destroy() {
    // Remove the glossary and all event listeners from the page
    options.input.removeEventListener('keyup', searchKeyup);
    options.list.removeEventListener('click', updateInput);
    document.body.removeEventListener('click', toggleGlossary);
    dom.remove(options.container);
  }

  function render(terms) {
    options.list.innerHTML = template({
      terms: terms
    });
  }

  function search(query) {
    var filtered = [];

    index.search(query).forEach(function (hit) {
      filtered.push(options.terms[hit.ref]);
    });

    return filtered;
  }

  function searchKeyup() {
    var query = options.input.value;
    var filtered;

    if (query.length === 0) render(options.terms);
    if (query.length < options.minLength) return;

    render(search(query));
  }

  function toggleGlossary(e) {
    var isGlossaryTrigger = dom.hasClass(e.target, options.toggleClass);
    if (isGlossaryTrigger) toggle();
  }

  function updateInput(e) {
    var isRelatedTerm = dom.hasClass(e.target, 'related-term');
    var query = e.target.innerHTML;

    if (isRelatedTerm) {
      options.input.value = query;
      render(search(query));
    }
  }

  function getOption(name) {
    if (options[name]) return options[name];
    else throw new Error('Option [' + name + '] does not exist');
  }

  function show() {
    options.active = true;
    dom.addClass(options.container, 'active');
  }

  function hide() {
    options.active = false;
    dom.removeClass(options.container, 'active');
  }

  function toggle() {
    options.active ? hide() : show(); // jshint ignore:line
  }

  function setValue(newValue) {
    options.input.value = newValue;
    render(search(newValue));
  }

  exports.init = init;
  exports.destroy = destroy;
  exports.show = show;
  exports.hide = hide;
  exports.toggle = toggle;
  exports.setValue = setValue;

  // For testing
  exports.getOption = getOption;
})();
