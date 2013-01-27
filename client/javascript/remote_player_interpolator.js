function RemotePlayerInterpolator(player) {
  this.player = player;
  this.progress = 0;
  this.oldPosition = player.getPosition();
  this.newPosition = player.getPosition();
}

RemotePlayerInterpolator.prototype = {
  update: function(timeDelta) {
    if(this.progress != 1 && this.newPosition) {
      this.progress += timeDelta/100;
      this.progress = Math.min(1, this.progress);
      var newPosition = this.oldPosition.add(this.newPosition.subtract(this.oldPosition).multiply(this.progress));
      this.player.setPosition(newPosition);
    }
  },
  receive: function(newPlayerData) {
    this.progress = 0;
    this.oldPosition = this.newPosition;
    this.newPosition = new Vector2(newPlayerData.positionX, newPlayerData.positionY);
  }
}
