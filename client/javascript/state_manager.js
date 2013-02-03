function StateManager(world) {
  this.world = world;
  this.remotePlayerInterpolators = new Collection;
}

StateManager.prototype = {
  applySnapshot: function(snapshot) {
    console.log('applying snapshot');
    var collection, collectionData, entity;
    for(var collectionName in snapshot) {
      collectionData = snapshot[collectionName];
      collection = this.world[collectionName];
      collectionData.forEach(function(entityData) {
        entity = collection.build(entityData);
        this.addEntity(entity, collection);
      }.bind(this));
    }
    console.log('done');
  },
  applyUpdate: function(update) {
    if(update.changes) this.applyChanges(update.changes);
    if(update.adds) this.applyAdds(update.adds);
    if(update.removes) this.applyRemoves(update.removes);
  },
  applyAdds: function(adds) {
    var collectionName, collectionChanges, collection;
    for(collectionName in adds) {
      collectionAdds = adds[collectionName];
      collection = this.world[collectionName];
      collectionAdds.forEach(function(entityData) {
        var entity = collection.build(entityData);
        this.addEntity(entity, collection);
      }.bind(this));
    }
  },
  applyRemoves: function(removes) {
    var collectionName, collectionChanges, collection;
    for(collectionName in removes) {
      collectionRemoves = removes[collectionName];
      collection = this.world[collectionName];
      collectionRemoves.forEach(function(entityId) {
        var entity = collection.find(entityId);
        collection.remove(entity);
      }.bind(this));
    }
  },
  addEntity: function(entity, collection) {
    collection.add(entity);
    if(collection.name === 'players' && entity.id != this.playerId) this.setupRemotePlayerInterpolator(entity);
  },
  update: function(timeDelta) {
    this.remotePlayerInterpolators.forEach(function(remotePlayerInterpolator) {
      remotePlayerInterpolator.update(timeDelta);
    });
  },
  applyChanges: function(changes) {
    var collectionName, collectionChanges, collection, entityId, entity, entityChanges;
    for(collectionName in changes) {
      collectionChanges = changes[collectionName];
      collection = this.world[collectionName];
      for(entityId in collectionChanges) {
        entityChanges = collectionChanges[entityId];
        entity = collection.find(entityId);
        if(collectionName === 'players')
          this.applyChangesToPlayer(entity, entityChanges);
        else
          entity.set(entityChanges);
      }
    }
  },
  applyChangesToPlayer: function(player, changes) {
    for(var attribute in changes) {
      if(attribute !== 'positionX' && attribute !== 'positionY') {
        player.setProperty(attribute, changes[attribute]);
      }
    }
    if(changes.positionX || changes.positionY) {
      var newCoordinates = {};
      if(changes.positionX) newCoordinates.x = changes.positionX;
      if(changes.positionY) newCoordinates.y = changes.positionY;
      this.remotePlayerInterpolators.find(player.id).receive(newCoordinates);
    }
  },
  setupRemotePlayerInterpolator: function(player) {
    var remotePlayerInterpolator = new RemotePlayerInterpolator(player);
    remotePlayerInterpolator.id = player.id;
    this.remotePlayerInterpolators.add(remotePlayerInterpolator);
  }
};
