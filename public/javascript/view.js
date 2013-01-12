/*
IDÉ:
Det kunne være sejt hvis View lyttede på world.players-events (add/remove) og lavede/fjernede PlayerViews derefter.
Så kunne man i View#update bare kalde noget i stil med view.playersView.each(&:update) :-D
*/

function View(world, document) {
  this.world = world
  this.canvas = document.createElement('canvas')
  this.canvas.width = 500
  this.canvas.height = 200
  this.context = this.canvas.getContext('2d')
  document.body.appendChild(this.canvas)
}

View.prototype = {
  update: function(timeDelta) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.world.players.forEach(function(player) {
      this.context.fillRect(player.position.x, player.position.y, 20, 20)
      this.context.fillText(player.name, player.position.x, player.position.y+30)
    }.bind(this))
  }
}
