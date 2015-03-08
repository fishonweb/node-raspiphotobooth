var gm = require("gm")
var dir = "./pics"

function tile() {
  // a b  ->  a
  //          b

  // appends imgs from top-to-bottom
  // gm("/pics/pic0.jpg")
  //   .append("./pics/pic1.jpg")
  //   .write('/pics/output2.jpg', function (err) {
  //     if (err) console.log(err);
  //   });

gm()
  .in('-page', '+0+0')  // Custom place for each of the images
  .in(dir + "/pic0.jpg")
  .in('-page', '+0+780')
  .in(dir + "/pic1.jpg")
  .mosaic()  // Merges the images as a matrix
  .write(dir  + '/output.jpg', function (err) {
    if (err) console.log(err);
      console.log(this.outname + " created  ::  " + arguments[3])
  })
}

tile()
