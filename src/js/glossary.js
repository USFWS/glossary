(function () {
  'use strict';
  var _ = require('./util')._;
  var dom = require('./util').dom;
  var emitter = require('./mediator');
  var template = require('../templates/term.jade');

  var options = {};
  var defaults = {
    active: false,
    target: document.body,
    position: 'right',
    terms: []
  };

  function init(opts) {
    options = _.defaults(opts, defaults);
    createGlossary();
    registerHandlers();
    render();
  }

  function createGlossary() {
    if (!_.isNode(options.target))
      throw new Error('You provided an invalid DOM node to append the container.');

    options.container = dom.create('aside', '.glossary-container', options.target);
    options.input = dom.create('input', '.glossary-search', options.container);
    options.list = dom.create('ol', '.glossary-list', options.container);

    options.target.appendChild(options.container);
  }

  function registerHandlers() {
  }

  function render() {
    options.list.innerHTML = template({
      terms: options.terms
    });
  }

  function isActive() {
    return options.active;
  }

  function remove() {
    // Remove the glossary and all event listeners from the page
    dom.remove(options.container);
  }

  function getOption(name) {
    if (options[name]) return options[name];
    else throw new Error('Option does not exist');
  }

  exports.init = init;
  exports.isActive = isActive;
  exports.remove = remove;

  exports.getOption = getOption;
})();
