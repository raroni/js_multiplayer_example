(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Transcoder, Utf8;
  if(isNode) {
    Transcoder = require('../transcoder');
    Utf8 = require('../utf8');
  } else {
    Transcoder = window.Transcoder;
    Utf8 = window.Utf8;
  }

  function Decoder(buffer) {
    this.message = {};
    this.view = new DataView(buffer);
    this.offset = 0;
  }
  Decoder.prototype = {
    decode: function() {
      var typeCode = this.read('uint8');
      this.message.type = Transcoder.getMessageType(typeCode);
    },
    read: function(type) {
      var value;
      if(type === 'string') {
        var codes = [];
        var finished = false;
        while(!finished) {
          code = this.view.getUint8(this.offset);
          if(code !== 0) {
            codes.push(code);
          } else {
            finished = true;
          }
          this.offset += 1;
        }
        value = Utf8.decode.apply(null, codes);
      } else {
        var methodName = 'get' + type[0].toUpperCase() + type.slice(1);
        value = this.view[methodName](this.offset);
        this.offset += Transcoder.getTypeSize(type);
      }
      return value;
    },
    atEnd: function() {
      return this.offset === this.view.buffer.byteLength;
    }
  };

  CommandAcknowledgementDecoder = function(buffer) {
    Decoder.call(this, buffer);
  }
  CommandAcknowledgementDecoder.prototype = Object.create(Decoder.prototype);

  CommandAcknowledgementDecoder.prototype.decode = function() {
    Decoder.prototype.decode.call(this);
    this.message.state = {};
    this.message.state.positionX = this.read('uint16');
    this.message.state.positionY = this.read('uint16');
    this.message.lastAcknowledgedCommandId = this.read('uint16');
  };

  ChangesDecoder = function(buffer) {
    Decoder.call(this, buffer);
  }
  ChangesDecoder.prototype = Object.create(Decoder.prototype);

  ChangesDecoder.prototype.decode = function() {
    Decoder.prototype.decode.call(this);
    this.message.changes = {};

    // no support for multiple collection changes yet
    this.readNextCollection();
  };

  ChangesDecoder.prototype.readNextAttribute = function() {
    var attributeCode = this.read('uint8');
    var attributeName = Transcoder.getAttributeName(this.currentCollectionName, attributeCode);
    var attributeType = Transcoder.getAttributeType(this.currentCollectionName, attributeName);
    var attributeValue = this.read(attributeType);
    this.currentEntityChanges[attributeName] = attributeValue;
  };

  ChangesDecoder.prototype.readNextEntity = function() {
    var entityIdType = Transcoder.getAttributeType(this.currentCollectionName, 'id');
    var entityId = this.read(entityIdType);
    var attributesCount = this.read('uint8');
    this.currentEntityChanges = {};
    this.currentCollectionChanges[entityId] = this.currentEntityChanges;
    for(n=0; attributesCount>n; n++) {
      this.readNextAttribute();
    }
  }

  ChangesDecoder.prototype.readNextCollection = function() {
    var collectionCode = this.read('uint8');
    this.currentCollectionName = Transcoder.getCollectionName(collectionCode);
    this.currentCollectionChanges = {};
    this.message.changes[this.currentCollectionName] = this.currentCollectionChanges;

    var entityCount = this.read('uint8');
    for(i=0; entityCount>i; i++) {
      this.readNextEntity();
    }
  }

  RemovesDecoder = function(buffer) {
    Decoder.call(this, buffer);
  }
  RemovesDecoder.prototype = Object.create(Decoder.prototype);

  RemovesDecoder.prototype.decode = function() {
    Decoder.prototype.decode.call(this);
    this.message.removes = {};

    while(!this.atEnd()) {
      this.readNextCollection();
    }
  };

  RemovesDecoder.prototype.readNextCollection = function() {
    var collectionCode = this.read('uint8');
    this.currentCollectionName = Transcoder.getCollectionName(collectionCode);
    this.currentCollectionRemoves = [];
    this.message.removes[this.currentCollectionName] = this.currentCollectionRemoves;

    var entityCount = this.read('uint8');
    for(i=0; entityCount>i; i++) {
      this.readNextEntity();
    }
  };

  RemovesDecoder.prototype.readNextEntity = function() {
    var idType = Transcoder.getAttributeType(this.currentCollectionName, 'id');
    var entityId = this.read(idType);
    this.currentCollectionRemoves.push(entityId);
  }

  // TODO: Put me into separate FILE!!! World should not be declared in browser.
  // Or maybe it should. AddsDecoder need World also.
  var World;
  if(isNode) World = require('../../models/world');
  else World = window.World;

  AddsDecoder = function(buffer) {
    Decoder.call(this, buffer);
  }
  AddsDecoder.prototype = Object.create(Decoder.prototype);

  AddsDecoder.prototype.decode = function() {
    Decoder.prototype.decode.call(this);
    this.message.adds = {};

    while(!this.atEnd()) {
      this.readNextCollection();
    }
  };

  AddsDecoder.prototype.readNextCollection = function() {
    var collectionCode = this.read('uint8');
    this.currentCollectionName = Transcoder.getCollectionName(collectionCode);
    this.currentCollectionAdds = [];
    this.message.adds[this.currentCollectionName] = this.currentCollectionAdds;

    var entityCount = this.read('uint8');
    for(i=0; entityCount>i; i++) {
      this.readNextEntity();
    }
  };

  AddsDecoder.prototype.readNextEntity = function() {
    var entityConstructor = World.prototype.getEntityConstructor(this.currentCollectionName);
    this.currentEntityData = {};
    this.currentCollectionAdds.push(this.currentEntityData);
    entityConstructor.prototype.attributeNames.forEach(this.readNextAttributebute.bind(this));
  }

  AddsDecoder.prototype.readNextAttributebute = function(attributeName) {
    var type = Transcoder.getAttributeType(this.currentCollectionName, attributeName);
    var value = this.read(type);
    this.currentEntityData[attributeName] = value;
  }


  Decoder.decode = function(buffer) {
    var view = new DataView(buffer);
    var typeCode = view.getUint8(0);
    var type = Transcoder.getMessageType(typeCode);

    var decoderConstructor;
    switch(type) {
      case "commandAcknowledgement":
      decoderConstructor = CommandAcknowledgementDecoder;
      break;
      case "changes":
      decoderConstructor = ChangesDecoder;
      break;
      case "removes":
      decoderConstructor = RemovesDecoder;
      break;
      case "adds":
      decoderConstructor = AddsDecoder;
      break;
      default:
      throw new Error("Cannot find decoder for message type '" + type + "'.")
      break;
    }
    var decoder = new decoderConstructor(buffer);
    decoder.decode();
    return decoder.message;
  }

  var isNode = typeof(exports) !== 'undefined';
  if(isNode) module.exports = Decoder;
  else window.Transcoder.Decoder = Decoder;
})();
