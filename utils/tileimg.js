var gm = require("gm")
var socket = require('socket.io-client')('http://localhost:3000');

module.exports = function tile(inputFolder, inputArrayImgs, outputFolder, outputName, callback) {
  // a, b  ->  a b
  console.log("tile image")
  gm()
    .in('-page', '+0+0')  // Custom place for each of the images
    .in(inputFolder + inputArrayImgs[0])
    .in('-page', '+1028+0')
    .in(inputFolder + inputArrayImgs[1])
    .mosaic()  // Merges the images as a matrix
    .write(outputFolder  + outputName +".jpg", function (err) {
      if (err) console.log(err);
        console.log(this.outname + " created  ::  " + arguments[3])
        socket.emit('photobooth', outputName)
        button.watch(function(err, value) {
          button.unwatch()
          takePic(count)
          var start = true
          socket.emit('start', start)
        })
    })
    if (callback) {
      callback()
    }
}
