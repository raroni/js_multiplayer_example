var Player = require('../models/player')
var EventEmitter = require('events').EventEmitter

function Connection(wsConnection, world) {
  EventEmitter.call(this)
  console.log((new Date()) + ' Connection accepted.')
  wsConnection.on('message', this.onMessage.bind(this))
  wsConnection.on('close', this.onClose.bind(this))
  this.wsConnection = wsConnection
  this.world = world
  world.players.forEach(function(player) {
    this.sendNewPlayerMessage(player)
  }.bind(this))
}

Connection.prototype = Object.create(EventEmitter.prototype)

Connection.prototype.createPlayer = function() {
  this.player = new Player
  this.player.on('commandApplication', this.sendCommandAcknowledgementMessage.bind(this))
  this.world.players.add(this.player)
}

Connection.prototype.onMessage = function(messageObject) {
  if(messageObject.type === 'utf8') {
    var messageAsString = messageObject.utf8Data
    var message = JSON.parse(messageAsString)
    if(message.type == 'commands')
      this.player.commands = this.player.commands.concat(message.commands)
  }
}

Connection.prototype.sendNewPlayerMessage = function(player, you) {
  if(typeof(you) === 'undefined') you = false
  var message = {
    type: 'newPlayer',
    you: you,
    player: {
      id: player.id,
      name: player.name,
      position: {
        x: player.position.x,
        y: player.position.y
      }
    }
  }

  this.sendMessage(message)
}

Connection.prototype.onClose = function(reasonCode, description) {
  console.log((new Date()) + ' Peer ' + this.wsConnection.remoteAddress + ' disconnected.')
  this.emit('close')
  this.world.players.remove(this.player)
}

Connection.prototype.sendMessage = function(message) {
  var messageAsString = JSON.stringify(message)
  this.wsConnection.sendUTF(messageAsString)
}

Connection.prototype.sendSnapshot = function(snapshot) {
  var message = {
    type: 'snapshot',
    snapshot: snapshot
  }
  this.sendMessage(message)
}

Connection.prototype.sendCommandAcknowledgementMessage = function() {
  var message = {
    type: 'commandAcknowledgement',
    state: {
      position: {
        x: this.player.position.x,
        y: this.player.position.y
      }
    },
    lastAcknowledgedCommandId: this.player.lastAppliedCommandId
  }
  this.sendMessage(message)
}

module.exports = Connection
