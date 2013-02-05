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
        positionX: 180,
        positionY: 200
      },
      lastAcknowledgedCommandId: 25
    };

    var encodedMessage = Transcoder.encode(originalMessage);
    var decodedMessage = Transcoder.decode(encodedMessage);

    this.assertEqual(7, encodedMessage.byteLength);
    this.assertDeepEqual(originalMessage, decodedMessage);
  };

  TranscoderTest.prototype['test changes message'] = function() {
    var originalMessage = {
      type: 'changes',
      changes: {
        players: {
          13: {
            positionX: 20,
            positionY: 40
          },
          22: {
            positionX: 30
          }
        }
      }
    };

    var encodedMessage = Transcoder.encode(originalMessage);
    var decodedMessage = Transcoder.decode(encodedMessage);

    this.assertEqual(16, encodedMessage.byteLength);
    this.assertDeepEqual(originalMessage, decodedMessage);
  };

  TranscoderTest.prototype['test removes message'] = function() {
    var originalMessage = {
      type: 'removes',
      removes: {
        players: [1,4,5]
      }
    };

    var encodedMessage = Transcoder.encode(originalMessage);
    var decodedMessage = Transcoder.decode(encodedMessage);

    this.assertEqual(6, encodedMessage.byteLength);
    this.assertDeepEqual(originalMessage, decodedMessage);
  };

  TranscoderTest.prototype['test adds message'] = function() {
    var originalMessage = {
      type: 'adds',
      adds: {
        players: [
          {
            id: 1,
            name: 'Rasmus',
            positionX: 20,
            positionY: 40
          },
          {
            id: 2,
            name: 'John',
            positionX: 20,
            positionY: 40
          }
        ]
      }
    };

    var encodedMessage = Transcoder.encode(originalMessage);
    var decodedMessage = Transcoder.decode(encodedMessage);

    this.assertEqual(25, encodedMessage.byteLength);
    this.assertDeepEqual(originalMessage, decodedMessage);
  };

  if(isNode) module.exports = TranscoderTest;
  else window.TranscoderTest = TranscoderTest;
})();
