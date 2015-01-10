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

	/**
	 * Tries to require an npm module. Asks user to install module if it cannot be required.
	 *
	 * @param {String} module Module name.
	 * @return {Object}
	 */
	util.npmRequire = function(module) {
		try {
			return require(npmModulePath(module));
		}
		catch(e) {
			util.npmInstall(module);
		}
	};

	/**
	 * Asks user to install npm modules if they cannot be required.
	 *
	 * @param {Array} modules Modules names.
	 */
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

	/**
	 * Adds list of npm modules to requirements list.
	 *
	 * @param {Array} modules Modules names.
	 */
	util.npmDependencies = function(modules) {
		modules.forEach(function(module) {
			requires[module] = true;
		});
	};

	/**
	 * Checks existence of a value in config.
	 *
	 * @param {String} configPath Path (eg. `tamia.author`).
	 * @return {Boolean}
	 */
	util.requireConfig = function(configPath) {
		var parts = configPath.split('.');
		var current = config;
		_.each(parts, function(part) {
			if (!(part in current)) {
				grunt.fail.fatal('Gruntfile should contain "' + configPath + '".');
				return false;
			}
			current = current[part];
		});
		return true;
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

	/**
	 * Returns glob mask for specified file extensions.
	 *
	 * @param {String} exts Extensions (`jpg,png`).
	 * @param {String} [dir] Directory.
	 * @return {String}
	 */
	util.globMask = function(exts, dir) {
		if (exts.indexOf(',') !== -1) {
			exts = '{' + exts + '}';
		}
		var mask = '*.' + exts;
		if (dir) {
			return path.join(dir, mask);
		}
		else {
			return mask;
		}
	};

	function npmModulePath(module) {
		return path.join(process.cwd(), 'node_modules', module);
	}

	function main() {
		// Banner
		util.requireConfig('tamia.author');
		config.banner = '/*! Author: <%= tamia.author %>, <%= grunt.template.today("yyyy") %> */\n';

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
