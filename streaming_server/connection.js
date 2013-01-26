var Player = require('../models/player');
var EventEmitter = require('events').EventEmitter;
var Transcoder = require('../shared/transcoder');

function Connection(wsConnection, world) {
  EventEmitter.call(this);
  console.log((new Date()) + ' Connection accepted.');
  wsConnection.on('message', this.onMessage.bind(this));
  wsConnection.on('close', this.onClose.bind(this));
  this.wsConnection = wsConnection;
  this.world = world;
  world.players.forEach(function(player) {
    this.sendNewPlayerMessage(player);
  }.bind(this));
}

Connection.prototype = Object.create(EventEmitter.prototype);

Connection.prototype.createPlayer = function() {
  this.player = new Player;
  this.player.on('commandApplication', this.sendCommandAcknowledgementMessage.bind(this));
  this.world.players.add(this.player);
};

Connection.prototype.onMessage = function(messageObject) {
  if(messageObject.type === 'utf8') {
    var messageAsString = messageObject.utf8Data;
    var message = JSON.parse(messageAsString);
    if(message.type == 'commands')
      this.player.commands = this.player.commands.concat(message.commands);
  }
};

Connection.prototype.sendNewPlayerMessage = function(player, you) {
  if(typeof(you) === 'undefined') you = false;
  var message = {
    type: 'newPlayer',
    you: you,
    player: {
      id: player.id,
      name: player.name,
      position_x: player.position_x,
      position_y: player.position_y
    }
  };

  this.sendMessage(message);
};

Connection.prototype.onClose = function(reasonCode, description) {
  console.log((new Date()) + ' Peer ' + this.wsConnection.remoteAddress + ' disconnected.');
  this.emit('close');
  this.world.players.remove(this.player);
};

Connection.prototype.sendMessage = function(message) {
  var data;
  if(Transcoder.canTranscode(message.type)) {
    var arrayBuffer = Transcoder.encode(message);
    data = convertArrayBufferToNodeBuffer(arrayBuffer);
  } else {
    data = JSON.stringify(message);
  }

  this.wsConnection.send(data);
};

Connection.prototype.sendSnapshot = function(snapshot) {
  var message = {
    type: 'snapshot',
    snapshot: snapshot
  };
  this.sendMessage(message);
};

Connection.prototype.sendCommandAcknowledgementMessage = function() {
  var message = {
    type: 'commandAcknowledgement',
    state: {
      position_x: this.player.position_x,
      position_y: this.player.position_y
    },
    lastAcknowledgedCommandId: this.player.lastAppliedCommandId
  };
  this.sendMessage(message);
};

function convertArrayBufferToNodeBuffer(arrayBuffer) {
  var buffer = new Buffer(arrayBuffer.byteLength);
  var view = new Uint8Array(arrayBuffer);
  for(var i=0; buffer.length>i; i++) {
    buffer[i] = view[i];
  }
  return buffer;
}

module.exports = Connection;
