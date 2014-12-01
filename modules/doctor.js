/**
 * Tâmia workflow for Grunt.
 * Check project configuration: required dependencies (more later).
 *
 * @author Artem Sapegin (http://sapegin.me)
 */

module.exports = function(grunt, util, config) {
	'use strict';

	var requirements = {
		'grunt': '0.4.0',
		'grunt-contrib-concat': '0.4.0',
		'grunt-contrib-imagemin': '0.9.0',
		'grunt-contrib-jshint': '0.10.0',
		'grunt-contrib-stylus': '0.17.0',
		'grunt-contrib-uglify': '0.4.0',
		'grunt-modernizr': '0.5.0',
		'grunt-newer': '0.8.0',
		'grunt-bower-concat': '0.2.0',
		'stylobuild': '0.6.0',
	};

	var fs = require('fs');
	var path = require('path');
	var _ = require('lodash');
	var chalk = require('chalk');
	var compareVersion = require('compare-version');

	var localConfig = {
		doctor: {}
	};
	config = _.merge(localConfig, config);

	grunt.registerTask('doctor', 'Check project configuration: npm modules versions, etc.', function() {
		grunt.log.subhead('Checking npm dependencies...');
		var packageDir = path.dirname(findPackageJson());
		var devDependencies = readPackageJson().devDependencies;
		_.each(requirements, function(version, name) {
			if (!devDependencies[name]) return;
			var installedVersion = readPackageJson(path.join(packageDir, 'node_modules', name)).version;
			if (compareVersion(installedVersion, version) !== -1) {
				grunt.log.writeln(chalk.green('✔ ') + chalk.white(name) + ' ' + installedVersion);
			}
			else {
				grunt.log.writeln(chalk.red('✘ ') + chalk.white(name) + ' ' + version + ' is required, installed ' + installedVersion);
			}
		});
	});

	function readPackageJson(dir) {
		var packageJson = findPackageJson(dir);
		return require(packageJson);
	}

	function findPackageJson(dir) {
		if (dir === undefined) dir = process.cwd();
		var filename = 'package.json';
		var filepath = path.join(dir, filename);
		if (fs.existsSync(filepath)) {
			return filepath;
		}

		if (dir === '/') {
			throw new Error('Could not find package.json.');
		}

		return findPackageJson(path.dirname(dir));
	}

	return config;
};
