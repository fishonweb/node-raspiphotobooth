var gm = require("gm")


module.exports = function tile(inputFolder, inputArrayImgs, outputFolder, outputName) {
  // a b  ->  a
  //          b
  console.log("tile image")
  gm()
    .in('-page', '+0+0')  // Custom place for each of the images
    .in(inputFolder + "/" + inputArrayImgs[0])
    .in('-page', '+0+780')
    .in(inputFolder + "/" + inputArrayImgs[1])
    .mosaic()  // Merges the images as a matrix
    .write(outputFolder  + "/" + outputName +".jpg", function (err) {
      if (err) console.log(err);
        console.log(this.outname + " created  ::  " + arguments[3])
    })
}
