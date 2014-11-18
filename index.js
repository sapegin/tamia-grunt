/**
 * Tâmia workflow for Grunt.
 *
 * @author Artem Sapegin (http://sapegin.me)
 */

module.exports = function(grunt, config) {
	'use strict';

	var path = require('path');
	var glob = require('glob');
	var _ = require('lodash');
	var copy = require('copy-paste').copy;

	var util = {
		npmRequire: npmRequire,
		npmInstall: npmInstall,
		npmDependencies: npmDependencies,
		requireBanner: requireBanner
	};

	require('load-grunt-tasks')(grunt);

	var requires = {};

	// Modules
	var modules = glob.sync(__dirname + '/modules/*.js');
	modules.forEach(function(module) {
		config = require(module)(grunt, util, config);
	});

	// Watch
	if (config.watch) {
		config = _.merge({
			watch: {
				livereload: {
					options: {
						livereload: true
					},
					files: [
						'build/**/*'
					]
				}
			}
		}, config);
	}

	// Required npm modules
	util.npmInstall(_.keys(requires));

	grunt.verbose.writeln(JSON.stringify(config, null, '  '));

	grunt.config.init(config);


	function npmRequire(module) {
		try {
			return require(npmModulePath(module));
		}
		catch(e) {
			npmInstall(module);
		}
	}

	function npmInstall(modules) {
		if (!_.isArray(modules)) modules = [modules];
		var required = [];
		modules.forEach(function(module) {
			if (!grunt.file.exists(npmModulePath(module))) {
				required.push(module);
			}
		});
		if (required.length) {
			var cmd = 'npm i -D ' + required.join(' ');
			copy(cmd);
			grunt.fail.fatal('Please install npm packages (command copied to your clipboard):\n\n' + cmd);
		}
	}

	function npmModulePath(module) {
		return path.join(process.cwd(), 'node_modules', module);
	}

	function npmDependencies(modules) {
		modules.forEach(function(module) {
			requires[module] = true;
		});
	}

	function requireBanner() {
		config.banner = '/*! Author: <%= tamia.author %>, <%= grunt.template.today("yyyy") %> */\n';
	}

};
