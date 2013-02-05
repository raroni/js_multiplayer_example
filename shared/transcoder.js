(function() {
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
      return Transcoder.messageTypes.indexOf(type) != -1
    },
    getTypeSize: function(type) {
      var size = Transcoder.attributeSizes[type];
      if(!size) throw new Error('Could not resolve size for type "' + type + '".');
      return size;
    },
    getAttributeCode: function(collectionName, attribute) {
      var attributeList = Transcoder.attributeTypes[collectionName];
      var foundAttribute;
      for(var i=0; attributeList.length>i; i++) {
        foundAttribute = attributeList[i];
        if(foundAttribute[0] === attribute) return i;
      }
    },
    getAttributeType: function(collectionName, attributeName) {
      var attribute = Transcoder.getAttribute(collectionName, attributeName);
      return attribute[1];
    },
    getAttribute: function(collectionName, attribute) {
      var attributeList = Transcoder.attributeTypes[collectionName];
      var foundAttribute;
      for(var i=0; attributeList.length>i; i++) {
        foundAttribute = attributeList[i];
        if(foundAttribute[0] == attribute) return foundAttribute;
      }
      throw new Error('Could not find a type for "' + collectionName + ':' + attribute + '".');
    },
    getCollectionName: function(collectionCode) {
      var name = this.collectionTypes[collectionCode];
      if(!name) throw new Error('Could not find collection name for code ' + collectionCode + '.');
      return name;
    },
    getAttributeName: function(collectionName, attributeCode) {
      var attributeList = Transcoder.attributeTypes[collectionName];
      return attributeList[attributeCode][0];
    },
    getCollectionCode: function(collectionName) {
      var code = this.collectionTypes.indexOf(collectionName);
      if(code === -1) throw new Error('Could not find collection code for "' + collectionName + '".');
      return code;
    },
    getMessageType: function(typeCode) {
      var type = this.messageTypes[typeCode];
      if(!type) throw new Error('Did not regognize type code: "' + typeCode + '".');
      return type;
    },
    getMessageTypeCode: function(messageType) {
      var typeCode = this.messageTypes.indexOf(messageType);
      if(typeCode === -1) throw new Error('Did not regognize message type "' + messageType + '".')
      return typeCode;
    },
    messageTypes: [
      'commandAcknowledgement',
      'changes',
      'removes',
      'adds'
    ],
    attributeTypes: {
      players: [
        ['id', 'uint8'],
        ['positionX', 'uint16'],
        ['positionY', 'uint16'],
        ['name', 'string']
      ]
    },
    attributeSizes: {
      'uint8': 1,
      'uint16': 2
    },
    collectionTypes: ['players']
  };

  var isNode = typeof(exports) !== 'undefined';
  if(isNode) {
    module.exports = Transcoder;
    Transcoder.Encoder = require('./transcoder/encoder');
    Transcoder.Decoder = require('./transcoder/decoder');
  } else {
    window.Transcoder = Transcoder;
  }
})();
