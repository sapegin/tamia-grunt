/**
 * Tâmia workflow for Grunt.
 * Modernizr builder.
 *
 * @author Artem Sapegin (http://sapegin.me)
 */

module.exports = function(grunt, util, config) {
	'use strict';

	var _ = require('lodash');

	if ((!util.hasScripts() && !util.hasStyles()) || config.tamia.modernizr === false) {
		util.skipModule();
		return config;
	}

	util.setupDirs({
		destParam: 'scriptsDest',
		destDir: 'build'
	});

	var localConfig = {
		modernizr: {
			main: {
				devFile: 'remote',
				outputFile: util.dest('modernizr.js'),
				extra: {
					load: false,
					shiv: false
				},
				files: {
					src: [
						util.src('tamia/**/*.js')
					]
				}
			}
		}
	};

	var src = localConfig.modernizr.main.files.src;
	if (util.hasScripts()) {
		src.push(util.src('js/**/*.js'));
	}
	if (util.hasStyles()) {
		src.push(util.dest('styles.css'));
	}

	config = _.merge(localConfig, config);

	util.npmDependencies([
		'grunt-modernizr'
	]);

	return config;
};
