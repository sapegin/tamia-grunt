/**
 * Tâmia workflow for Grunt.
 * CSS stuff: Stylus, Autoprefixer, CSSO.
 *
 * @author Artem Sapegin (http://sapegin.me)
 */

module.exports = function(grunt, util, config) {
	'use strict';

	var _ = require('lodash');

	if (!util.hasStyles()) return config;

	var stylobuild = util.npmRequire('stylobuild');

	var debug = !!grunt.option('debug');

	var stylobuildConfig = {
		autoprefixer: {
			browsers: 'last 2 versions, ie 8, ie 9'
		},
		minifier: 'cleancss',
		pixrem: false
	};
	if (debug) {
		stylobuildConfig.cleancss = false;
	}

	var localConfig = {
		stylus: {
			options: {
				'include css': true,
				urlfunc: 'embedurl',
				banner: '<%= banner %>',
				define: {
					DEBUG: debug
				},
				paths: [
					'tamia'
				],
				use: [
					function() {
						return stylobuild(stylobuildConfig);
					}
				]
			},
			compile: {
				files: {}
			}
		},
		watch: {
			stylus: {
				options: {
					atBegin: true
				},
				files: 'styles/**/*.styl',
				tasks: ['stylus']
			}
		}
	};

	var isWordpressTheme = grunt.file.exists('header.php') && grunt.file.exists('functions.php');
	localConfig.stylus.compile.files[isWordpressTheme ? 'styles.css' : 'build/styles.css'] = 'styles/index.styl';

	config = _.merge(localConfig, config);

	util.npmDependencies([
		'grunt-contrib-stylus'
	]);
	util.requireBanner();

	var tasks = ['stylus'];
	tasks = util.appendModernizr(tasks);
	grunt.registerTask('styles', tasks);

	return config;
};
