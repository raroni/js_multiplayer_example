function LocalPlayer(options) {
  Player.call(this, options)
  this.unacknowledgedCommands = []
}

LocalPlayer.prototype = Object.create(Player.prototype)

LocalPlayer.prototype.applyCommandAndSaveState = function(command) {
  this.applyCommand(command)
  this.unacknowledgedCommands.push(command)
}

LocalPlayer.prototype.acknowledgeCommands = function(state, lastAcknowledCommandId) {
  while(this.unacknowledgedCommands.length && this.unacknowledgedCommands[0].id <= lastAcknowledCommandId)
    this.unacknowledgedCommands.shift()

  this.position.x = state.position.x
  this.position.y = state.position.y
  this.unacknowledgedCommands.forEach(this.applyCommand.bind(this))
}
