(function () {
  'use strict';

  module.exports =  {
    defaults: require('lodash.defaults'),
    isArray: require('lodash.isArray'),
    isNode: require('is-dom'),

    create: function (tagName, className, container) {

			var el = document.createElement(tagName);
			el.className = className;

			if (container) container.appendChild(el);
			return el;
		},

		remove: function (el) {
			var parent = el.parentNode;
			if (parent) parent.removeChild(el);
		},

    hasClass: function (el, name) {
			if (el.classList !== undefined) {
				return el.classList.contains(name);
			}
			var className = this.getClass(el);
			return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
		},

    addClass: function (el, name) {
			if (el.classList !== undefined) {
				var classes = this.splitWords(name);
				for (var i = 0, len = classes.length; i < len; i++) {
					el.classList.add(classes[i]);
				}
			} else if (!this.hasClass(el, name)) {
				var className = this.getClass(el);
				this.setClass(el, (className ? className + ' ' : '') + name);
			}
		},

		removeClass: function (el, name) {
			if (el.classList !== undefined) {
				el.classList.remove(name);
			} else {
				this.setClass(el, trim((' ' + this.getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
			}
		},

    setClass: function (el, name) {
			if (el.className.baseVal === undefined) {
				el.className = name;
			} else {
				// in case of SVG element
				el.className.baseVal = name;
			}
		},

    splitWords: function (str) {
			return this.trim(str).split(/\s+/);
		},

		trim: function (str) {
			return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
		},

    getClass: function (el) {
			return el.className.baseVal === undefined ? el.className : el.className.baseVal;
		}

  };

})();
