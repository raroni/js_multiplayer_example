function World() {
  SharedWorld.call(this);
}

World.prototype = Object.create(SharedWorld.prototype);

World.prototype.entityConstructors = {
  'players': window.Player
};
