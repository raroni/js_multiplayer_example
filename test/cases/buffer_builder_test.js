(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Snitch, BufferBuilder;
  if(isNode) {
    Snitch = require('snitch');
    BufferBuilder = require('../../shared/buffer_builder');
  } else {
    Snitch = window.Snitch;
    BufferBuilder = window.BufferBuilder;
  }

  function BufferBuilderTest(name) {
    Snitch.TestCase.call(this, name);
  }

  BufferBuilderTest.prototype = Object.create(Snitch.TestCase.prototype);

  BufferBuilderTest.prototype['test to hash'] = function() {
    var bufferBuilder = new BufferBuilder();
    bufferBuilder.add(2, 'uint8');
    bufferBuilder.add(1000, 'uint16');
    var buffer = bufferBuilder.build();

    var view = new DataView(buffer);
    this.assertEqual(3, buffer.byteLength);
    this.assertEqual(2, view.getUint8(0));
    this.assertEqual(1000, view.getUint16(1));
  };

  if(isNode) module.exports = BufferBuilderTest;
  else window.BufferBuilderTest = BufferBuilderTest;
})();
