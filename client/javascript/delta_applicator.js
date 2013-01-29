(function() {
  function DeltaApplicator(oldState, delta) {
    this.oldState = oldState;
    this.delta = delta;
    this.result = JSON.parse(JSON.stringify(oldState));
  }

  DeltaApplicator.prototype = {
    execute: function() {
      if(this.delta.changes) this.applyChanges();
      if(this.delta.insertions) this.applyInsertions();
      if(this.delta.deletions) this.applyDeletions();
    },
    applyChanges: function() {
      var collectionChanges, entity, entityId, attributeKey;
      var changes = this.delta.changes;
      for(var collectionKey in changes) {
        collectionChanges = changes[collectionKey];
        for(entityId in collectionChanges) {
          entity = DeltaHelper.findEntity(this.result[collectionKey], entityId);
          for(attributeKey in collectionChanges[entityId]) {
            this.applyChange(entity, attributeKey, collectionChanges[entityId][attributeKey]);
          }
        }
      }
    },
    applyChange: function(entity, attributeKey, attributeChange) {
      var oldValue = entity[attributeKey];
      var type = typeof(oldValue);
      var newValue;

      switch(type) {
        case "number":
        newValue = oldValue + attributeChange;
        break;
        default:
        throw new Error("I don't know how to apply changes of type '" + type + "'.");
        break;
      }

      entity[attributeKey] = newValue;
    },
    applyInsertions: function() {
      var collectionInsertions;
      var insertions = this.delta.insertions;
      for(var collectionKey in insertions) {
        collectionInsertions = insertions[collectionKey];
        collectionInsertions.forEach(function(entity) {
          this.applyInsert(collectionKey, entity);
        }.bind(this));
      }
    },
    applyInsert: function(collectionKey, entity) {
      if(!this.result[collectionKey]) this.result[collectionKey] = [];
      this.result[collectionKey].push(entity);
    },
    applyDeletions: function() {
      var collectiondeletions;
      var deletions = this.delta.deletions;
      for(var collectionKey in deletions) {
        collectiondeletions = deletions[collectionKey];
        collectiondeletions.forEach(function(entityId) {
          this.applyDeletion(collectionKey, entityId);
        }.bind(this));
      }
    },
    applyDeletion: function(collectionKey, entityId) {
      var entity;
      var collection = this.result[collectionKey];
      for(var i=0; collection.length>i; i++) {
        entity = collection[i];
        if(entity.id == entityId) {
          collection.splice(i, 1);
          return;
        }
      }
      throw new Error('Could not apply delete.');
    }
  };

  window.DeltaApplicator = {
    apply: function(oldState, delta) {
      var applicator = new DeltaApplicator(oldState, delta);
      applicator.execute();
      return applicator.result;
    }
  };
})();
