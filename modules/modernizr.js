/**
 * Tâmia workflow for Grunt.
 * Modernizr builder.
 *
 * @author Artem Sapegin (http://sapegin.me)
 */

module.exports = function(grunt, util, config) {
	'use strict';

	var _ = require('lodash');

	if (!util.hasScripts() && !util.hasStyles()) return config;

	var localConfig = {
		modernizr: {
			main: {
				devFile: 'remote',
				outputFile: 'build/modernizr.js',
				extra: {
					load: false
				},
				files: {
					src: []
				}
			}
		}
	};

	var src = localConfig.modernizr.main.files.src;
	if (util.hasScripts()) {
		src.push('build/scripts.js');
	}
	if (util.hasStyles()) {
		src.push('build/styles.css');
	}

	config = _.merge(localConfig, config);

	util.npmDependencies([
		'grunt-modernizr'
	]);

	return config;
};