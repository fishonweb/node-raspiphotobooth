function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var getRandomPics = function (count, database) {
  var stream = []
  var randomPics = []
  database.createValueStream()
    .on('data', function (data) {
      stream.push(data)
    })
    .on('end', function () {
      for (var i = 0; i < count; i++) {
        var len = stream.length
        randomPics.push(stream[getRandomInt(1, stream.length)])
      }
      console.log(randomPics)
      return randomPics
    })
}

module.exports = getRandomPics
