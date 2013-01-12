function Connection(state) {
  this.socket = new WebSocket('ws://localhost:3000')
  this.socket.onmessage = this.onMessage.bind(this)
  this.world = state.world
  this.state = state
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
    var PlayerConstructor = message.you ? LocalPlayer : Player
    var player = new PlayerConstructor(message.player)
    this.world.players.add(player)
    if(message.you) this.state.player = player
  },
  onCommandAcknowledgementMessage: function(message) {
    this.state.player.acknowledgeCommands(message.state, message.lastAcknowledgedCommandId)
  },
  onSnapshotMessage: function(message) {
    var playerData = message.snapshot
    playerData.forEach(function(playerData) {
      if(!this.state.player || playerData.id != this.state.player.id) {
        var player = this.world.players.byId[playerData.id]
        if(player) {
          player.position.x = playerData.position.x
          player.position.y = playerData.position.y
        }
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
  }
}
