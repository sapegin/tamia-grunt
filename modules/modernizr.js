/**
 * Tâmia workflow for Grunt.
 * Modernizr builder.
 *
 * @author Artem Sapegin (http://sapegin.me)
 */

module.exports = function(grunt, util, config) {
	'use strict';

	var path = require('path');
	var _ = require('lodash');

	if (!util.hasScripts() && !util.hasStyles()) return config;

	var destDir = util.destDir('scriptsDest', 'build');

	var localConfig = {
		modernizr: {
			main: {
				devFile: 'remote',
				outputFile: path.join(destDir, 'modernizr.js'),
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
		src.push(path.join(destDir, 'scripts.js'));
	}
	if (util.hasStyles()) {
		src.push(path.join(destDir, 'styles.css'));
	}

	config = _.merge(localConfig, config);

	util.npmDependencies([
		'grunt-modernizr'
	]);

	return config;
};
