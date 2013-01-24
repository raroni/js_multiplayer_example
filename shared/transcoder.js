(function() {
  var isNode = typeof(exports) !== 'undefined';

  Transcoder = {
    encode: function(message) {
      var string = Transcoder.Encoder.encode(message);
      return string;
    },
    decode: function(string) {
      var message = Transcoder.Decoder.decode(string);
      return message;
    },
    canTranscode: function(type) {
      return Transcoder.types.indexOf(type) != -1
    },
    types: [
      'commandAcknowledgement'
    ]
  };

  if(isNode) {
    module.exports = Transcoder;
    Transcoder.Encoder = require('./transcoder/encoder');
    Transcoder.Decoder = require('./transcoder/decoder');
  } else {
    window.Transcoder = Transcoder;
  }
})();
