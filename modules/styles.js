module.exports = function(grunt, util, config) {
	'use strict';

	var _ = require('lodash');

	if (!grunt.file.exists('styles/index.styl')) return config;

	var stylobuild = util.npmRequire('stylobuild');

	var debug = !!grunt.option('debug');

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
						return stylobuild({
							autoprefixer: {
								browsers: 'last 2 versions, ie 8, ie 9'
							},
							csso: !debug,
							pixrem: false
						})
					}
				]
			},
			compile: {
				files: {
					'build/styles.css': 'styles/index.styl'
				}
			}
		},
		watch: {
			stylus: {
				options: {
					atBegin: true
				},
				files: 'styles/**/*',
				tasks: ['stylus']
			}
		}
	};

	config = _.merge(localConfig, config);

	util.npmDependencies([
		'grunt-contrib-stylus'
	]);
	util.requireBanner();

	return config;
};
