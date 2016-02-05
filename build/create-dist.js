(function () {
  'use strict';

  var mkdirp = require('mkdirp');

  var directories = ['dist/js', 'dist/data', 'dist/css'];

  directories.forEach(function (path) {
    mkdirp(path, function (err) {
      if (err) console.error(err);
    });
  });
})();
