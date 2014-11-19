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

	var images = !!glob.sync(imagesDir + '/*.{png,jpg,gif}');
	var svgs = !!glob.sync(imagesDir + '/*.svg');

	if (!images && !svgs) return config;

	var localConfig = {
		watch: {
			images: {
				options: {
					atBegin: true
				},
				files: imagesDir + '/*.{png,jpg,gif,svg}',
				tasks: ['images']
			}
		}
	};
	var deps = [];
	var tasks = [];

	if (images) {
		deps.push('grunt-contrib-imagemin');
		tasks.push('imagemin');
		localConfig.imagemin = {
			options: {
				pngquant: true
			},
			images: {
				files: [
					{
						expand: true,
						cwd: imagesDir,
						src: '*.{png,jpg,gif}',
						dest: 'images'
					}
				]
			}
		};
	}

	if (svgs) {
		deps.push('grunt-svgmin');
		tasks.push('svgmin');
		localConfig.svgmin = {
			images: {
				files: [
					{
						expand: true,
						cwd: imagesDir,
						src: '*.svg',
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
