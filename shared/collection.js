function Collection(options) {
  this.list = [];
  this.byId = {};
}

Collection.prototype = {
  add: function(entity) {
    if(!entity.id) throw new Error('Entity must have an ID to be added to collection.');
    this.byId[entity.id] = entity;
    this.list.push(entity);
  },
  forEach: function(iterator) {
    this.list.forEach(iterator);
  },
  remove: function(entity) {
    if(!entity.id) throw new Error('Entity must have an ID to be removed from collection.');
    var index = this.list.indexOf(entity);
    if(index == -1 || !this.byId[entity.id]) throw new Error("Couldn't remove entity from collection because it isn't here.");
    delete this.byId[entity.id];
    this.list.splice(index, 1);
  },
  find: function(id) {
    return this.byId[id];
  }
}

if(typeof(exports) !== 'undefined') module.exports = Collection;
