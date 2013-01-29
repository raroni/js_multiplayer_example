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
  };

  DeltaApplicatorTest.prototype['test insert'] = function() {
    var player1 = {
      id: 1,
      name: 'Rasmus',
      healthPoints: 20,
      level: 1
    };
    var player2 = {
      id: 2,
      name: 'John',
      healthPoints: 30,
      level: 2
    };

    var oldState = { players: [player1] };
    var delta = {
      insertions: {
        players: [player2]
      }
    };

    var newState = DeltaApplicator.apply(oldState, delta);

    var expected = {
      players: [player1, player2]
    };
    this.assertDeepEqual(expected, newState);
  };

  DeltaApplicatorTest.prototype['test delete'] = function() {
    var oldState = {
      players: [
        {
          id: 1,
          name: 'Rasmus',
          healthPoints: 20,
          level: 1
        },
        {
          id: 2,
          name: 'John',
          healthPoints: 20,
          level: 1
        }
      ]
    };
    var delta = {
      deletions: {
        players: [2]
      }
    };

    var newState = DeltaApplicator.apply(oldState, delta);

    var expected = {
      players: [
        {
          id: 1,
          name: 'Rasmus',
          healthPoints: 20,
          level: 1
        }
      ]
    };
    this.assertDeepEqual(expected, newState);
  };

  DeltaApplicatorTest.prototype['test with empty oldState'] = function() {
    var oldState = {};

    var player1 = {
      id: 1,
      name: 'Rasmus',
      healthPoints: 20,
      level: 1
    };
    var player2 = {
      id: 2,
      name: 'John',
      healthPoints: 30,
      level: 2
    };
    var delta = {
      insertions: {
        players: [player1, player2]
      }
    };

    var newState = DeltaApplicator.apply(oldState, delta);

    var expected = {
      players: [player1, player2]
    };
    this.assertDeepEqual(expected, newState);
  };

  window.DeltaApplicatorTest = DeltaApplicatorTest;
})();
