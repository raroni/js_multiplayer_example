var Snitch = require('snitch');

var paths = [
  'transcoder_test',
  'delta_generator_test'
];

var options = {
  dir: __dirname + '/cases',
  paths: paths
};

Snitch.run(options);
