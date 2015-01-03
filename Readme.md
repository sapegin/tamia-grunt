# Tâmia Grunt

[![Build Status](https://travis-ci.org/sapegin/tamia-grunt.png)](https://travis-ci.org/sapegin/tamia-grunt)

[Tâmia](http://sapegin.github.io/tamia/) workflow for Grunt.


## Installation

```
npm install --save-dev tamia-grunt
```


### Notes

The tamia-grunt will check all required Grunt plugins and ask you to install missed ones. It also will load all installed Grunt plugins via [load-grunt-tasks](https://github.com/sindresorhus/load-grunt-tasks).


## Example

```js
module.exports = function(grunt) {
	'use strict';

	require('tamia-grunt')(grunt, {
		tamia: {
			author: 'Artem Sapegin, http://sapegin.me'
		},
		concat: {
			main: {
				nonull: true,
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

	grunt.registerTask('default', ['styles', 'scripts', 'images']);
};
```


## Modules

### Styles

Put your Stylus files into `styles` folder. `styles/index.styl` should exists. Then run `grunt styles`.

Includes:

* [grunt-contrib-stylus](https://github.com/gruntjs/grunt-contrib-stylus).
* [stylobuild](https://github.com/kizu/stylobuild): [Autoprefixer](https://github.com/ai/autoprefixer) + [CleanCSS](https://github.com/jakubpawlowicz/clean-css) wrapper for Stylus.

### Scripts

Put your JavaScript files into `js` folder. `js/main.js` should exists. Add `concat` section to your Gruntfile as in an example above. Then run `grunt scripts`.

Don’t forget to add `.jshintrc` to enable JSHint.

Includes:

* [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint).
* [grunt-contrib-concat](https://github.com/gruntjs/grunt-contrib-concat).
* [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify).
* [grunt-bower-concat](https://github.com/sapegin/grunt-bower-concat).

### Images

Put your images into `images_src` folder. Then run `grunt images`.

Includes:

* [grunt-contrib-imagemin](https://github.com/gruntjs/grunt-contrib-imagemin).
* [grunt-svgmin](https://github.com/sindresorhus/grunt-svgmin).
* [grunt-newer](https://github.com/tschaub/grunt-newer).

### Modernizr

Custom Modernizr build. Will run automatically for either `styles` or `scripts` tasks.

Includes:

* [grunt-modernizr](https://github.com/Modernizr/grunt-modernizr).

### Doctor

Checks project configuration: required dependencies (more later). Run `grunt doctor`.

## Changelog

The changelog can be found in the [Changelog.md](Changelog.md) file.

## Author

* [Artem Sapegin](http://sapegin.me/)

---

## License

The MIT License, see the included [License.md](License.md) file.
