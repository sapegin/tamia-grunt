/**
 * Tâmia workflow for Grunt.
 * CSS stuff: Stylus, Autoprefixer, CSSO.
 *
 * @author Artem Sapegin (http://sapegin.me)
 */

module.exports = function(grunt, util, config) {
	'use strict';

	var path = require('path');
	var _ = require('lodash');

	if (!util.hasStyles()) return config;

	var srcDir = util.srcDir('stylesSrc', 'styles');
	var destDir = util.destDir('stylesDest', 'build');

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
	if (config.tamia.stylobuild) {
		_.merge(stylobuildConfig, config.tamia.stylobuild);
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
					path.join(srcDir, 'tamia')
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
				files: path.join(srcDir, '**/*.styl'),
				tasks: ['stylus']
			}
		}
	};

	var isWordpressTheme = grunt.file.exists('header.php') && grunt.file.exists('functions.php');
	var dest = isWordpressTheme ? 'styles.css' : path.join(destDir, 'styles.css');
	localConfig.stylus.compile.files[dest] = path.join(srcDir, 'index.styl');

	config = _.merge(localConfig, config);

	util.npmDependencies([
		'grunt-contrib-stylus'
	]);

	var tasks = ['stylus'];
	tasks = util.appendModernizr(tasks);
	grunt.registerTask('styles', tasks);

	return config;
};
