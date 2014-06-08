# Tâmia Grunt

[![Build Status](https://travis-ci.org/sapegin/tamia-grunt.png)](https://travis-ci.org/sapegin/tamia-grunt)

[Tâmia](http://sapegin.github.io/tamia/) workflow for Grunt.


## Installation

```
npm install --save-dev tamia-grunt
```


## Example

```js
module.exports = function(grunt) {
	'use strict';

	require('tamia-grunt')(grunt, {
		tamia: {
			author: 'Artem Sapegin, http://sapegin.me'
		},
		concat: {
			nonull: true,
			main: {
				src: [
					'<%= bower_concat.main.dest %>',
					'tamia/vendor/*.js',
					'tamia/tamia/tamia.js',
					'tamia/tamia/component.js',
					'tamia/modules/form/script.js',
					'js/components/*.js',
					'js/main.js'
				],
				dest: 'build/scripts.js'
			}
		},
		// All other Grunt plugins
	});

	grunt.registerTask('default', ['stylus', 'scripts']);
};
```


## Changelog

The changelog can be found in the [Changelog.md](Changelog.md) file.

## Author

* [Artem Sapegin](http://sapegin.me/)

---

## License

The MIT License, see the included [License.md](License.md) file.
