var Snitch = require('snitch');
var Utf8 = require('../../shared/utf8');

function Utf8Test(name) {
  Snitch.TestCase.call(this, name);
}

Utf8Test.prototype = Object.create(Snitch.TestCase.prototype);

Utf8Test.prototype['test encode normal characters'] = function() {
  var string = 'ras';
  var codes = Utf8.encode(string);

  this.assertDeepEqual([114, 97, 115], codes);
};

Utf8Test.prototype['test encode weird characters'] = function() {
  var string = '☃♫☯';
  var codes = Utf8.encode(string);
  this.assertDeepEqual([226, 152, 131, 226, 153, 171, 226, 152, 175], codes);
};

Utf8Test.prototype['test encode mixture of normal characters and weird characters'] = function() {
  var string = 'ras ☃ mus';
  var codes = Utf8.encode(string);

  this.assertDeepEqual([114, 97, 115, 32, 226, 152, 131, 32, 109, 117, 115], codes);
};

Utf8Test.prototype['test decode normal characters'] = function() {
  var string = Utf8.decode(114, 97, 115);
  this.assertEqual('ras', string);
};

Utf8Test.prototype['test decode weird characters'] = function() {
  var string = Utf8.decode(226, 152, 131, 226, 153, 171, 226, 152, 175);
  this.assertEqual('☃♫☯', string);
};

Utf8Test.prototype['test decode mixture of normal characters and weird characters'] = function() {
  var string = Utf8.decode(114, 97, 115, 32, 226, 152, 131, 32, 109, 117, 115);
  this.assertEqual('ras ☃ mus', string);
};

Utf8Test.prototype['test everything together'] = function() {
  var originalString = "A snowman? Here: ☃."
  var codes = Utf8.encode(originalString);
  var decodedString = Utf8.decode.apply(null, codes);
  this.assertEqual(originalString, decodedString);
};

module.exports = Utf8Test;
