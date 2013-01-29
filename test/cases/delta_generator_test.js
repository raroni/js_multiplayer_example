(function() {
  var isNode = typeof(exports) !== 'undefined';
  var Snitch, DeltaGenerator;
  if(isNode) {
    Snitch = require('snitch');
    DeltaGenerator = require('../../shared/delta_generator');
  } else {
    Snitch = window.Snitch;
    DeltaGenerator = window.DeltaGenerator;
  }

  function DeltaGeneratorTest(name) {
    Snitch.TestCase.call(this, name);
  }

  DeltaGeneratorTest.prototype = Object.create(Snitch.TestCase.prototype);

  DeltaGeneratorTest.prototype['test change to one entity'] = function() {
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
    var newState = {
      players: [
        {
          id: 1,
          name: 'Rasmus',
          healthPoints: 20,
          level: 4
        }
      ]
    };

    var delta = DeltaGenerator.generate(oldState, newState);

    var expected = {
      changes: {
        players: {
          1: {
            level: 3
          }
        }
      }
    };
    this.assertDeepEqual(expected, delta);
  };

  DeltaGeneratorTest.prototype['test change to two entities'] = function() {
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
    var newState = {
      players: [
        {
          id: 1,
          name: 'Rasmus',
          healthPoints: 20,
          level: 3
        },
        {
          id: 2,
          name: 'John',
          healthPoints: 10,
          level: 1
        }
      ]
    };

    var delta = DeltaGenerator.generate(oldState, newState);

    var expected = {
      changes: {
        players: {
          1: { level: 2 },
          2: { healthPoints: -10 }
        }
      }
    }
    this.assertDeepEqual(expected, delta);
  };

  DeltaGeneratorTest.prototype['test entity removal'] = function() {
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
    var newState = {
      players: [
        {
          id: 1,
          name: 'Rasmus',
          healthPoints: 20,
          level: 1
        }
      ]
    };

    var delta = DeltaGenerator.generate(oldState, newState);

    var expected = {
      deletions: {
        players: [2]
      }
    };
    this.assertDeepEqual(expected, delta);
  };

  DeltaGeneratorTest.prototype['test entity insertion'] = function() {
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
    var newState = {
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
          healthPoints: 10,
          level: 1
        }
      ]
    };

    var delta = DeltaGenerator.generate(oldState, newState);

    var expected = {
      insertions: {
        players: [
          {
            id: 2,
            name: 'John',
            healthPoints: 10,
            level: 1
          }
        ]
      }
    };
    this.assertDeepEqual(expected, delta);
  }

  DeltaGeneratorTest.prototype['test with no old state'] = function() {
    var newState = {
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
          healthPoints: 10,
          level: 1
        }
      ]
    };
    var delta = DeltaGenerator.generate(undefined, newState);

    var expected = {
      insertions: {
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
            healthPoints: 10,
            level: 1
          }
        ]
      }
    };
    this.assertDeepEqual(expected, delta);
  }

  DeltaGeneratorTest.prototype['test identical states'] = function() {
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
          healthPoints: 10,
          level: 1
        }
      ]
    };
    var newState = JSON.parse(JSON.stringify(oldState));
    var delta = DeltaGenerator.generate(oldState, newState);

    this.refute(delta);
  }

  if(isNode) module.exports = DeltaGeneratorTest;
  else window.DeltaGeneratorTest = DeltaGeneratorTest;
})();
