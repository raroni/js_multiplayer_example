(function() {
  var getUTF8Size = function( str ) {
    var sizeInBytes = str.split('')
      .map(function( ch ) {
        return ch.charCodeAt(0);
      }).map(function( uchar ) {
        return uchar < 128 ? 1 : 2;
      }).reduce(function( curr, next ) {
        return curr + next;
      });

    return sizeInBytes;
  };

  function NetworkAnalyzer(connection) {
    connection.on('messageData', this.onMessageData.bind(this));
    this.samples = [];
    this.purgeLimit = 3000; // ms
    this.recalculationInterval = 500;
    this.timeUntilRecalculation = this.recalculationInterval;
  }

  NetworkAnalyzer.prototype = {
    update: function(timeDelta) {
      this.timeUntilRecalculation -= timeDelta;
      if(this.timeUntilRecalculation <= 0) {
        this.timeUntilRecalculation += this.recalculationInterval;
        this.recalculate();
      }
    },
    recalculate: function() {
      this.purge();
      var totalSize = this.samples.reduce(function(memo, sample) {
        return memo + sample.size
      }, 0);
      this.rate = totalSize/this.purgeLimit*1000;
    },
    purge: function() {
      var nowTime = (new Date).getTime();
      while(this.samples[0] && this.samples[0].createdAt.getTime()+this.purgeLimit < nowTime) {
        this.samples.shift();
      }
    },
    onMessageData: function(messageData) {
      var size;
      if(typeof(messageData) === 'string') {
        size = getUTF8Size(messageData);
      } else {
        size = messageData.byteLength;
      }
      var sample = {
        createdAt: (new Date),
        size: size
      };
      this.samples.push(sample);
    }
  };

  window.NetworkAnalyzer = NetworkAnalyzer;
})();
