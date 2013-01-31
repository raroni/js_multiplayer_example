function Controller(state, stateManager, commandManager) {
  this.state = state;
  this.stateManager = stateManager,
  this.world = state.world;
  this.commandManager = commandManager;
}

Controller.prototype = {
  onWelcomeMessage: function(message) {
    var snapshot = message.snapshot;
    this.stateManager.playerId = message.playerId;
    this.stateManager.applySnapshot(snapshot);
    this.state.player = this.world.players.find(message.playerId);
    this.stateManager.player = this.state.player;
  },
  onCommandAcknowledgementMessage: function(message) {
    this.commandManager.acknowledgeCommands(message.state, message.lastAcknowledgedCommandId);
  },
  onUpdateMessage: function(message) {
    this.stateManager.applyUpdate(message.update);
  }
};
