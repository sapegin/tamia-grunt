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

	var imagesExts = 'png,jpg,jpeg,gif';
	var svgExts = 'svg';

	var images = !!glob.sync(util.globMask(imagesExts, dirs.src)).length;
	var svgs = !!glob.sync(util.globMask(svgExts, dirs.src)).length;

	if (!images && !svgs) {
		util.skipModule();
		return config;
	}

	var localConfig = {
		watch: {
			images: {
				options: {
					atBegin: true
				},
				files: util.globMask(imagesExts + svgExts, dirs.src),
				tasks: ['images']
			}
		}
	};
	var deps = ['grunt-newer'];
	var tasks = [];

	if (images) {
		deps.push('grunt-contrib-imagemin');
		tasks.push('newer:imagemin');
		localConfig.imagemin = {
			options: {
				pngquant: true
			},
			images: {
				files: [
					{
						expand: true,
						cwd: dirs.src,
						src: util.globMask(imagesExts),
						dest: dirs.dest
					}
				]
			}
		};
	}

	if (svgs) {
		deps.push('grunt-svgmin');
		tasks.push('newer:svgmin');
		localConfig.svgmin = {
			images: {
				files: [
					{
						expand: true,
						cwd: dirs.src,
						src: util.globMask(svgExts),
						dest: dirs.dest
					}
				]
			}
		};
	}

	config = _.merge(localConfig, config);

	util.npmDependencies(deps);

	grunt.registerTask('images', tasks);

	return config;
};
