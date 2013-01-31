var UpdateBuffer = require('./update_buffer');

function Broadcaster(world, streamingServer) {
  this.updateBuffer = new UpdateBuffer(world);
  this.streamingServer = streamingServer;
  setInterval(this.updateClients.bind(this), 100);
}

Broadcaster.prototype = {
  updateClients: function() {
    var update = this.updateBuffer.data;
    if(update) {
      this.streamingServer.connections.forEach(function(connection) {
        connection.onUpdate(update);
      });
      this.updateBuffer.clear();
    }
  }
};

module.exports = Broadcaster;
