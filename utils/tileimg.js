var gm = require('gm')
var socket = require('socket.io-client')('http://localhost:3000');

module.exports = function tile(inputFolder, inputArrayImgs, outputFolder, outputName, tileNum, callback) {
    // a, b  ->  a b
    console.log("tile image")
    gm(inputFolder + inputArrayImgs[0])
        .write(outputFolder + outputName + '.jpg', function (err) {
            if (err) console.log(err);
            socket.emit('photobooth', outputName);
        });
    if (callback) {
        callback()
    }
}
