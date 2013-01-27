var EventEmitter = {
  getCallbacks: function() {
    if(!this.callbacks) this.callbacks = {};
    return this.callbacks;
  },
  on: function(type, callback) {
    var callbacks = this.getCallbacks()[type];
    if(!callbacks) {
      callbacks = [];
      this.getCallbacks()[type] = callbacks;
    }
    callbacks.push(callback);
  },
  emit: function() {
    var args = Array.prototype.slice.call(arguments);
    var type = args.shift();
    var callbacks = this.getCallbacks()[type];
    if(callbacks) {
      callbacks.forEach(function(callback) {
        callback.apply(null, args);
      });
    }
  }
};
