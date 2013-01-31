function Client(document) {
  var world = new World;
  var keyboard = new Keyboard(document);
  this.stateManager = new StateManager(world);
  var connection = new Connection(document.location.host);
  this.networkAnalyzer = new NetworkAnalyzer(connection);

  var state = {
    world: world,
    network: this.networkAnalyzer
  };

  this.commandManager = new CommandManager(keyboard, connection, state);
  var controller = new Controller(state, this.stateManager, this.commandManager);

  connection.controller = controller;
  this.view = new View(state, document);
}

Client.prototype = {
  start: function() {
    this.scheduleNextTick();
  },
  update: function(timeDelta) {
    this.commandManager.update(timeDelta);
    this.networkAnalyzer.update(timeDelta);
    this.stateManager.update(timeDelta);
    this.view.update(timeDelta);
  },
  tick: function(timestamp) {
    if(this.lastTickAt) {
      var timeDelta = Math.round(timestamp-this.lastTickAt);
      this.update(timeDelta);
    }
    this.lastTickAt = timestamp;
    this.scheduleNextTick();
  },
  scheduleNextTick: function() {
    requestAnimationFrame(this.tick.bind(this));
  }
};
