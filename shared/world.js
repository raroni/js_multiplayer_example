(function() {
  var isNode = typeof(exports) !== 'undefined';
  var EntityCollection, Player, EventEmitter;
  if(isNode) {
    EntityCollection = require('../shared/entity_collection');
    Player = require('./player');
    EventEmitter = require('../shared/event_emitter');
  } else {
    EntityCollection = window.EntityCollection;
    Player = window.Player;
    EventEmitter = window.EventEmitter;
  }

  function World() {
    this.collectionNames.forEach(function(collectionName) {
      var collectionOptions = {
        name: collectionName,
        entityConstructor: this.entityConstructors[collectionName]
      };
      this[collectionName] = new EntityCollection(collectionOptions);
    }.bind(this));
  }

  World.prototype = Object.create(EventEmitter);

  World.prototype.collectionNames = ['players'];

  if(isNode) module.exports = World;
  else window.SharedWorld = World;
})();
