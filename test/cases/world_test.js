var Snitch = require('snitch');
var World = require('../../models/world');
var Player = require('../../models/player');

function WorldTest(name) {
  Snitch.TestCase.call(this, name);
}

WorldTest.prototype = Object.create(Snitch.TestCase.prototype);

WorldTest.prototype['test to hash'] = function() {
  var world = new World();
  var player1 = new Player({ id: 1, name: 'Rasmus', positionX: 100, positionY: 200 });
  world.players.add(player1);
  var player2 = new Player({ id: 2, name: 'John', positionX: 200, positionY: 100 });
  world.players.add(player2);

  var hash = world.toHash();

  var expected = {
    players: [
      { id: 1, name: 'Rasmus', positionX: 100, positionY: 200 },
      { id: 2, name: 'John', positionX: 200, positionY: 100 }
    ]
  }

  this.assertDeepEqual(expected, hash);
};

module.exports = WorldTest;
