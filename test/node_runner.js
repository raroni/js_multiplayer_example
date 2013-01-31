var Snitch = require('snitch');

var paths = [
  'transcoder_test',
  'world_test',
  'event_emitter_test',
  'update_buffer_test'
];

var options = {
  dir: __dirname + '/cases',
  paths: paths
};

Snitch.run(options);
