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

	if (!util.hasScripts()) {
		util.skipModule();
		return config;
	}

	util.requireConfig('concat');

	util.setupDirs({
		srcParam: 'scriptsSrc',
		srcDir: 'js',
		destParam: 'scriptsDest',
		destDir: 'build'
	});

	var debug = !!grunt.option('debug');

	var localConfig = {
		concat: {
			options: {
				sourceMap: debug
			}
		},
		jshint: {
			options: {
				jshintrc: true
			},
			files: [
				util.src('**/*.js')
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
			},
			inlines: {
				files: [
					{
						expand: true,
						cwd: util.src('inlines'),
						src: '*.js',
						dest: util.dest('inlines')
					}
				]
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
				dest: util.dest('_bower.js'),
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
