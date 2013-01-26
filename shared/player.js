(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Vector2;
  if(isNode) Vector2 = require('../shared/vector2');
  else Vector2 = window.Vector2;

  function Player(options) {
    ['id', 'name', 'position_x', 'position_y'].forEach(function(key) {
      if(options[key]) this[key] = options[key];
    }.bind(this));
  }

  Player.prototype = {
    applyCommand: function(command) {
      if(command.left)
        this.position_x -= 1

      if(command.right)
        this.position_x += 1

      if(command.up)
        this.position_y -= 1

      if(command.down)
        this.position_y += 1
    },
    getPosition: function() {
      var position = new Vector2(this.position_x, this.position_y);
      return position;
    },
    setPosition: function(position) {
      this.position_x = position.x;
      this.position_y = position.y;
    }
  };

  if(isNode) module.exports = Player;
  else window.Player = Player;
})();
