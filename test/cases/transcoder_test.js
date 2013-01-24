(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Snitch, Transcoder;
  if(isNode) {
    Snitch = require('snitch');
    Transcoder = require('../../shared/transcoder');
  } else {
    Snitch = window.Snitch;
    Transcoder = window.Transcoder;
  }

  function TranscoderTest(name) {
    Snitch.TestCase.call(this, name);
  }

  TranscoderTest.prototype = Object.create(Snitch.TestCase.prototype);

  TranscoderTest.prototype['test command acknowledgement message'] = function() {
    var originalMessage = {
      type: 'commandAcknowledgement',
      state: {
        position: {
          x: 180,
          y: 200
        }
      },
      lastAcknowledgedCommandId: 25
    };

    var encodedMessage = Transcoder.encode(originalMessage);
    var decodedMessage = Transcoder.decode(encodedMessage);

    this.assertEqual(7, encodedMessage.byteLength);
    this.assertEqual(originalMessage.type, decodedMessage.type);
    this.assertEqual(originalMessage.state.position.x, decodedMessage.state.position.x);
    this.assertEqual(originalMessage.state.position.y, decodedMessage.state.position.y);
    this.assertEqual(originalMessage.lastAcknowledgedCommandId, decodedMessage.lastAcknowledgedCommandId);
  };

  if(isNode) module.exports = TranscoderTest;
  else window.TranscoderTest = TranscoderTest;
})();
