function Connection(controller) {
  this.socket = new WebSocket('ws://localhost:3000');
  this.socket.binaryType = "arraybuffer";
  this.socket.onmessage = this.onMessage.bind(this);
  this.controller = controller;
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
  if(this.controller[methodName]) {
    this.controller[methodName](message);
  } else {
    throw new Error("Server message of type '" + message.type + "' not understood.");
  }
};

Connection.prototype.sendMessage = function(message) {
  var messageAsString = JSON.stringify(message);
  this.socket.send(messageAsString);
};

Connection.prototype.sendCommands = function(commands) {
  var message = {
    type: 'commands',
    commands: commands
  };

  this.sendMessage(message);
};
