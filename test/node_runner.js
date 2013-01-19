var Snitch = require('snitch')

var paths = [
  'test_case_test'
]

var options = {
  dir: __dirname + '/cases',
  paths: paths
}

Snitch.run(options)
