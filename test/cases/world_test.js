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

WorldTest.prototype['test addEntity event'] = function() {
  var player = new Player({ id: 1, name: 'Rasmus', age: 26 });
  var world = new World();
  var callbackEntity, callbackCollectionKey;
  world.on('addEntity', function(entity, collectionName) {
    callbackEntity = entity;
    callbackCollectionKey = collectionName;
  });
  world.players.add(player);

  this.assertEqual(player, callbackEntity);
  this.assertEqual('players', callbackCollectionKey);
}

WorldTest.prototype['test removeEntity event'] = function() {
  var player = new Player({ id: 1, name: 'Rasmus', age: 26 });
  var world = new World();
  world.players.add(player);
  var callbackEntity, callbackCollectionKey;
  world.on('removeEntity', function(entity, collectionName) {
    callbackEntity = entity;
    callbackCollectionKey = collectionName;
  });
  world.players.remove(player);

  this.assertEqual(player, callbackEntity);
  this.assertEqual('players', callbackCollectionKey);
}

WorldTest.prototype['test changeEntity event'] = function() {
  var player = new Player({ id: 1, name: 'Rasmus', age: 26 });
  var world = new World();
  world.players.add(player);
  var callbackEntity, callbackAttribute, callbackCollectionKey;
  world.on('changeEntity', function(entity, attribute, collectionName) {
    callbackEntity = entity;
    callbackAttribute = attribute;
    callbackCollectionKey = collectionName;
  });
  player.setProperty('name', 'Sumsar');

  this.assertEqual(player, callbackEntity);
  this.assertEqual('name', callbackAttribute);
  this.assertEqual('players', callbackCollectionKey);
}


module.exports = WorldTest;
