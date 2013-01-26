var Snitch = require('snitch');
var DeltaGenerator = require('../../delta_generator');

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
        health_points: 20,
        level: 1
      }
    ]
  };
  var newState = {
    players: [
      {
        id: 1,
        name: 'Rasmus',
        health_points: 20,
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
        health_points: 20,
        level: 1
      },
      {
        id: 2,
        name: 'John',
        health_points: 20,
        level: 1
      }
    ]
  };
  var newState = {
    players: [
      {
        id: 1,
        name: 'Rasmus',
        health_points: 20,
        level: 3
      },
      {
        id: 2,
        name: 'John',
        health_points: 10,
        level: 1
      }
    ]
  };

  var delta = DeltaGenerator.generate(oldState, newState);

  var expected = {
    changes: {
      players: {
        1: { level: 2 },
        2: { health_points: -10 }
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
        health_points: 20,
        level: 1
      },
      {
        id: 2,
        name: 'John',
        health_points: 20,
        level: 1
      }
    ]
  };
  var newState = {
    players: [
      {
        id: 1,
        name: 'Rasmus',
        health_points: 20,
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
        health_points: 20,
        level: 1
      }
    ]
  };
  var newState = {
    players: [
      {
        id: 1,
        name: 'Rasmus',
        health_points: 20,
        level: 1
      },
      {
        id: 2,
        name: 'John',
        health_points: 10,
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
          health_points: 10,
          level: 1
        }
      ]
    }
  };
  this.assertDeepEqual(expected, delta);
}

module.exports = DeltaGeneratorTest;
