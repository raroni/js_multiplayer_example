var SharedWorld = require('../shared/world');

function World() {
  SharedWorld.call(this);
}
World.prototype = Object.create(SharedWorld);

World.prototype.update = function(timeDelta) {
  this.players.forEach(function(player) {
    player.applyCommands();
  });
};

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
