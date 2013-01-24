(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Transcoder;
  if(isNode) {
    Transcoder = require('../transcoder');
  } else {
    Transcoder = window.Transcoder;
  }

  var Encoder = {
    encode: function(message) {
      var typeCode = Transcoder.types.indexOf(message.type)

      var buffer = new ArrayBuffer(7);
      var view = new DataView(buffer);

      view.setUint8(0, typeCode);
      view.setUint16(1, message.state.position.x);
      view.setUint16(3, message.state.position.y);
      view.setUint16(5, message.lastAcknowledgedCommandId);

      return buffer;
    }
  };

  if(isNode) module.exports = Encoder;
  else window.Transcoder.Encoder = Encoder;
})();
