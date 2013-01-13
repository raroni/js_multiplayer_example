function Connection(state, remotePlayerInterpolators, commandApplicator) {
  this.socket = new WebSocket('ws://localhost:3000')
  this.socket.onmessage = this.onMessage.bind(this)
  this.world = state.world
  this.state = state
  this.remotePlayerInterpolators = remotePlayerInterpolators
  this.commandApplicator = commandApplicator
}

Connection.prototype = {
  onMessage: function(messageObject) {
    var message = JSON.parse(messageObject.data)
    if(!message.type) throw new Error('Message from server had no type.')
    var type = message.type
    var methodName = 'on' + type.charAt(0).toUpperCase() + type.slice(1) + 'Message'
    if(this[methodName])
      this[methodName](message)
    else
      throw new Error("Server message of type '" + message.type + "' not understood.")
  },
  sendMessage: function(message) {
    var messageAsString = JSON.stringify(message)
    this.socket.send(messageAsString)
  },
  onNewPlayerMessage: function(message) {
    var player = new Player(message.player)
    this.world.players.add(player)
    if(message.you) {
      this.state.player = player
    } else {
      var remotePlayerInterpolator = new RemotePlayerInterpolator(player)
      remotePlayerInterpolator.id = player.id
      this.remotePlayerInterpolators.add(remotePlayerInterpolator)
    }
  },
  onCommandAcknowledgementMessage: function(message) {
    this.commandApplicator.acknowledgeCommands(message.state, message.lastAcknowledgedCommandId)
  },
  onSnapshotMessage: function(message) {
    var playerData = message.snapshot
    playerData.forEach(function(playerData) {
      if(!this.state.player || playerData.id != this.state.player.id) {
        var interpolator = this.remotePlayerInterpolators.byId[playerData.id]
        if(interpolator) interpolator.receive(playerData)
      }
    }.bind(this))
  },
  sendCommands: function(commands) {
    var message = {
      type: 'commands',
      commands: commands
    }

    this.sendMessage(message)
  },
  onRemovePlayerMessage: function(message) {
    var player = this.world.players.byId[message.playerId]
    this.world.players.remove(player)

    var interpolator = this.remotePlayerInterpolators.byId[message.playerId]
    this.remotePlayerInterpolators.remove(interpolator)
  }
}
