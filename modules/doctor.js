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
		'grunt-contrib-stylus': '0.17.0',
		'grunt-contrib-uglify': '0.4.0',
		'grunt-svgmin': '2.0.0',
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

		grunt.log.subhead('Checking npm dependencies...');
		var packageDir = path.dirname(packageJsonPath);
		var devDependencies = readPackageJson().devDependencies;
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
			}
		});

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
