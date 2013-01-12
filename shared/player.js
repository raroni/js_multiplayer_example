(function() {
  var isNode = typeof(exports) !== 'undefined'
  var Vector2
  if(isNode) Vector2 = require('../shared/vector2')
  else Vector2 = window.Vector2

  function Player(options) {
    if(options.id)
      this.id = options.id
      if(options.name)
        this.name = options.name
    if(options.position) 
      this.position = new Vector2(options.position.x, options.position.y)
  }

  Player.prototype = {
    applyCommand: function(command) {
      if(command.left)
        this.position.x -= 1

      if(command.right)
        this.position.x += 1

      if(command.up)
        this.position.y -= 1

      if(command.down)
        this.position.y += 1
    }
  }

  if(isNode) module.exports = Player
  else window.Player = Player
})()
