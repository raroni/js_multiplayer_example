(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Snitch, EventEmitter;
  if(isNode) {
    Snitch = require('snitch');
    EventEmitter = require('../../shared/event_emitter');
  } else {
    Snitch = window.Snitch;
    EventEmitter = window.EventEmitter;
  }

  function Dummy() {}
  Dummy.prototype = Object.create(EventEmitter);

  function EventEmitterTest(name) {
    Snitch.TestCase.call(this, name);
  }

  EventEmitterTest.prototype = Object.create(Snitch.TestCase.prototype);

  EventEmitterTest.prototype['test simple emit'] = function() {
    var dummy = new Dummy;
    var callbackCalled = false;
    dummy.on('message', function() {
      callbackCalled = true;
    });
    dummy.emit('message');
    this.assert(callbackCalled);
  };

  EventEmitterTest.prototype['test emit with arguments'] = function() {
    var dummy = new Dummy;
    var valueFromCallback;
    dummy.on('message', function(message) {
      valueFromCallback = message;
    });
    dummy.emit('message', 'hi there');
    this.assertEqual('hi there', valueFromCallback);
  };

  if(isNode) module.exports = EventEmitterTest;
  else window.EventEmitterTest = EventEmitterTest;
})();
