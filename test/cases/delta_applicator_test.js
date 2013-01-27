(function() {
  function DeltaApplicatorTest(name) {
    Snitch.TestCase.call(this, name);
  }

  DeltaApplicatorTest.prototype = Object.create(Snitch.TestCase.prototype);

  DeltaApplicatorTest.prototype['test change'] = function() {
    var oldState = {
      players: [
        {
          id: 1,
          name: 'Rasmus',
          healthPoints: 20,
          level: 1
        }
      ]
    };
    var delta = {
      changes: {
        players: {
          1: {
            level: 3
          }
        }
      }
    };

    var newState = DeltaApplicator.apply(oldState, delta);

    var expected = {
      players: [
        {
          id: 1,
          name: 'Rasmus',
          healthPoints: 20,
          level: 4
        }
      ]
    };
    this.assertDeepEqual(expected, newState);
  }

  window.DeltaApplicatorTest = DeltaApplicatorTest;
})();
