function RemotePlayerInterpolator(player) {
  this.player = player;
  this.progress = 0;
  this.oldPosition = player.position;
  this.newPosition = player.position;
}

RemotePlayerInterpolator.prototype = {
  update: function(timeDelta) {
    if(this.progress != 1 && this.newPosition) {
      this.progress += timeDelta/100;
      this.progress = Math.min(1, this.progress);
      this.player.position = this.oldPosition.add(this.newPosition.subtract(this.oldPosition).multiply(this.progress));
    }
  },
  receive: function(newPlayerData) {
    this.progress = 0;
    this.oldPosition = this.newPosition;
    this.newPosition = new Vector2(newPlayerData.position.x, newPlayerData.position.y);
  }
}
