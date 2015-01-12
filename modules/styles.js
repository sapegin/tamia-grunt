/**
 * Tâmia workflow for Grunt.
 * CSS stuff: Stylus, Autoprefixer, CSSO.
 *
 * @author Artem Sapegin (http://sapegin.me)
 */

module.exports = function(grunt, util, config) {
	'use strict';

	var _ = require('lodash');

	if (!util.hasStyles()) {
		util.skipModule();
		return config;
	}

	util.setupDirs({
		srcParam: 'stylesSrc',
		srcDir: 'styles',
		destParam: 'stylesDest',
		destDir: 'build'
	});

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
					util.src('tamia')
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
				files: util.src('**/*.styl'),
				tasks: ['stylus']
			}
		}
	};
	localConfig.stylus.compile.files[util.dest('styles.css')] = util.src('index.styl');

	config = _.merge(localConfig, config);

	util.npmDependencies([
		'grunt-contrib-stylus'
	]);

	var tasks = ['stylus'];
	tasks = util.appendModernizr(tasks);
	grunt.registerTask('styles', tasks);

	return config;
};
