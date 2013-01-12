var WebSocketServer = require('websocket').server
var StreamingServerConnection = require('./streaming_server/connection')

function StreamingServer(httpServer, world) {
  this.world = world
  var wsServer = new WebSocketServer({ httpServer: httpServer })
  wsServer.on('request', this.onRequest.bind(this))
  this.connections = []
}

StreamingServer.prototype = {
  onRequest: function(request) {
    if(!originIsAllowed(request.origin)) {
      request.reject()
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.')
      return
    }
    var wsConnection = request.accept('', request.origin)
    var connection = new StreamingServerConnection(wsConnection, this.world)
    connection.on('close', function() {
      this.onClose(connection)
    }.bind(this))
    this.connections.push(connection)
    connection.createPlayer()
  },
  onClose: function(connection) {
    var index = this.connections.indexOf(connection)
    if(index === -1) throw new Error("Cannot remove connection because it isn't registered.")
    this.connections.splice(index, 1)
  }
}

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true
}

module.exports = StreamingServer
