(function() {
  var Utf8 = {
    encode: function(string) {
      var codes = [];
      var character, characterCode;

      for(var i = 0; i < string.length; i++) {
        character = string[i];
        characterCode = character.charCodeAt(0);
        if(characterCode <= 0x7F) {
          codes.push(characterCode);
        } else {
          var h = encodeURIComponent(character).substr(1).split('%');
          for (var j = 0; j < h.length; j++) {
            codes.push(parseInt(h[j], 16));
          }
        }
      }
      return codes;
    },
    decode: function () {
      var codes = Array.prototype.slice.apply(arguments);
      var result = "";
      var buffer = "";
      var code;
      for(var i=0; i < codes.length; i++) {
        code = codes[i];
        if(code <= 0x7F) {
          result += catchedDecodeURIComponent(buffer) + String.fromCharCode(code);
          buffer = "";
        } else {
          buffer += "%" + code.toString(16);
        }
      }
      if(buffer) result += catchedDecodeURIComponent(buffer);

      return result;
    }
  };

  function catchedDecodeURIComponent(string) {
    try {
      return decodeURIComponent(string);
    } catch(e) {
      return String.fromCharCode(0xFFFD); // UTF 8 invalid char
    }
  }

  var isNode = typeof(exports) !== 'undefined';
  if(isNode) module.exports = Utf8;
  else window.Utf8 = Utf8;
})();
