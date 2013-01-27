(function() {
  function DeltaApplicator(oldState, delta) {
    this.oldState = oldState;
    this.delta = delta;
    this.result = JSON.parse(JSON.stringify(oldState));
  }

  DeltaApplicator.prototype = {
    execute: function() {
      if(this.delta.changes) this.applyChanges();
    },
    applyChanges: function() {
      var changes = this.delta.changes;
      for(var collectionKey in changes) {
        var collectionChanges = changes[collectionKey];
        for(var entityId in collectionChanges) {
          var entity = DeltaHelper.findEntity(this.result[collectionKey], entityId);
          for(var attributeKey in collectionChanges[entityId]) {
            this.applyChange(entity, attributeKey, collectionChanges[entityId][attributeKey]);
          }
        }
      }
    },
    applyChange: function(entity, attributeKey, attributeChange) {
      console.log(entity.id, attributeKey, attributeChange)
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
