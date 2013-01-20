var Snitch = require('snitch');

var paths = [
  'transcoder_test'
];

var options = {
  dir: __dirname + '/cases',
  paths: paths
};

Snitch.run(options);
