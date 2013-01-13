function CommandApplicator(player) {
  this.unacknowledgedCommands = []
  this.player = player
}

CommandApplicator.prototype = {
  add: function(command) {
    this.unacknowledgedCommands.push(command)
    this.player.applyCommand(command)
  },
  acknowledgeCommands: function(state, lastAcknowledCommandId) {
    while(this.unacknowledgedCommands.length && this.unacknowledgedCommands[0].id <= lastAcknowledCommandId)
      this.unacknowledgedCommands.shift()

    this.player.position.x = state.position.x
    this.player.position.y = state.position.y
    this.unacknowledgedCommands.forEach(this.player.applyCommand.bind(this.player))
  }
}
