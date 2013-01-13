function CommandManager(keyboard, connection) {
  this.connection = connection
  this.keyboard = keyboard
  this.nextId = 1
}

CommandManager.prototype = {
  start: function(player) {
    this.dispatcher = new CommandDispatcher(this.connection)
    this.applicator = new CommandApplicator(player)
    this.connection.commandApplicator = this.applicator
    this.started = true
  },
  update: function(timeDelta) {
    var command = this.queryCommand(timeDelta)

    if(command) {
      this.dispatcher.add(command)
      this.applicator.add(command)
    }

    this.dispatcher.update(timeDelta)
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
