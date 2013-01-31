var StaticServer = require('node-static').Server;
var http = require('http');
var StreamingServer = require('./streaming_server');
var World = require('./models/world');
var Broadcaster = require('./broadcaster');
var SnitchServer = require('snitch').Server;

var sharedJavascriptPathMatcher = /^\/javascript\/shared\//;
var testPathMatcher = /^\/test/;

function Server() {
  this.world = new World;

  this.clientFilesServer = new StaticServer('./client');
  this.sharedFilesServer = new StaticServer('./shared');
  this.testFilesServer = new StaticServer('./test');

  this.httpServer = http.createServer(this.request.bind(this));
  var streamingServer = new StreamingServer(this.httpServer, this.world);
  this.broadcaster = new Broadcaster(this.world, streamingServer);
}

Server.prototype = {
  start: function() {
    var port = process.env.PORT || 3000;
    this.httpServer.listen(port);
    console.log('Listening on port ' + port);
    setInterval(this.tick.bind(this), 33);
    console.log('Starting game loop.');
  },
  tick: function() {
    var now = new Date;
    if(this.lastTickAt) {
      var timeDelta = now-this.lastTickAt;
      this.world.update(timeDelta);
    }
    this.lastTickAt = now;
  },
  request: function(request, response) {
    if(request.url.match(sharedJavascriptPathMatcher)) {
      request.url = '/' + request.url.replace(sharedJavascriptPathMatcher, '');
      this.sharedFilesServer.serve(request, response);
    }
    else if(request.url.match(testPathMatcher)) {
      if(request.url == '/test/snitch.js') {
        SnitchServer.serve(response);
      } else {
        request.url = '/' + request.url.replace(testPathMatcher, '');
        this.testFilesServer.serve(request, response);
      }
    }
    else {
      this.clientFilesServer.serve(request, response);
    }
  }
}

module.exports = Server;
