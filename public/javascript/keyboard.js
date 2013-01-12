(function() {
  var keyCodeMap = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
  }

  function Keyboard(document) {
    document.addEventListener('keydown', this.keyPressed.bind(this))
    document.addEventListener('keyup', this.keyReleased.bind(this))
    this.pressed = {}
  }
  Keyboard.prototype = {
    keyPressed: function(e) {
      var keyName = keyCodeMap[e.keyCode]
      if(keyName) {
        this.pressed[keyName] = true
      }
    },
    keyReleased: function(e) {
      var keyName = keyCodeMap[e.keyCode]
      if(keyName && this.pressed[keyName]) {
        delete this.pressed[keyName]
      }
    }
  }

  window.Keyboard = Keyboard
})()
