(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Collection;
  if(isNode) {
    Collection = require('../collection');
  } else {
    Collection = window.Collection;
  }

  function EntityCollection(options) {
    Collection.call(this, options);
    if(!options) throw new Error('EntityCollection did not get any options');
    if(!options.entityConstructor) throw new Error('EntityCollection did not get a entity constructor.');
    if(!options.name) throw new Error('EntityCollection did not get a name.');
    this.EntityConstructor = options.entityConstructor;
    this.name = options.name;
  }

  EntityCollection.prototype = Object.create(Collection.prototype);

  EntityCollection.prototype.build = function(hash) {
    var entity = new this.EntityConstructor(hash);
    return entity;
  };

  if(isNode) module.exports = EntityCollection;
  else window.EntityCollection = EntityCollection;
})();
