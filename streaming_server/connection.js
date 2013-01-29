var Player = require('../models/player');
var EventEmitter = require('events').EventEmitter;
var Transcoder = require('../shared/transcoder');
var DeltaGenerator = require('../shared/delta_generator');

function Connection(wsConnection, world) {
  EventEmitter.call(this);
  console.log((new Date()) + ' Connection accepted.');
  wsConnection.on('message', this.onMessage.bind(this));
  wsConnection.on('close', this.onClose.bind(this));
  this.wsConnection = wsConnection;
  this.world = world;
  this.stateNodeId = 1;
  this.stateNodes = [];
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
    if(message.type === 'commands')
      this.player.commands = this.player.commands.concat(message.commands);
    else if(message.type === 'stateNodeAcknowledgement')
      this.onDeltaNodeAcknowledge(message);
  }
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

Connection.prototype.sendIdentification = function() {
  var message = {
    type: 'identification',
    playerId: this.player.id
  };
  this.sendMessage(message);
  this.identificationSent = true;
};

Connection.prototype.onDeltaNodeAcknowledge = function(message) {
  if(!this.identificationSent) this.sendIdentification();
  while(this.stateNodes[0].id < message.stateNodeId) {
    this.stateNodes.shift();
  }
  this.lastAcknowledgedStateNode = this.stateNodes[0];
}

Connection.prototype.sendState = function(state) {
  var lastAcknowledgedState;
  if(this.lastAcknowledgedStateNode) {
    lastAcknowledgedState = this.lastAcknowledgedStateNode.state
  }
  var delta = DeltaGenerator.generate(lastAcknowledgedState, state);
  if(delta) {
    console.log('DELTA!');
    var stateNode = {
      state: state,
      id: this.stateNodeId++
    };

    var message = {
      type: 'delta',
      delta: delta,
      stateNodeId: stateNode.id,
    }
    if(this.lastAcknowledgedStateNode) message.parentStateNodeId = this.lastAcknowledgedStateNode.id;

    console.log('sending', delta);
    this.sendMessage(message);
    this.stateNodes.push(stateNode);
  }
};

Connection.prototype.sendCommandAcknowledgementMessage = function() {
  var message = {
    type: 'commandAcknowledgement',
    state: {
      positionX: this.player.positionX,
      positionY: this.player.positionY
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
