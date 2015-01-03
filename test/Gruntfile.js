module.exports = function(grunt) {
	'use strict';

	require('../index')(grunt, {
		tamia: {
			author: 'Artem Sapegin, http://sapegin.me'
		},
		concat: {
			main: {
				src: [
					'<%= bower_concat.main.dest %>',
					'js/main.js'
				],
				dest: 'build/scripts.js'
			}
		}
	});

	grunt.registerTask('default', ['styles', 'scripts', 'images']);
};
