function Vector2(x, y) {
  this.x = x;
  this.y = y;
}

Vector2.prototype = {
  add: function(vector) {
    var vector = new Vector2(
      this.x + vector.x,
      this.y + vector.y
    );
    return vector;
  },
  clone: function() {
    var vector = new Vector2(this.x, this.y);
    return vector;
  },
  subtract: function(vector) {
    var vector = new Vector2(
      this.x - vector.x,
      this.y - vector.y
    );
    return vector;
  },
  multiply: function(scalar) {
    var vector = new Vector2(
      this.x*scalar,
      this.y*scalar
    );
    return vector;
  },
  length: function() {
    var squareSum = Math.pow(this.x, 2) + Math.pow(this.y, 2);
    return Math.sqrt(squareSum);
  },
  toJSON: function() {
    var object = {
      x: this.x,
      y: this.y
    };
    return object;
  }
};

if(typeof(exports) !== 'undefined') module.exports = Vector2;
else window.Vector2 = Vector2;
