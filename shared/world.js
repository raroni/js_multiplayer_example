(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Collection, Player;
  if(isNode) {
    Collection = require('../collection');
    Player = require('../models/player');
  } else {
    Collection = window.Collection;
    Player = window.Player;
  }

  function World() {
    this.players = new Collection({ entityConstructor: Player });
  }

  World.prototype = {

  };

  if(isNode) module.exports = World;
  else window.World = World;
})();
