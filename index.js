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
	var prettyjson = require('prettyjson');
	var copy = require('copy-paste').copy;

	require('load-grunt-tasks')(grunt);

	var util = {};
	var requires = {};
	var moduleDirs = {};
	var moduleName;
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
			util.npmPlease('install', required, true);
		}
	};

	/**
	 * Asks to install/update/remove given list of npm modules. Copies shell command to the clipboard.
	 *
	 * @param {String} what Action: install/update/remove.
	 * @param {Array} modules Modules names.
	 */
	util.npmPlease = function(what, modules, fatal) {
		var keys = {
			install: 'i',
			update: 'i',
			remove: 'r'
		};
		var cmd = 'npm ' + keys[what] + ' -D ' + modules.join(' ');
		copy(cmd);
		var message = 'Please ' + what + ' these npm packages (command copied to your clipboard):\n\n' + cmd;
		if (fatal) {
			grunt.fail.fatal(message);
		}
		else {
			grunt.log.writeln(message);
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
		return grunt.file.exists(path.join(util.srcDir('scriptsSrc', 'js'), 'main.js'));
	});

	/**
	 * Project has styles.
	 *
	 * @return {Boolean}
	 */
	util.hasStyles = _.memoize(function() {
		return grunt.file.exists(path.join(util.srcDir('stylesSrc', 'styles'), 'index.styl'));
	});

	/**
	 * Appends Modernizr task once (for either styles or scripts).
	 *
	 * @param {Array} tasks Tasks list.
	 * @return {Array}
	 */
	var modernizrAdded = false;
	util.appendModernizr = function(tasks) {
		if (modernizrAdded || config.tamia.modernizr === false) return tasks;

		tasks.push('modernizr');
		modernizrAdded = true;
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

	/**
	 * Prints a message that current module was skipped (in verbose mode).
	 */
	util.skipModule = function() {
		grunt.verbose.writeln('tamia-grunt: ' + moduleName + ': skipped.');
	};

	/**
	 * Returns source directory.
	 *
	 * @param {String} name Name in `config.tamia`.
	 * @param {String} dir Default folder name.
	 * @return {String}
	 */
	util.srcDir = function(name, dir) {
		return config.tamia[name] || path.join(config.tamia.src, dir);
	};

	/**
	 * Returns destination directory.
	 *
	 * @param {String} name Name in `config.tamia`.
	 * @param {String} dir Default folder name.
	 * @return {String}
	 */
	util.destDir = function(name, dir) {
		return config.tamia[name] || path.join(config.tamia.dest, dir);
	};

	/**
	 * Configures source and destination pathes for a current module.
	 *
	 * @param {Object} params Params.
	 * @param {String} params.srcParam Name in `config.tamia` (source).
	 * @param {String} params.srcDir Default folder name (source).
	 * @param {String} params.destParam Name in `config.tamia` (destination).
	 * @param {String} params.destDir Default folder name (destination).
	 * @return {Object}
	 */
	util.setupDirs = function(params) {
		moduleDirs = {
			src: params.srcParam ? util.srcDir(params.srcParam, params.srcDir) : '',
			dest: params.destParam ? util.destDir(params.destParam, params.destDir) : '',
		};

		grunt.verbose.writeln('tamia-grunt: ' + moduleName + ': ' + (moduleDirs.src || '.') + ' → ' + (moduleDirs.dest || '.') + '.');

		return moduleDirs;
	};

	/**
	 * Returns source path.
	 *
	 * @param {String} mask Path/mask to append to source path.
	 * @return {String}
	 */
	util.src = function(mask) {
		return path.join(moduleDirs.src, mask || '');
	};

	/**
	 * Returns destination path.
	 *
	 * @param {String} mask Path/mask to append to destination path.
	 * @return {String}
	 */
	util.dest = function(mask) {
		return path.join(moduleDirs.dest, mask || '');
	};

	/**
	 * Inserts item into an array after given item. Modifies array.
	 *
	 * @param {Array} array
	 * @param {Mixed} item
	 * @param {Mixed} newItem
	 */
	util.insertAfter = function(array, item, newItem) {
		array.splice(array.indexOf(item) + 1, 0, newItem);
	};

	function npmModulePath(module) {
		return path.join(process.cwd(), 'node_modules', module);
	}

	function main() {
		// Default config
		config = _.merge({
			tamia: {
				src: '',
				dest: ''
			}
		}, config);

		// Banner
		util.requireConfig('tamia.author');
		config.banner = '/*! Author: <%= tamia.author %>, <%= grunt.template.today("yyyy") %> */\n';

		// Modules
		grunt.verbose.subhead('tamia-grunt: loading modules…');
		modules = glob.sync(__dirname + '/modules/*.js');
		modules.forEach(function(module) {
			moduleName = path.basename(module, '.js');
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
							// @todo scriptsDest, stylesDest support
							path.join(config.tamia.dest, 'build/**/*')
						]
					}
				}
			}, config);
		}

		// Required npm modules
		util.npmInstall(_.keys(requires));

		// Print generated config
		if (grunt.option('verbose')) {
			grunt.log.subhead('Config generated by grunt-tamia:');
			grunt.log.writeln(prettyjson.render(config));
			grunt.log.writeln();
		}

		// Run Grunt with modified config
		grunt.config.init(config);
	}

	// Run
	main();

};
