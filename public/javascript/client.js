function Client(document) {
  var world = new World
  this.state = { world: world }

  this.view = new View(world, document)
  this.remotePlayerInterpolators = new Collection
  this.connection = new Connection(this.state, this.remotePlayerInterpolators)
  var keyboard = new Keyboard(document)
  this.commandDispatcher = new CommandDispatcher(keyboard, this.connection, this.state)
}

Client.prototype = {
  start: function() {
    this.scheduleNextTick()
  },
  update: function(timeDelta) {
    if(this.state.player) this.commandDispatcher.update(timeDelta)
    this.remotePlayerInterpolators.forEach(function(remotePlayerInterpolator) {
      remotePlayerInterpolator.update(timeDelta)
    })
    this.view.update(timeDelta)
  },
  tick: function(timestamp) {
    if(this.lastTickAt) {
      var timeDelta = timestamp-this.lastTickAt
      this.update(timeDelta)
    }
    this.lastTickAt = timestamp
    this.scheduleNextTick()
  },
  scheduleNextTick: function() {
    requestAnimationFrame(this.tick.bind(this))
  }
}
