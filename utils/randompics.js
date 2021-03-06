var socket = require('socket.io-client')(`http://localhost:${process.env.SERVER_PORT}`);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var getRandomPics = function (count, database) {
  var stream = []
  var randomPics = []
  database.createValueStream()
    .on('data', function (data) {
      stream.push(data);
    })
    .on('end', function () {
      var len = stream.length;
      if (count > len) {
        for (var i = 0; i < len; i++) {
          randomPics.push(stream[i].toString('utf8'));
        }
      } else {
        for (var i = 0; i < count; i++) {
          randomPics.push(stream[getRandomInt(1, stream.length)]);
        }
      }
      socket.emit('random', randomPics);
    })
}

module.exports = getRandomPics;
