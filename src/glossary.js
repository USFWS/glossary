(function () {
  'use strict';

  var lunr = require('lunr');

  var _ = require('./util');
  var template = require('./templates/term.jade');

  var options = {}, index;
  var defaults = {
    active: false,
    activeClass: 'active',
    target: document.body,
    toggleClass: 'glossary-toggle',
    containerClass: 'glossary-container',
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
    if (typeof options.target === 'string')
      options.target = document.querySelector(options.target);
    else if (!_.isNode(options.target))
      throw new Error('You must provide a DOM node or CSS selector to append the container');

    options.container = _.create('aside', options.containerClass, options.target);
    _.addClass(options.container, position);
    options.input = _.create('input', 'glossary-search', options.container);
    options.close = _.create('button', options.toggleClass, options.container);
    options.close.innerHTML = options.closeText;
    options.list = _.create('ol', 'glossary-list', options.container);
    options.target.appendChild(options.container);
    if (options.active) show();
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
    document.body.addEventListener('keyup', keyup);
  }

  function destroy() {
    // Remove the glossary and all event listeners from the page
    options.input.removeEventListener('keyup', searchKeyup);
    options.list.removeEventListener('click', updateInput);
    document.body.removeEventListener('click', toggleGlossary);
    document.body.removeEventListener('keyup', keyup);
    _.remove(options.container);
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

    if (query.length === 0) render(options.terms);
    if (query.length < options.minLength) return;

    render(search(query));
  }

  function toggleGlossary(e) {
    var isGlossaryTrigger = _.hasClass(e.target, options.toggleClass);
    if (isGlossaryTrigger) {
      setValue(e.target.textContent);
      toggle();
    }
  }

  function updateInput(e) {
    var isRelatedTerm = _.hasClass(e.target, 'related-term');
    var query = e.target.innerHTML;

    if (isRelatedTerm) {
      options.input.value = query;
      render(search(query));
    }
  }

  function keyup (e) {
    // Close the glossary on 'ESC'
    var code = e.which || e.keyCode || 0;
    if (code === 27) hide();
  }

  function show() {
    options.active = true;
    _.addClass(options.container, options.activeClass);
  }

  function hide() {
    options.active = false;
    _.removeClass(options.container, options.activeClass);
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
  function getOption(name) {
    if (options[name]) return options[name];
    else throw new Error('Option [' + name + '] does not exist');
  }

  exports._getOption = getOption;
})();
