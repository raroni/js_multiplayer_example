function Connection() {
  this.socket = new WebSocket('ws://localhost:3000');
  this.socket.binaryType = "arraybuffer";
  this.socket.onmessage = this.onMessage.bind(this);
  this.stateNodes = [];
}

Connection.prototype = Object.create(EventEmitter);

Connection.prototype.onMessage = function(messageEvent) {
  var message;
  this.emit('messageData', messageEvent.data);
  if(messageEvent.data instanceof ArrayBuffer) {
    message = Transcoder.decode(messageEvent.data);
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

/*
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
*/

Connection.prototype.onIdentificationMessage = function(message) {
  this.state.player = this.world.players.find(message.playerId);
  console.log(this.state.player.name)
}

Connection.prototype.findStateNode = function(stateNodeId) {
  var stateNode;
  for(var i=0; this.stateNodes.length>i; i++) {
    stateNode = this.stateNodes[i];
    if(stateNode.id === stateNodeId) return stateNode;
  }
  throw new Error("Couldn't find state node.");
}

Connection.prototype.onDeltaMessage = function(message) {
  var lastStateNode = this.stateNodes[this.stateNodes.length-1];
  if(!lastStateNode || message.stateNodeId > lastStateNode.id) {
    var oldState;
    if(message.parentStateNodeId) {
      var oldState = this.findStateNode(message.parentStateNodeId).state;
    } else {
      var oldState = {};
    }
    var newState = DeltaApplicator.apply(oldState, message.delta);
    var stateNode = {
      id: message.stateNodeId,
      state: newState
    };

    var delta = DeltaGenerator.generate(lastStateNode ? lastStateNode.state : null, newState);

    this.stateNodes.push(stateNode);
    this.sendStateNodeAcknowledgement();
    if(delta) this.stateManager.applyDelta(delta);
  }
}

Connection.prototype.sendStateNodeAcknowledgement = function() {
  var message = {
    type: 'stateNodeAcknowledgement',
    stateNodeId: this.stateNodes[this.stateNodes.length-1].id
  };
  this.sendMessage(message);
}

Connection.prototype.onCommandAcknowledgementMessage = function(message) {
  this.commandApplicator.acknowledgeCommands(message.state, message.lastAcknowledgedCommandId);
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
