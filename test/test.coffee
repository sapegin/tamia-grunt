fs = require 'fs'
path = require 'path'
expect = (require 'chai').expect

read = (dir, file) ->
	filepath = path.join dir, file
	return fs.readFileSync filepath, {encoding: 'utf8'}

describe 'basic', ->

	it 'build', (done) ->
		expected_dir = path.join __dirname, 'expected'
		build_dir = path.join __dirname, 'build'
		files = fs.readdirSync expected_dir
		files.forEach (file) ->
			expected = read expected_dir, file
			actual = read build_dir, file
			expect(expected).to.equal(actual)
		done()
