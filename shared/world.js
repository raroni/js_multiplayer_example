(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Collection;
  if(isNode) Collection = require('../collection');
  else Collection = window.Collection;

  function World() {
    this.players = new Collection;
  }

  World.prototype = {

  };

  if(isNode) module.exports = World;
  else window.World = World;
})();
