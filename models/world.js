var SharedWorld = require('../shared/world');
var Player = require('./player');

function World() {
  SharedWorld.call(this);
  this.addCollectionListeners();
}
World.prototype = Object.create(SharedWorld.prototype);

World.prototype.entityConstructors = {
  'players': Player
}

World.prototype.update = function(timeDelta) {
  this.players.forEach(function(player) {
    player.applyCommands();
  });
};

World.prototype.addCollectionListeners = function() {
  ['players'].forEach(function(collectionName) {
    var collection = this[collectionName];
    collection.on('add', function(entity) {
      this.emit('addEntity', entity, collectionName);
    }.bind(this));

    collection.on('remove', function(entity) {
      this.emit('removeEntity', entity, collectionName);
    }.bind(this));

    collection.on('change', function(entity, attribute) {
      this.emit('changeEntity', entity, attribute, collectionName);
    }.bind(this));
  }.bind(this));
}

World.prototype.toHash = function() {
  var hash = {
    players: []
  };

  this.players.forEach(function(player) {
    var playerHash = player.toHash();
    hash.players.push(playerHash);
  });

  return hash;
};

module.exports = World;
