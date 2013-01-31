var SharedPlayer = require('../shared/player');

var names = ['Rasmus', 'John', 'Pelle', 'Christina', 'Bongface', 'Mongelis', 'BongoJohn'];

function getName() {
  var index = Math.round(Math.random()*names.length-2);
  return names[index];
}

function Player(options) {
  this.commands = [];
  if(!options) options = {};

  if(!options.positionX) {
    var x = Math.round(Math.random()*100);
    var y = Math.round(Math.random()*100);
    options.positionX = x;
    options.positionY = y;
  }
  if(!options.name) options.name = getName();

  SharedPlayer.call(this, options);
}

Player.prototype = Object.create(SharedPlayer.prototype);

Player.prototype.applyCommands = function() {
  if(this.commands.length != 0) {
    console.log('Player ' + this.id + ' should apply ' + this.commands.length + ' commands.');
    this.commands.forEach(function(command) {
      this.applyCommand(command);
      this.lastAppliedCommandId = command.id;
    }.bind(this));
    this.commands.length = 0;
    this.emit('commandApplication');
  }
};

Player.prototype.toHash = function() {
  var hash = {
    id: this.id,
    name: this.name,
    positionX: this.positionX,
    positionY: this.positionY
  };
  return hash;
}

module.exports = Player;
