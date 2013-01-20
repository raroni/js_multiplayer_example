(function() {
  var Decoder = {
    decode: function(string) {
      var message = {}
      return message;
    }
  };

  var isNode = typeof(exports) !== 'undefined';
  if(isNode) module.exports = Decoder;
  else window.Transcoder.Decoder = Decoder;
})();
