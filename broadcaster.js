function Broadcaster(world, streamingServer) {
  console.log('Broadcaster inited.');
  this.world = world;
  this.streamingServer = streamingServer;
  setInterval(this.updateClients.bind(this), 100);
}

Broadcaster.prototype = {
  updateClients: function() {
    var state = this.world.toHash();
    this.streamingServer.connections.forEach(function(connection) {
      connection.sendState(state);
    });
  }
};

module.exports = Broadcaster;
