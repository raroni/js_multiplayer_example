function CommandDispatcher(connection) {
  this.resetQueue()
  this.connection = connection
  this.interval = 1000
  this.timeUntilNextDispatch = this.interval
}

CommandDispatcher.prototype = {
  add: function(command) {
    this.queue.push(command)
  },
  update: function(timeDelta) {
    this.timeUntilNextDispatch -= timeDelta
    if(this.timeUntilNextDispatch <= 0) {
      this.dispatch()
      this.timeUntilNextDispatch += this.interval
    }
  },
  dispatch: function() {
    if(this.queue.length != 0) {
      this.connection.sendCommands(this.queue)
      this.resetQueue()
    }
  },
  resetQueue: function() {
    this.queue = []
  }
}
