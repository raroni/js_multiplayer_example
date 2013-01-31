/*
IDÉ:
Det kunne være sejt hvis View lyttede på world.players-events (add/remove) og lavede/fjernede PlayerViews derefter.
Så kunne man i View#update bare kalde noget i stil med view.playersView.each(&:update) :-D
*/

function View(state, document) {
  this.state = state;
  this.world = state.world;
  this.canvas = document.createElement('canvas');
  this.canvas.width = 500;
  this.canvas.height = 200;
  this.context = this.canvas.getContext('2d');
  document.body.appendChild(this.canvas);
}

View.prototype = {
  update: function(timeDelta) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.world.players.forEach(function(player) {
      this.context.fillRect(player.positionX, player.positionY, 20, 20);
      this.context.font = '13px arial';
      this.context.fillText(player.name, player.positionX, player.positionY+30);
    }.bind(this));

    var text = 'Incoming network: ';
    if(typeof(this.state.network.rate) !== 'undefined') {
      text += Math.round(this.state.network.rate) + 'b/s';
    } else {
      text += 'N/A';
    }
    this.context.fillStyle = '000';
    this.context.font = '14px arial';
    this.context.fillText(text, 0, 13);
  }
};
