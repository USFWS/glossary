// Adapted from: https://github.com/knownasilya/jquery-highlight
(function () {
  'use strict';

  var _ = require('./util')._;

  var options;

  var defaults = {
    content: document.body,
    class: 'highlight',
    tag: 'span',
    skipTags: new RegExp("^(?:|H1|H2|H3|H4|H5|H6|SCRIPT|FORM|STYLE)$"),
    caseSensitive: false,
    wordsOnly: false,
    wordsBoundary: '\\b'
  };

  function init(opts) {
    options = _.defaults(opts, defaults);
    if ( !_.isArray(opts.words) )
      throw new Error('You must provide an array of terms to highlight.');
    buildRegEx();
    highlight(options.content, options.regex, options.tag, options.class);
  }

  function buildRegEx() {
    options.words = options.words.filter( function(word){
      return word !== '';
    });

    options.words = options.words.map( function(word) {
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    });

    var flag = options.caseSensitive ? '' : 'i';
    // The capture parenthesis will make sure we can match only the matching word
    var pattern = '(' + options.words.join('|') + ')';
    if (options.wordsOnly) {
       pattern = options.wordsBoundary + pattern + options.wordsBoundary;
    }
    options.regex = new RegExp(pattern, flag);
  }

  // recursively apply word highlighting
  function highlight(node, re, nodeName, className) {
    if (node.nodeType === 3) {
      var match = node.data.match(re);
      if (match) {
        // The new highlight Element Node
        var highlightedTerm = document.createElement(options.tag);
        highlightedTerm.className = options.class;
        // Note that we use the captured value to find the real index
        // of the match. This is because we do not want to include the matching word boundaries
        var capturePos = node.data.indexOf( match[1] , match.index );

        // Split the node and replace the matching wordnode
        // with the highlighted node
        var wordNode = node.splitText(capturePos);
        wordNode.splitText(match[1].length);

        var wordClone = wordNode.cloneNode(true);
        highlightedTerm.appendChild(wordClone);
        wordNode.parentNode.replaceChild(highlightedTerm, wordNode);
        return 1; //skip added node in parent
      }
    } else if ( (node.nodeType === 1 && node.childNodes) && // only element nodes that have children
      !/(script|style|form)/i.test(node.tagName) && // ignore script, style, and form nodes
      !(node.tagName === nodeName.toUpperCase() && node.className === options.class)) { // skip if already highlighted
      for (var i = 0; i < node.childNodes.length; i++) {
        i += highlight(node.childNodes[i], re, nodeName, className);
      }
    }
    return 0;
  }

  function unhighlight() {
    var highlightedTerms = document.querySelectorAll('.' + options.class);

    _.each(highlightedTerms, function (term) {
      var parent = term.parentNode;
      parent.replaceChild(term.firstChild, term);
      parent.normalize();
    });
  }

  module.exports.init = init;
  module.exports.highlight = highlight;
  module.exports.unhighlight = unhighlight;
})();
