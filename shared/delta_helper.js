(function() {
  DeltaHelper = {
    findEntity: function(collection, id) {
      var entity;
      for(var i=0; collection.length>i; i++) {
        entity = collection[i];
        if(entity.id == id) return entity;
      }
    }
  };

  var isNode = typeof(exports) !== 'undefined';
  if(isNode) module.exports = DeltaHelper;
  else window.DeltaHelper = DeltaHelper;
})();
