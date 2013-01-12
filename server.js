var StaticServer = require('node-static').Server
var http = require('http')
var StreamingServer = require('./streaming_server')
var World = require('./models/World')
var Broadcaster = require('./broadcaster')

function Server() {
  this.world = new World
  this.setupHttpServer()
  var streamingServer = new StreamingServer(this.httpServer, this.world)
  this.broadcaster = new Broadcaster(this.world, streamingServer)
}

Server.prototype = {
  start: function() {
    this.httpServer.listen(3000)
    console.log('Listening on port 3000')
    setInterval(this.tick.bind(this), 33)
    console.log('Starting game loop.')
  },
  tick: function() {
    var now = new Date
    if(this.lastTickAt) {
      var timeDelta = now-this.lastTickAt
      this.world.update(timeDelta)
    }
    this.lastTickAt = now
  },
  setupHttpServer: function() {
    var clientFilesServer = new StaticServer('./public')
    var sharedFilesServer = new StaticServer('./shared')

    var sharedJavascriptPathMatcher = /^\/javascript\/shared\//
    this.httpServer = http.createServer(function(request, response) {
      request.addListener('end', function () {
        if(request.url.match(sharedJavascriptPathMatcher)) {
          request.url = '/' + request.url.replace(sharedJavascriptPathMatcher, '')
          sharedFilesServer.serve(request, response)
        } else {
          clientFilesServer.serve(request, response)
        }
      })
    })
  }
}

module.exports = Server
