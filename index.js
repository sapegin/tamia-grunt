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

	require('load-grunt-tasks')(grunt);

	var util = {};
	var requires = {};
	var modules;

	util.npmRequire = function(module) {
		try {
			return require(npmModulePath(module));
		}
		catch(e) {
			util.npmInstall(module);
		}
	};

	util.npmInstall = function(modules) {
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
	};

	util.npmDependencies = function(modules) {
		modules.forEach(function(module) {
			requires[module] = true;
		});
	};

	util.requireBanner = function() {
		config.banner = '/*! Author: <%= tamia.author %>, <%= grunt.template.today("yyyy") %> */\n';
	};

	/**
	 * Project has scripts.
	 *
	 * @return {Boolean}
	 */
	util.hasScripts = _.memoize(function() {
		return grunt.file.exists('js/main.js');
	});

	/**
	 * Project has styles.
	 *
	 * @return {Boolean}
	 */
	util.hasStyles = _.memoize(function() {
		return grunt.file.exists('styles/index.styl');
	});

	/**
	 * Appends Modernizr task once (for either styles or scripts).
	 *
	 * @param {Array} tasks Tasks list.
	 * @return {Array}
	 */
	var modernizrAdded = false;
	util.appendModernizr = function(tasks) {
		if (!modernizrAdded) {
			tasks.push('modernizr');
			modernizrAdded = true;
		}
		return tasks;
	};

	function npmModulePath(module) {
		return path.join(process.cwd(), 'node_modules', module);
	}

	function main() {
		// Modules
		modules = glob.sync(__dirname + '/modules/*.js');
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
	}

	// Run
	main();

};

