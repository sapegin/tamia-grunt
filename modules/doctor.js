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
		'grunt-contrib-concat': '0.5.0',  // Source maps support
		'grunt-contrib-imagemin': '0.9.0',
		'grunt-contrib-jshint': '0.10.0',
		'grunt-contrib-stylus': '0.20.0',  // Stylus 0.49
		'grunt-contrib-uglify': '0.7.0',
		'grunt-contrib-watch': '0.6.0',
		'grunt-modernizr': '0.6.0',
		'grunt-newer': '1.1.0',
		'grunt-bower-concat': '0.4.0',
		'stylobuild': '0.7.0',  // minifier: false
	};
	var superfluous = [
		'grunt-svgmin'
	];

	var fs = require('fs');
	var path = require('path');
	var _ = require('lodash');
	var chalk = require('chalk');
	var compareVersion = require('compare-version');

	var allOk = true;

	var localConfig = {
		doctor: {}
	};
	config = _.merge(localConfig, config);

	grunt.registerTask('doctor', 'Check project configuration: npm modules versions, etc.', function() {
		grunt.log.subhead('Checking package.json...');
		var packageJsonPath = findPackageJson();
		if (packageJsonPath) {
			ok('package.json found');
		}
		else {
			notOk('package.json not found');
		}

		var packageDir = path.dirname(packageJsonPath);
		var devDependencies = readPackageJson().devDependencies;

		grunt.log.subhead('Checking outdated npm dependencies...');
		var obsolete = [];
		_.each(requirements, function(version, name) {
			if (!devDependencies[name]) return;
			var printName = chalk.white(name);
			var packageJson = readPackageJson(path.join(packageDir, 'node_modules', name), false);
			var installedVersion = packageJson.version;
			if (compareVersion(installedVersion, version) !== -1) {
				ok(printName + ' ' + installedVersion);
			}
			else {
				notOk(printName + ' ' + version + ' is required, installed ' + installedVersion);
				obsolete.push(name);
			}
		});

		if (obsolete.length) {
			util.npmPlease('update', obsolete);
		}

		grunt.log.subhead('Checking superfluous npm dependencies...');
		var toremove = _.filter(superfluous, function(name) {
			return !!devDependencies[name];
		});

		if (toremove.length) {
			util.npmPlease('remove', toremove);
		}
		else {
			ok('no superfluous packages found');
		}

		if (!allOk) {
			grunt.log.writeln();
			grunt.fail.fatal('Not OK ಠ_ಠ');
		}
	});

	function ok(message) {
		grunt.log.writeln(chalk.green('✔ ') + message);
	}

	function notOk(message) {
		allOk = false;
		grunt.log.writeln(chalk.red('✘ ') + message);
	}

	function readPackageJson(dir, recursive) {
		var packageJson = findPackageJson(dir, recursive);
		return packageJson ? require(packageJson) : null;
	}

	function findPackageJson(dir, recursive) {
		if (dir === undefined) dir = process.cwd();
		var filename = 'package.json';
		var filepath = path.join(dir, filename);
		if (fs.existsSync(filepath)) {
			return filepath;
		}

		if (recursive === false || dir === '/') {
			return null;
		}

		return findPackageJson(path.dirname(dir), recursive);
	}

	return config;
};
