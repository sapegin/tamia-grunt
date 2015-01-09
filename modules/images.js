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

	var imagesDir = 'images_src';
	var imagesExts = 'png,jpg,jpeg,gif';
	var svgExts = 'svg';

	var images = !!glob.sync(util.globMask(imagesExts, imagesDir)).length;
	var svgs = !!glob.sync(util.globMask(imagesExts, svgExts)).length;

	if (!images && !svgs) return config;

	var localConfig = {
		watch: {
			images: {
				options: {
					atBegin: true
				},
				files: util.globMask(imagesExts + svgExts, imagesDir),
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
						cwd: imagesDir,
						src: util.globMask(imagesExts),
						dest: 'images'
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
						cwd: imagesDir,
						src: util.globMask(svgExts),
						dest: 'images'
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
