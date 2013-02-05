(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Vector2, EventEmitter;
  if(isNode) {
    Vector2 = require('./vector2');
    EventEmitter = require('./event_emitter')
  } else {
    Vector2 = window.Vector2;
    EventEmitter = window.EventEmitter;
  }

  function Player(options) {
    this.attributeNames.forEach(function(key) {
      if(options[key]) this[key] = options[key];
    }.bind(this));
  }

  Player.prototype = Object.create(EventEmitter);

  Player.prototype.applyCommand = function(command) {
    if(command.left)
      this.setProperty('positionX', this.positionX-1);

    if(command.right)
      this.setProperty('positionX', this.positionX+1);

    if(command.up)
      this.setProperty('positionY', this.positionY-1);

    if(command.down)
      this.setProperty('positionY', this.positionY+1);
  };

  Player.prototype.getPosition = function() {
    var position = new Vector2(this.positionX, this.positionY);
    return position;
  };

  Player.prototype.setPosition = function(position) {
    this.positionX = position.x;
    this.positionY = position.y;
  };

  Player.prototype.setProperty = function(key, value) {
    this[key] = value;
    this.emit('change', key);
  };

  Player.prototype.set = function(hash) {
    for(var key in hash) {
      this.setProperty(key, hash[key]);
    }
  }

  Player.prototype.attributeNames = ['id', 'name', 'positionX', 'positionY'];

  if(isNode) module.exports = Player;
  else window.Player = Player;
})();
