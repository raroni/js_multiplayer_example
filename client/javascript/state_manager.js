function StateManager(world, commandManager) {
  this.world = world;
  this.remotePlayerInterpolators = new Collection;
  this.commandManager = commandManager;
}

StateManager.prototype = {
  update: function(timeDelta) {
    this.remotePlayerInterpolators.forEach(function(remotePlayerInterpolator) {
      remotePlayerInterpolator.update(timeDelta);
    });
  },
  applyDelta: function(delta) {
    if(delta.insertions) this.applyInsertions(delta.insertions);
    if(delta.changes) this.applyChanges(delta.changes);
    if(delta.deletions) this.applyDeletions(delta.deletions);
  },
  applyChanges: function(changes) {
    if(changes.players) {
      var playerChanges;
      for(var playerId in changes.players) {
        playerChanges = changes.players[playerId];
        if((playerChanges.positionX || playerChanges.positionY) && playerId != this.player.id) {
          var positionChange = new Vector2(playerChanges.positionX || 0, playerChanges.positionY || 0);
          var interpolator = this.remotePlayerInterpolators.find(playerId);
          interpolator.receive(positionChange);
        }
      }
    }
  },
  applyInsertions: function(insertions) {
    var collectionInsertions;
    for(collectionKey in insertions) {
      collectionInsertions = insertions[collectionKey];
      collection = this.world[collectionKey];
      collectionInsertions.forEach(function(collectionInsertion) {
        var entity = collection.build(collectionInsertion);
        if(collectionKey == 'players') this.addPlayer(entity);
      }.bind(this));
    }
  },
  addPlayer: function(player) {
    this.world[collectionKey].add(player);
    var remotePlayerInterpolator = new RemotePlayerInterpolator(player);
    remotePlayerInterpolator.id = player.id;
    this.remotePlayerInterpolators.add(remotePlayerInterpolator);
  },
  applyDeletions: function(deletions) {
    var collectionDeletions, collection, entity;
    for(var collectionKey in deletions) {
      collectionDeletions = deletions[collectionKey];
      collectionDeletions.forEach(function(entityId) {
        collection = this.world[collectionKey];
        entity = collection.find(entityId);
        collection.remove(entity);
      }.bind(this));
    }
  }
};
