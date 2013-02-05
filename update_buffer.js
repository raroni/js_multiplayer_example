function UpdateBuffer(world) {
  this.clear();
  world.on('addEntity', this.add.bind(this));
  world.on('removeEntity', this.remove.bind(this));
  world.on('changeEntity', this.change.bind(this));
}

UpdateBuffer.prototype = {
  clear: function() {
    delete this.data;
  },
  add: function(entity, collectionName) {
    this.checkData();
    if(!this.data.adds) this.data.adds = {};
    if(!this.data.adds[collectionName]) this.data.adds[collectionName] = [];
    var entityData = entity.toHash();
    this.data.adds[collectionName].push(entityData);
  },
  remove: function(entity, collectionName) {
    this.checkData();
    if(!this.data.removes) this.data.removes = {};
    if(!this.data.removes[collectionName]) this.data.removes[collectionName] = [];
    this.data.removes[collectionName].push(entity.id);
  },
  change: function(entity, attribute, collectionName) {
    this.checkData();
    if(!this.data.changes) this.data.changes = {};
    if(!this.data.changes[collectionName]) this.data.changes[collectionName] = {};
    if(!this.data.changes[collectionName][entity.id]) this.data.changes[collectionName][entity.id] = {};
    this.data.changes[collectionName][entity.id][attribute] = entity[attribute];
  },
  checkData: function() {
    if(!this.data) this.data = {};
  }
};

module.exports = UpdateBuffer;
