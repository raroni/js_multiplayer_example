function Connection(remotePlayerInterpolators) {
  this.socket = new WebSocket('ws://localhost:3000');
  this.socket.binaryType = "arraybuffer";
  this.socket.onmessage = this.onMessage.bind(this);
  this.remotePlayerInterpolators = remotePlayerInterpolators;
}

Connection.prototype = Object.create(EventEmitter);

Connection.prototype.onMessage = function(messageEvent) {
  var message;
  this.emit('messageData', messageEvent.data);
  if(messageEvent.data instanceof ArrayBuffer) {
    message = Transcoder.decode(messageEvent.data);
    console.log(message);
  } else {
    message = JSON.parse(messageEvent.data);
  }
  this.emit('message', message);
  if(!message.type) throw new Error('Message from server had no type.');
  var type = message.type;
  var methodName = 'on' + type.charAt(0).toUpperCase() + type.slice(1) + 'Message';
  if(this[methodName]) {
    this[methodName](message);
  } else {
    throw new Error("Server message of type '" + message.type + "' not understood.");
  }
};

Connection.prototype.sendMessage = function(message) {
  var messageAsString = JSON.stringify(message);
  this.socket.send(messageAsString);
};

Connection.prototype.onNewPlayerMessage = function(message) {
  var player = new Player(message.player);
  this.world.players.add(player);
  if(message.you) {
    this.state.player = player;
  } else {
    var remotePlayerInterpolator = new RemotePlayerInterpolator(player);
    remotePlayerInterpolator.id = player.id;
    this.remotePlayerInterpolators.add(remotePlayerInterpolator);
  }
};

Connection.prototype.onCommandAcknowledgementMessage = function(message) {
  this.commandApplicator.acknowledgeCommands(message.state, message.lastAcknowledgedCommandId);
};

Connection.prototype.onSnapshotMessage = function(message) {
  var playerData = message.snapshot;
  playerData.forEach(function(playerData) {
    if(!this.state.player || playerData.id != this.state.player.id) {
      var interpolator = this.remotePlayerInterpolators.byId[playerData.id];
      if(interpolator) interpolator.receive(playerData);
    }
  }.bind(this));
};

Connection.prototype.sendCommands = function(commands) {
  var message = {
    type: 'commands',
    commands: commands
  };

  this.sendMessage(message);
};

Connection.prototype.onRemovePlayerMessage = function(message) {
  var player = this.world.players.byId[message.playerId];
  this.world.players.remove(player);

  var interpolator = this.remotePlayerInterpolators.byId[message.playerId];
  this.remotePlayerInterpolators.remove(interpolator);
};
