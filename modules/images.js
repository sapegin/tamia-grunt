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

	var srcDir = util.srcDir('imagesSrc', 'images_src');
	var destDir = util.destDir('imagesDest', 'images');
	var imagesExts = 'png,jpg,jpeg,gif';
	var svgExts = 'svg';

	var images = !!glob.sync(util.globMask(imagesExts, srcDir)).length;
	var svgs = !!glob.sync(util.globMask(svgExts, srcDir)).length;

	if (!images && !svgs) return config;

	var localConfig = {
		watch: {
			images: {
				options: {
					atBegin: true
				},
				files: util.globMask(imagesExts + svgExts, srcDir),
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
						cwd: srcDir,
						src: util.globMask(imagesExts),
						dest: destDir
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
						cwd: srcDir,
						src: util.globMask(svgExts),
						dest: destDir
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
