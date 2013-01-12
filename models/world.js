var SharedWorld = require('../shared/world')

function World() {
  SharedWorld.call(this)
}
World.prototype = Object.create(SharedWorld)

World.prototype.update = function(timeDelta) {
  this.players.forEach(function(player) {
    player.applyCommands()
  })
}

module.exports = World
