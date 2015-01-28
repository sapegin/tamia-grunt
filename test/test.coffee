fs = require 'fs'
path = require 'path'
glob = require 'glob'
expect = (require 'chai').expect

read = (dir, file) ->
	filepath = path.join dir, file
	return fs.readFileSync filepath, {encoding: 'utf8'}

describe 'basic', ->

	it 'build', (done) ->
		expected_dir = path.join __dirname, 'expected'
		build_dir = path.join __dirname, 'build'
		files = glob.sync '**/*', {cwd: expected_dir, nodir: true}
		files.forEach (file) ->
			expected = read expected_dir, file
			actual = read build_dir, file
			expect(expected).to.equal(actual)
		done()

	it 'images', (done) ->
		source_dir = path.join __dirname, 'images_src'
		optimized_dir = path.join __dirname, 'images'
		files = glob.sync '*.*', cwd: source_dir
		files.forEach (file) ->
			source_size = (fs.statSync (path.join source_dir, file)).size
			optimized_size = (fs.statSync (path.join optimized_dir, file)).size
			expect(optimized_size).to.be.below(source_size)
		done()
