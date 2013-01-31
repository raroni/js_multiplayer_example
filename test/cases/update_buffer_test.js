var Snitch = require('snitch');
var World = require('../../models/world');
var UpdateBuffer = require('../../update_buffer');

function UpdateBufferTest(name) {
  Snitch.TestCase.call(this, name);
}

UpdateBufferTest.prototype = Object.create(Snitch.TestCase.prototype);

UpdateBufferTest.prototype['test adds'] = function() {
  var world = new World();
  var updateBuffer = new UpdateBuffer(world);

  var player = world.players.build({ id: 1, name: 'Rasmus' });
  world.players.add(player);

  var expected = {
    players: [player.toHash()]
  };

  this.assertDeepEqual(expected, updateBuffer.data.adds);
  updateBuffer.clear();
  this.refute(updateBuffer.data);
};

UpdateBufferTest.prototype['test removes'] = function() {
  var world = new World();
  var player = world.players.build({ id: 1, name: 'Rasmus' });
  world.players.add(player);
  var updateBuffer = new UpdateBuffer(world);
  world.players.remove(player);

  var expected = {
    players: [1]
  };

  this.assertDeepEqual(expected, updateBuffer.data.removes);
  updateBuffer.clear();
  this.refute(updateBuffer.data);
};

UpdateBufferTest.prototype['test changes'] = function() {
  var world = new World();
  var updateBuffer = new UpdateBuffer(world);
  var player = world.players.build({ id: 1, name: 'Rasmus' });
  world.players.add(player);
  player.setProperty('name', 'Sumsar');

  var expected = {
    players: {
      1: {
        name: 'Sumsar'
      }
    }
  };

  this.assertDeepEqual(expected, updateBuffer.data.changes);
  updateBuffer.clear();
  this.refute(updateBuffer.data);
};

module.exports = UpdateBufferTest;
