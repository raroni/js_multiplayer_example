(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Utf8;
  if(isNode) Utf8 = require('./utf8');
  else Utf8 = window.Utf8;

  function BufferBuilder() {
    this.items = [];
  }

  BufferBuilder.prototype = {
    add: function(value, type) {
      var item = {
        value: value,
        type: type
      };
      this.items.push(item);
    },
    build: function() {
      var buffer = new ArrayBuffer(this.getSize());
      this.view = new DataView(buffer);
      this.offset = 0;
      this.items.forEach(this.writeItem.bind(this));
      return buffer;
    },
    writeItem: function(item) {
      if(item.type === 'string') {
        var codes = Utf8.encode(item.value);
        codes.forEach(function(code) {
          this.view.setUint8(this.offset, code);
          this.offset++;
        }.bind(this));
        this.view.setUint8(this.offset, 0);
        this.offset++;
      } else {
        var methodName = 'set' + item.type[0].toUpperCase() + item.type.slice(1);
        this.view[methodName](this.offset, item.value);
        this.offset += getItemSize(item);
      }
    },
    getSize: function() {
      var size = 0;
      this.items.forEach(function(item) {
        size += getItemSize(item);
      });
      return size;
    }
  };

  var numberTypeSizes = {
    'uint8': 1,
    'uint16': 2,
  };

  function getItemSize(item) {
    var size;
    if(item.type === 'string') {
      size = Utf8.encode(item.value).length+1;
    } else {
      size = numberTypeSizes[item.type];
      if(!size) throw new Error('Could not get number size for item "' + item.type + '".');
    }
    return size;
  }

  if(isNode) module.exports = BufferBuilder;
  else window.BufferBuilder = BufferBuilder;
})();
