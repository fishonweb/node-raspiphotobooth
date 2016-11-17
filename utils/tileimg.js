var gm = require("gm")
var socket = require('socket.io-client')('http://localhost:3000');

module.exports = function tile(inputFolder, inputArrayImgs, outputFolder, outputName, tileNum, callback) {
    // a, b  ->  a b
    console.log("tile image")
    switch (tileNum.toString()) {
        case "1":
        console.log('>>>>>>>>>>>>>>>>>> case 1');
            gm(inputFolder + inputArrayImgs[0])
                .write(outputFolder  + outputName +".jpg", function (err) {
                    if (err) console.log(err);
                    socket.emit('photobooth', outputName);
                });
            break;
        case "2":
        console.log('>>>>>>>>>>>>>>>>>> case 2');

            gm()
                .in('-page', '+0+0')  // Custom place for each of the images
                .in(inputFolder + inputArrayImgs[0])
                .in('-page', '+1028+0')
                .in(inputFolder + inputArrayImgs[1])
                .mosaic()  // Merges the images as a matrix
                .write(outputFolder  + outputName +".jpg", function (err) {
                    if (err) console.log(err);
                    socket.emit('photobooth', outputName);
                });
            break;
        default:
        console.log('>>>>>>>>>>>>>>>>>> case default');

            gm()
                .in('-page', '+0+0')  // Custom place for each of the images
                .in(inputFolder + inputArrayImgs[0])
                .in('-page', '+1028+0')
                .in(inputFolder + inputArrayImgs[1])
                .mosaic()  // Merges the images as a matrix
                .write(outputFolder  + outputName +".jpg", function (err) {
                    if (err) console.log(err);
                    socket.emit('photobooth', outputName);
                });
                break;

    }
    if (callback) {
        callback()
    }
}
