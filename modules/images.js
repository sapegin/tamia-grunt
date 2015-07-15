/**
 * Tâmia workflow for Grunt.
 * Image optimization: PNG, GIF, JPEG, SVG.
 *
 * @author Artem Sapegin (http://sapegin.me)
 */

module.exports = function(grunt, util, config) {
	'use strict';

	var glob = require('glob');
	var _ = require('lodash');

	var dirs = util.setupDirs({
		srcParam: 'imagesSrc',
		srcDir: 'images_src',
		destParam: 'imagesDest',
		destDir: 'images'
	});

	var imagesExts = 'png,jpg,jpeg,gif,svg';

	var imagesGlob = util.globMask(imagesExts, dirs.src + '/**');
	var images = !!glob.sync(imagesGlob).length;
	if (!images) {
		util.skipModule();
		return config;
	}

	var pngquant;
	var use;
	if (config.tamia.pngquant !== false) {
		pngquant = util.npmRequire('imagemin-pngquant');
		use = [pngquant()];
	}

	var localConfig = {
		imagemin: {
			options: {
				optimizationLevel: 5,
				progressive: true,
				use: use
			},
			images: {
				files: [
					{
						expand: true,
						cwd: dirs.src,
						src: '**/' + util.globMask(imagesExts),
						dest: dirs.dest
					}
				]
			}
		},
		watch: {
			images: {
				options: {
					atBegin: true
				},
				files: imagesGlob,
				tasks: ['images']
			}
		}
	};

	config = _.merge(localConfig, config);

	util.npmDependencies([
		'grunt-newer',
		'grunt-contrib-imagemin',
		'grunt-contrib-watch'
	]);

	grunt.registerTask('images', ['newer:imagemin']);

	return config;
};
