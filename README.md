# Off-Canvas Glossary

This glossary supplements the [U.S. Fish and Wildlife Service Southeast Regional website](http://fws.gov/southeast).  The goal of this glossary is to provide definitions to terms that may be unclear to our users. We are focused on writing content in plain language, but terms associated with Rules and Regulations may be foreign to our users.  This glossary automatically searches the current page for glossary terms, highlights them, and makes them clickable.  Clicking a term will summon the glossary from off-screen.  You can find related terms and when you're done reading the definition you can return to your place on the page.

The glossary is broken down into three main modules: (1) data access, (2) glossary, (3) highlighter. A fourth module `mediator` is used to facilitate events between modules.

## Options

### Data Access

This module that acts as a data service layer.  It downloads glossary terms via [XHR](https://www.npmjs.com/package/xhr) so the terms can be cached and makes them available to other modules through the `terms:loaded` event.

- **url** (string): a valid url for the location of a JSON file containing glossary terms e.x: `'../data/terms.json'`

### Glossary

An html glossary built from an array of JSON documents. The glossary provides full text search using [lunr.js](http://lunrjs.com/).

- **active** (boolean): Whether or not the glossary is active upon initialization  *default: `false`*
- **activeClass** (string): The class that is added to the container when the glossary is active  *default: `active`*
- **minLength** (integer): The minimum number of characters required before search is triggered *default: `2`*
- **position** (string): The side of the screen the glossary transitions to as it is hidden `'right'` or `'left'` *default: `'right'`*
- **target** (DOM node): Where do you want the glossary appended to? *default: `document.body`*
- **terms** (array): An array of JSON documents representing glossary terms that will be the basis of our search functionality
- **toggleClass** (string): *default: `'glossary-toggle'`*

### Highlighter

This module searches a given DOM node and it's children for glossary terms.  The module wraps terms in an element with a class so they can be styled and used to toggle the glossary

- **content** (string/dom node): The content area that you'd like to search for glossary terms. *default: `document.body`*
- **terms** (array): An array of strings representing the words you'd like to highlight
- **tag** (string): The type of element you would like to wrap the found term with *default: `span`*
- **class** (string): The class used to highlight any terms found on the page. *default: `'highlight'`*,
- **skipTags** (regex): A regular expression of tags to exclude from highlighting *default: `new RegExp("^(?:|H1|H2|H3|H4|H5|H6|SCRIPT|FORM|STYLE)$")`*
- **caseSensitive** (boolean): Should the *default: `false`*,
- **wordsOnly** (boolean): If we want to highlight partial sections of a word, e.g. 'ca' from 'cat' *default: `false`*,
- **wordsBoundary** (string): Part of a regular expression to be appended at the beginning and end of words *default: `'\\b'`*

## Example

```javascript
(function () {
  'use strict';

  var glossary = require('./glossary');
  var highlighter = require('./highlighter');
  var data = require('./get-terms');
  var emitter = require('./mediator');

  data.load({
    url: '../data/terms.json'
  });

  emitter.on('terms:loaded', function (terms) {
    glossary.init({
      appendStyle: 'appendTo',
      target: '.glossary-list'
    });

    highlighter.highlight({
      data: terms,
      content: '',
      element: 'span',
      class: 'highlighted-term'
    });
  })
})();
```

### Development

To ease development we use npm scripts to compile JS with browserify/watchify, compile sass to css, optimize images, etc:

First, install the project dependencies:

`npm install`

To kick off the development server and all pre-requisite tasks:

`npm start`

To build a production ready version of the app use:

`npm run build`

To publish a production ready demo to GitHub Pages:

`npm run publish:demo`

To visualize packages contributing to bundle file size:

`npm run inspect:bundle`

License

This project is a [U.S. Government work](https://www.usa.gov/government-works).

The United States Fish and Wildlife Service (FWS) GitHub project code is provided on an "as is" basis and the user assumes responsibility for its use. FWS has relinquished control of the information and no longer has responsibility to protect the integrity, confidentiality, or availability of the information. Any reference to specific commercial products, processes, or services by service mark, trademark, manufacturer, or otherwise, does not constitute or imply their endorsement, recommendation or favoring by FWS. The FWS seal and logo shall not be used in any manner to imply endorsement of any commercial product or activity by FWS or the United States Government.
