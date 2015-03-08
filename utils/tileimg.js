var gm = require("gm")
var dir = __dirname + "/pics"

function tile() {
  // a b  ->  a
  //          b

  // appends imgs from top-to-bottom
  // gm("/pics/pic0.jpg")
  //   .append("./pics/pic1.jpg")
  //   .write('/pics/output2.jpg', function (err) {
  //     if (err) console.log(err);
  //   });

  gm(dir + "/pic0.jpg")
  .append(dir + "/pic1.jpg")
  .append()
  .background('#222')
  .write(dir + "/append.jpg", function (err) {
    if (err) return console.dir(arguments)
    console.log(this.outname + " created  ::  " + arguments[3])
    require('child_process').exec('open ' + dir + "/append.jpg")
  });
}

tile()
