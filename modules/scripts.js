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

	function has(check, paramName) {
		var param = config.tamia[paramName];
		if (param !== undefined) {
			return param;
		}
		return check();
	}

	util.setupDirs({
		srcParam: 'scriptsSrc',
		srcDir: 'js',
		destParam: 'scriptsDest',
		destDir: 'build'
	});

	var debug = !!grunt.option('debug');

	var localConfig = {};
	var deps = [];
	var tasks = [];

	// Any scripts
	if (util.hasScripts()) {
		grunt.verbose.writeln('tamia-grunt: scripts: some scripts found...');
		_.merge(localConfig, {
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
				}
			}
		});

		deps.push(
			'grunt-contrib-jshint',
			'grunt-contrib-uglify',
			'grunt-contrib-watch'
		);
		tasks.push('jshint', 'uglify');
	}

	// Regular scripts: js/**/*.js
	if (has(function() { return grunt.file.exists(util.src('main.js')); }, 'scripts')) {
		grunt.verbose.writeln('tamia-grunt: scripts: regular scripts found.');
		util.requireConfig('concat');

		_.merge(localConfig, {
			concat: {
				options: {
					sourceMap: debug
				}
			},
			uglify: {
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
		});

		deps.push('grunt-contrib-concat');
		util.insertAfter(tasks, 'jshint', 'concat');
	}

	// Inlines: js/inlines/*.js
	var inlinesSrc = util.src('inlines');
	if (has(function() { return grunt.file.exists(inlinesSrc); }, 'inlines')) {
		grunt.verbose.writeln('tamia-grunt: scripts: inline scripts found.');
		_.merge(localConfig, {
			uglify: {
				inlines: {
					files: [
						{
							expand: true,
							cwd: inlinesSrc,
							src: '*.js',
							dest: util.dest('inlines')
						}
					]
				}
			},
			watch: {
				inlines: {
					options: {
						atBegin: true
					},
					files: inlinesSrc,
					tasks: ['uglify:inlines']
				}
			}
		});
	}

	// Bower components
	if (has(function() { return grunt.file.exists('bower.json'); }, 'bower')) {
		grunt.verbose.writeln('tamia-grunt: scripts: Bower components found.');
		_.merge(localConfig, {
			bower_concat: {
				main: {
					dest: util.dest('_bower.js'),
					exclude: [
						'jquery',
						'modernizr'
					]
				}
			},
			watch: {
				bower: {
					options: {
						atBegin: true
					},
					files: 'bower.json',
					tasks: ['bower_concat', 'concat']
				}
			}
		});

		deps.push('grunt-bower-concat');
		util.insertAfter(tasks, 'jshint', 'bower_concat');
	}


	if (!tasks.length) {
		util.skipModule();
		return config;
	}

	config = _.merge(localConfig, config);

	util.npmDependencies(deps);

	tasks = util.appendModernizr(tasks);

	grunt.registerTask('scripts', tasks);

	return config;
};
