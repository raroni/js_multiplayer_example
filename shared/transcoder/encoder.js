(function() {
  var Encoder = {
    encode: function() {

    }
  };

  var isNode = typeof(exports) !== 'undefined';
  if(isNode) module.exports = Encoder;
  else window.Transcoder.Encoder = Encoder;
})();
