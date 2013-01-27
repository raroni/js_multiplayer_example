var DeltaHelper = require('./shared/delta_helper');

function DeltaGenerator(oldState, newState) {
  this.oldState = oldState;
  this.newState = newState;
  this.result = {};
}

DeltaGenerator.prototype = {
  execute: function() {
    for(var collectionKey in this.newState) {
      this.checkCollection(collectionKey);
    }
  },
  checkCollection: function(collectionKey) {
    var collection = this.oldState[collectionKey];
    var uncheckedNewEntities = this.newState[collectionKey];

    collection.forEach(function(oldEntity) {
      var newEntity = DeltaHelper.findEntity(this.newState[collectionKey], oldEntity.id);
      uncheckedNewEntities.splice(uncheckedNewEntities.indexOf(newEntity), 1);
      if(newEntity) {
        for(var attributeKey in newEntity) {
          if(attributeKey != 'id') {
            var attributeDelta = this.createAttributeDelta(oldEntity[attributeKey], newEntity[attributeKey]);
            if(attributeDelta) this.saveChange(collectionKey, newEntity.id, attributeKey, attributeDelta);
          }
        }
      } else {
        this.saveDeletion(collectionKey, oldEntity.id);
      }
    }.bind(this));
    if(uncheckedNewEntities.length) {
      uncheckedNewEntities.forEach(function(entity) {
        this.saveInsertion(collectionKey, entity);
      }.bind(this));
    }
  },
  saveInsertion: function(collectionKey, entity) {
    if(!this.result.insertions) this.result.insertions = {};
    if(!this.result.insertions[collectionKey]) this.result.insertions[collectionKey] = [];
    this.result.insertions[collectionKey].push(entity);
  },
  saveDeletion: function(collectionKey, entityId) {
    if(!this.result.deletions) this.result.deletions = {};
    if(!this.result.deletions[collectionKey]) this.result.deletions[collectionKey] = [];
    this.result.deletions[collectionKey].push(entityId);
  },
  saveChange: function(collectionKey, entityId, attributeKey, attributeDelta) {
    if(!this.result.changes) this.result.changes = {};
    if(!this.result.changes[collectionKey]) this.result.changes[collectionKey] = {};
    if(!this.result.changes[collectionKey][entityId]) this.result.changes[collectionKey][entityId] = {};
    this.result.changes[collectionKey][entityId][attributeKey] = attributeDelta;
  },
  createAttributeDelta: function(oldValue, newValue) {
    var oldType = typeof(oldValue);
    var newType = typeof(newValue);
    if(oldType != newType) throw new Error('Types does not match.');
    var type = oldType;

    if(oldValue != newValue) {
      var delta;
      switch(type) {
        case 'number':
        delta = newValue - oldValue;
        break;
        case 'string':
        delta = newValue;
        break;
        default:
        throw new Error('I cannot yet make delta of type "' + type + '".');
        break;
      }
      return delta;
    }
  }
};

exports.generate = function(oldState, newState) {
  var generator = new DeltaGenerator(oldState, newState);
  generator.execute();
  return generator.result;
};
