(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Snitch;
  if(isNode) {
    Snitch = require('snitch');
  } else {
    Snitch = window.Snitch;
  }

  function TestCaseTest(name) {
    Snitch.TestCase.call(this, name);
  }

  TestCaseTest.prototype = Object.create(Snitch.TestCase.prototype);

  TestCaseTest.prototype['test assert'] = function() {
    this.assertEqual(0, 5);
  };

  if(isNode) module.exports = TestCaseTest;
  else window.TestCaseTest = TestCaseTest;
})();
