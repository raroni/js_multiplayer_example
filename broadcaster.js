function Broadcaster(world, streamingServer) {
  console.log('Broadcaster inited.')
  this.world = world
  world.players.on('new', this.newPlayer.bind(this))
  world.players.on('remove', this.removePlayer.bind(this))
  this.streamingServer = streamingServer
  setInterval(this.performSnapshot.bind(this), 500)
}

Broadcaster.prototype = {
  newPlayer: function(player) {
    this.streamingServer.connections.forEach(function(connection) {
      var you = connection.player == player
      connection.sendNewPlayerMessage(player, you)
    })
  },
  removePlayer: function(player) {
    var message = {
      type: 'removePlayer',
      playerId: player.id
    }
    this.streamingServer.connections.forEach(function(connection) {
      connection.sendMessage(message)
    }.bind(this))
  },
  performSnapshot: function() {
    var snapshot = this.buildSnapshot()
    this.streamingServer.connections.forEach(function(connection) {
      connection.sendSnapshot(snapshot)
    }.bind(this))
  },
  buildSnapshot: function() {
    var snapshot = []
    this.world.players.forEach(function(player) {
      var playerData = {
        id: player.id,
        position: player.position.toJSON()
      }
      snapshot.push(playerData)
    })
    return snapshot
  }
}

module.exports = Broadcaster
