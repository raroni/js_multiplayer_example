var SharedPlayer = require('../shared/player')
var EventEmitter = require('events').EventEmitter

var names = ['Rasmus', 'John', 'Pelle', 'Christina', 'Bongface', 'Mongelis', 'BongoJohn']

function getName() {
  var index = Math.round(Math.random()*names.length-2)
  return names[index]
}

function Player() {
  this.commands = []
  var x = Math.round(Math.random()*100)
  var y = Math.round(Math.random()*100)
  var options = {
    position: {
      x: x,
      y: y
    },
    name: getName()
  }
  SharedPlayer.call(this, options)
}

Player.prototype = Object.create(SharedPlayer.prototype)

Player.prototype.applyCommands = function() {
  if(this.commands.length != 0) {
    console.log('Player ' + this.id + ' should apply ' + this.commands.length + ' commands.')
    this.commands.forEach(function(command) {
      this.applyCommand(command)
      this.lastAppliedCommandId = command.id
    }.bind(this))
    this.commands.length = 0
    this.emit('commandApplication')
  }
}

// Mixing in EventEmitter
for(var propertyName in EventEmitter.prototype)
  Player.prototype[propertyName] = EventEmitter.prototype[propertyName]


module.exports = Player
