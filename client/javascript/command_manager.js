function CommandManager(keyboard, connection, state) {
  this.connection = connection;
  this.keyboard = keyboard;
  this.nextId = 1;
  this.state = state;
  this.dispatcher = new CommandDispatcher(connection);
  this.applicator = new CommandApplicator(state);
}

CommandManager.prototype = {
  update: function(timeDelta) {
    if(this.state.player) this.check(timeDelta);
  },
  check: function(timeDelta) {
    var command = this.queryCommand(timeDelta);
    if(command) {
      this.dispatcher.add(command);
      this.applicator.add(command);
    }

    this.dispatcher.update(timeDelta);
  },
  queryCommand: function(timeDelta) {
    var keysPressed = [];
    var keyNames = ['left', 'right', 'up', 'down'];
    keyNames.forEach(function(keyName) {
      if(this.keyboard.pressed[keyName]) keysPressed.push(keyName);
    }.bind(this));

    if(keysPressed.length != 0) {
      var command = { timeDelta: timeDelta, id: this.nextId++ };
      keysPressed.forEach(function(keyName) {
        command[keyName] = true;
      })
      return command;
    }
  },
  acknowledgeCommands: function(state, lastAcknowledgedCommandId) {
    this.applicator.acknowledgeCommands(state, lastAcknowledgedCommandId);
  }
};
