(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Vector2;
  if(isNode) Vector2 = require('../shared/vector2');
  else Vector2 = window.Vector2;

  function Player(options) {
    ['id', 'name', 'positionX', 'positionY'].forEach(function(key) {
      if(options[key]) this[key] = options[key];
    }.bind(this));
  }

  Player.prototype = {
    applyCommand: function(command) {
      if(command.left)
        this.positionX -= 1

      if(command.right)
        this.positionX += 1

      if(command.up)
        this.positionY -= 1

      if(command.down)
        this.positionY += 1
    },
    getPosition: function() {
      var position = new Vector2(this.positionX, this.positionY);
      return position;
    },
    setPosition: function(position) {
      this.positionX = position.x;
      this.positionY = position.y;
    }
  };

  if(isNode) module.exports = Player;
  else window.Player = Player;
})();
