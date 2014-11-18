// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
module.exports = function(grunt, util, config) {
	'use strict';

	// @todo Run bower_concat if bower.json exists.

	var _ = require('lodash');

	if (!grunt.file.exists('js/main.js')) return config;

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
		bower_concat: {
			main: {
				dest: 'build/_bower.js',
				exclude: [
					'jquery',
					'modernizr'
				]
			}
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
		modernizr: {
			main: {
				devFile: 'remote',
				outputFile: 'build/modernizr.js',
				extra: {
					load: false
				},
				files: {
					src: [
						'build/scripts.js',
						'build/styles.css'
					]
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
			},
			bower: {
				files: 'bower.json',
				tasks: ['bower_concat', 'concat']
			}
		}
	};

	config = _.merge(localConfig, config);

	util.npmDependencies([
		'grunt-contrib-jshint',
		'grunt-bower-concat',
		'grunt-contrib-concat',
		'grunt-contrib-uglify',
		'grunt-modernizr'
	]);
	util.requireBanner();

	grunt.registerTask('scripts', ['jshint', 'bower_concat', 'concat', 'uglify', 'modernizr']);

	return config;
};
