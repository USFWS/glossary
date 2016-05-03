# Off-Canvas Glossary

This glossary supplements the [U.S. Fish and Wildlife Service Southeast Regional website](http://fws.gov/southeast).  The goal of this glossary is to provide definitions to terms that may be unclear to our users. We are focused on writing content in plain language, but terms associated with Rules and Regulations may be foreign to our users.  This glossary is intended to work with [fws-highlighter](https://github.com/USFWS/fws-highlighter), which also takes a list of terms, finds them within a given DOM node, wraps them in an element and applies a class.  This is a useful way to provide hooks for JavaScript to toggle the glossary.

## Options

An html glossary built from an array of JSON documents. The glossary provides full text search using [lunr.js](http://lunrjs.com/).

- **active** (boolean): Whether or not the glossary is active upon initialization  *default: `false`*
- **activeClass** (string): The class that is added to the container when the glossary is active  *default: `active`*
- **minLength** (integer): The minimum number of characters required before search is triggered *default: `2`*
- **position** (string): The side of the screen the glossary transitions to as it is hidden `'right'` or `'left'` *default: `'right'`*
- **target** (DOM node): Where do you want the glossary appended to? *default: `document.body`*
- **terms** (array): An array of JSON documents representing glossary terms that will be the basis of our search functionality
- **toggleClass** (string): *default: `'glossary-toggle'`*
- **containerClass** (css selector): *default: `'.glossary-container'`*

## Example

```javascript
(function () {
  'use strict';

  var glossary = require('glossary');
  var xhr = require('xhr');

  loadData('./path-to-data.json');

  function loadData(path) {
    xhr.get(path, function (err, res) {
      if (err) console.error(err);
      var terms = JSON.parse(res.body)
      init(terms);
    });
  }

  function init(terms) {
    glossary.init({
      terms: terms,
      container: '.glossary-container',
      lunrIndex: function () {
        this.field('name', { boost: 10 });
        this.field('description');
        this.field('related', { boost: 5 });
        this.field('acronym', { boost: 3 });
        this.ref('id');
      }
    });
  }

})();
```

### Development

To ease development we use [npm scripts](https://docs.npmjs.com/misc/scripts) to compile JS with browserify/watchify, compile sass to css, optimize images, etc:

First, install the project dependencies:

`npm install`

Run watchify, which will recompile javascript on each file change

`npm start`

To build a production ready version of the app use:

`npm run build`

To visualize packages contributing to bundle file size:

`npm run inspect:bundle`

Run the tests! (WIP)

`npm test`

### License

This project is a [U.S. Government work](https://www.usa.gov/government-works).

The United States Fish and Wildlife Service (FWS) GitHub project code is provided on an "as is" basis and the user assumes responsibility for its use. FWS has relinquished control of the information and no longer has responsibility to protect the integrity, confidentiality, or availability of the information. Any reference to specific commercial products, processes, or services by service mark, trademark, manufacturer, or otherwise, does not constitute or imply their endorsement, recommendation or favoring by FWS. The FWS seal and logo shall not be used in any manner to imply endorsement of any commercial product or activity by FWS or the United States Government.
