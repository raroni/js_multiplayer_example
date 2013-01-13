function CommandDispatcher(keyboard, connection, state) {
  this.state = state
  this.connection = connection
  this.keyboard = keyboard
  this.dispatchInterval = 1000
  this.timeUntilNextDispatch = this.dispatchInterval
  this.commands = []
  this.nextId = 1
}

CommandDispatcher.prototype = {
  update: function(timeDelta) {
    var command = this.queryCommand(timeDelta)
    if(command) {
      this.commands.push(command)
      this.state.player.applyCommandAndSaveState(command)
    }
    this.timeUntilNextDispatch -= timeDelta
    if(this.timeUntilNextDispatch <= 0) {
      this.dispatch()
      this.timeUntilNextDispatch += this.dispatchInterval
    }
  },
  dispatch: function() {
    if(this.commands.length != 0) {
      this.connection.sendCommands(this.commands)
      this.commands = []
    }
  },
  queryCommand: function(timeDelta) {
    var keysPressed = []
    var keyNames = ['left', 'right', 'up', 'down']
    keyNames.forEach(function(keyName) {
      if(this.keyboard.pressed[keyName]) keysPressed.push(keyName)
    }.bind(this))

    if(keysPressed.length != 0) {
      var command = { timeDelta: timeDelta, id: this.nextId++ }
      keysPressed.forEach(function(keyName) {
        command[keyName] = true
      })
      return command
    }
  }
}
