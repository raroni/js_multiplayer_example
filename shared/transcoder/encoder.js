(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Transcoder, BufferBuilder;
  if(isNode) {
    Transcoder = require('../transcoder');
    BufferBuilder = require('../buffer_builder');
  } else {
    Transcoder = window.Transcoder;
    BufferBuilder = window.BufferBuilder;
  }

  function Encoder(message) {
    this.message = message;
    this.bufferBuilder = new BufferBuilder();
  }

  Encoder.prototype = {
    encode: function() {
      var typeCode = Transcoder.getMessageTypeCode(this.message.type);
      
      this.write(typeCode, 'uint8');
      this.build();
      this.buffer = this.bufferBuilder.build();
    },
    write: function(value, type) {
      this.bufferBuilder.add(value, type);
    }
  };

  Encoder.encode = function(message) {
    var encoderConstructor;
    switch(message.type) {
      case "commandAcknowledgement":
      encoderConstructor = CommandAcknowledgementEncoder;
      break;
      case "changes":
      encoderConstructor = ChangesEncoder;
      break;
      case "removes":
      encoderConstructor = RemovesEncoder;
      break;
      case "adds":
      encoderConstructor = AddsEncoder;
      break;
      default:
      throw new Error("Cannot find encoder for message type '" + message.type + "'.")
      break;
    }
    var encoder = new encoderConstructor(message);
    encoder.encode()
    return encoder.buffer;
  };

  function CommandAcknowledgementEncoder(message) {
    Encoder.call(this, message);
  }
  CommandAcknowledgementEncoder.prototype = Object.create(Encoder.prototype);

  CommandAcknowledgementEncoder.prototype.build = function() {
    this.write(this.message.state.positionX, 'uint16');
    this.write(this.message.state.positionY, 'uint16');
    this.write(this.message.lastAcknowledgedCommandId, 'uint16');
  };

  function ChangesEncoder(message) {
    this.changes = message.changes;
    Encoder.call(this, message);
  }
  ChangesEncoder.prototype = Object.create(Encoder.prototype);

  ChangesEncoder.prototype.build = function() {
    var collectionName, collectionCode, collectionChange, entityId, entitiesCount, entityChanges, attributesCount, attribute;

    for(collectionName in this.changes) {
      collectionCode = Transcoder.getCollectionCode(collectionName);
      collectionChanges = this.changes[collectionName];

      if(collectionCode == -1) throw new Error('Could not find a collection code for collection name ' + collectionName);
      this.write(collectionCode, 'uint8');

      entitiesCount = Object.keys(collectionChanges).length;
      this.write(entitiesCount, 'uint8');

      for(entityId in collectionChanges) {
        entityChanges = collectionChanges[entityId];

        this.write(entityId, Transcoder.getAttributeType(collectionName, 'id'));

        attributesCount = Object.keys(entityChanges).length;
        this.write(attributesCount, 'uint8');

        for(attribute in entityChanges) {
          attributeCode = Transcoder.getAttributeCode(collectionName, attribute);
          this.write(attributeCode, 'uint8');
          this.write(entityChanges[attribute], Transcoder.getAttributeType(collectionName, attribute));
        }
      }
    }
  };

  function AddsEncoder(message) {
    this.adds = message.adds;
    Encoder.call(this, message);
  }
  AddsEncoder.prototype = Object.create(Encoder.prototype);

  AddsEncoder.prototype.build = function() {
    var collectionName;

    for(collectionName in this.adds) {
      this.writeCollection(collectionName);
    }
    
    /*
    var collectionName, collectionCode, collectionChange, entityId, entitiesCount, entityAdds, attributesCount, attribute;

    for(collectionName in this.changes) {
      collectionCode = Transcoder.getCollectionCode(collectionName);
      collectionAdds = this.changes[collectionName];

      if(collectionCode == -1) throw new Error('Could not find a collection code for collection name ' + collectionName);
      this.add(collectionCode, 'uint8');

      entitiesCount = Object.keys(collectionAdds).length;
      this.add(entitiesCount, 'uint8');

      for(entityId in collectionAdds) {
        entityAdds = collectionAdds[entityId];

        this.add(entityId, Transcoder.getAttributeType(collectionName, 'id'));

        attributesCount = Object.keys(entityAdds).length;
        this.add(attributesCount, 'uint8');

        for(attribute in entityAdds) {
          attributeCode = Transcoder.getAttributeCode(collectionName, attribute);
          this.add(attributeCode, 'uint8');
          this.add(entityAdds[attribute], Transcoder.getAttributeType(collectionName, attribute));
        }
      }
    }
    */
  };

  // TODO: Put me into separate FILE!!! World should not be declared in browser.
  var World;
  if(isNode) {
    World = require('../../models/world');
  }
  AddsEncoder.prototype.writeCollection = function(collectionName) {
    this.currentCollectionName = collectionName;
    var adds = this.adds[collectionName];
    var collectionCode = Transcoder.getCollectionCode(collectionName);
    var entityCount = adds.length
    
    this.write(collectionCode, 'uint8');
    this.write(entityCount, 'uint8');
    adds.forEach(this.writeEntity.bind(this));
  }

  AddsEncoder.prototype.writeEntity = function(entityData) {
    this.currentEntityData = entityData;
    var constructor = World.prototype.getEntityConstructor(this.currentCollectionName);
    var attributeNames = constructor.prototype.attributeNames;
    attributeNames.forEach(this.writeEntityAttribute.bind(this));
  }

  AddsEncoder.prototype.writeEntityAttribute = function(attributeName) {
    var type = Transcoder.getAttributeType(this.currentCollectionName, attributeName);
    var value = this.currentEntityData[attributeName]
    this.write(value, type);
  }

  function RemovesEncoder(message) {
    this.removes = message.removes;
    Encoder.call(this, message);
  }
  RemovesEncoder.prototype = Object.create(Encoder.prototype);

  RemovesEncoder.prototype.build = function() {
    for(var collectionName in this.removes) {
      this.buildCollection(collectionName);
    }
  };

  RemovesEncoder.prototype.buildCollection = function(collectionName) {
    var collectionCode = Transcoder.getCollectionCode(collectionName);
    this.write(collectionCode, 'uint8');

    this.currentCollectionRemoves = this.removes[collectionName];
    var removesCount = Object.keys(this.currentCollectionRemoves).length;
    this.write(removesCount, 'uint8');
    this.currentCollectionRemoves.forEach(function(entityId) {
      this.write(entityId, Transcoder.getAttributeType(collectionName, 'id'));
    }.bind(this));
  };


  if(isNode) module.exports = Encoder;
  else window.Transcoder.Encoder = Encoder;
})();
