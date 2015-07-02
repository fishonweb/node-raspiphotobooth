var levelup = require("levelup")

// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = levelup('./mydb')

// 2) put a key & value

for(var i = 0; i < 10; i++) {
  db.put(i, 'LevelUP ' + i, function (err) {
    if (err) return console.log('Ooops!', err) // some kind of I/O error
  })
}

var stream = []
var randomPics = []
db.createReadStream()
  .on('data', function (data) {
    stream.push({
      "key" : data.key,
      "value" : data.value
    })
  })
  .on('error', function (err) {
    console.log('Oh my!', err)
  })
  .on('close', function () {
    console.log('Stream closed')
  })
  .on('end', function () {
    console.log('Stream closed')
    console.log(stream, typeof stream.length)
    for (var i = 0; i < 3; i++) {
      var len = stream.length
      randomPics.push(stream[getRandomInt(1, stream.length)])
    }
      setPic(randomPics)
  })

  function setPic(object) {
    for(var i = 0; i < object.length; i++) {
      console.log("obj " + i, object[i])
    }
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
