/**
 * Tâmia workflow for Grunt.
 * JavaScript stuff: concatenation, minification, linting. Plus Bower concatenation.
 *
 * @author Artem Sapegin (http://sapegin.me)
 */

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
module.exports = function(grunt, util, config) {
	'use strict';

	var _ = require('lodash');

	if (!util.hasScripts()) return config;

	if (!config.concat) {
		grunt.fail.fatal('Gruntfile should contain "concat" section.');
		return;
	}

	var debug = !!grunt.option('debug');

	var localConfig = {
		jshint: {
			options: {
				jshintrc: true
			},
			files: [
				'js/*.js',
				'js/components/*.js'
			]
		},
		uglify: {
			options: {
				compress: {
					global_defs: {
						DEBUG: debug
					}
				}
			},
			main: {
				options: {
					banner: '<%= banner %>'
				},
				files: {
					'<%= concat.main.dest %>': '<%= concat.main.dest %>'
				}
			}
		},
		watch: {
			concat: {
				options: {
					atBegin: true
				},
				files: '<%= concat.main.src %>',
				tasks: ['concat']
			}
		}
	};

	var deps = [
		'grunt-contrib-jshint',
		'grunt-contrib-concat',
		'grunt-contrib-uglify'
	];

	var tasks = ['jshint', 'concat', 'uglify'];

	if (grunt.file.exists('bower.json')) {
		localConfig.bower_concat = {
			main: {
				dest: 'build/_bower.js',
				exclude: [
					'jquery',
					'modernizr'
				]
			}
		};
		localConfig.watch.bower = {
			files: 'bower.json',
			tasks: ['bower_concat', 'concat']
		};
		deps.push('grunt-bower-concat');
		tasks.splice(tasks.indexOf('jshint') + 1, 0, 'bower_concat');
	}

	config = _.merge(localConfig, config);

	util.npmDependencies(deps);

	tasks = util.appendModernizr(tasks);

	grunt.registerTask('scripts', tasks);

	return config;
};
