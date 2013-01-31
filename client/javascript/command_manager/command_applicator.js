function CommandApplicator(state) {
  this.unacknowledgedCommands = [];
  this.state = state;
}

CommandApplicator.prototype = {
  add: function(command) {
    this.unacknowledgedCommands.push(command);
    this.state.player.applyCommand(command);
  },
  acknowledgeCommands: function(state, lastAcknowledCommandId) {
    while(this.unacknowledgedCommands.length && this.unacknowledgedCommands[0].id <= lastAcknowledCommandId)
      this.unacknowledgedCommands.shift();

    this.state.player.positionX = state.positionX;
    this.state.player.positionY = state.positionY;
    this.unacknowledgedCommands.forEach(this.state.player.applyCommand.bind(this.state.player));
  }
};
