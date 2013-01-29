function Client(document) {
  this.connection = new Connection();
  this.networkAnalyzer = new NetworkAnalyzer(this.connection);
  var world = new World;

  this.state = {
    world: world,
    networkAnalyzer: this.networkAnalyzer
  };


  var keyboard = new Keyboard(document);
  this.commandManager = new CommandManager(keyboard, this.connection, this.state);

  this.stateManager = new StateManager(world, this.commandManager);

  /* THIS IS VERY UGLY AND SHOULD BE REMOVED WHEN CONTROLLER HAS BEEN MADE */
  this.connection.state = this.state;
  this.connection.world = world;
  this.connection.stateManager = this.stateManager;
  /* ***********************************************************************/

  this.view = new View(this.state, document);

}

Client.prototype = {
  start: function() {
    this.scheduleNextTick();
  },
  update: function(timeDelta) {
    // should probably be replaced with a event driven approach?
    if(this.state.player && !this.commandManager.started) {
      this.stateManager.player = this.state.player;
      this.commandManager.start(this.state.player);
    }

    if(this.commandManager.started) this.commandManager.update(timeDelta);
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
