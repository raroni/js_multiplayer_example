function Connection() {
  this.socket = new WebSocket('ws://localhost:3000');
  this.socket.binaryType = "arraybuffer";
  this.socket.onmessage = this.onMessage.bind(this);
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
  console.log('New message: ', message.type);
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

Connection.prototype.onWelcomeMessage = function(message) {
  var snapshot = message.snapshot, collection;
  this.stateManager.playerId = message.playerId;
  this.stateManager.applySnapshot(snapshot);
  this.state.player = this.world.players.find(message.playerId);
  this.stateManager.player = this.state.player;
};

Connection.prototype.onUpdateMessage = function(message) {
  this.stateManager.applyUpdate(message.update);
};

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
