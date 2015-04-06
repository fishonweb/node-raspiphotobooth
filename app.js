var RaspiCam = require("raspicam");
var tile = require("./utils/tileimg.js")
var now = require("./utils/now.js")
var socket = require('socket.io-client')('http://localhost:3000');

var count = 1
var path = "./pics/"
var tileOutputPath = "./photobooth/"
var tileOutputName = "chloju" + now()
var input = []


var outputPath = "./pics/pic" + count + ".jpg";
var options = {
  mode : "photo",
  width : 1024,
  height : 768,
  output : outputPath,
  quality : 10,
  fullscreen : true
}
camera = RaspiCam(options);
var keypress = require('keypress');

function takePic(count) {
  console.log("takepic " + count)
  outputPath = path + "pic" + count + ".jpg";
  input.push("pic" + count + ".jpg")
  camera.set("output", outputPath)
  return camera.start()
}

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  if (key && key.ctrl && key.name == 'c') {
    console.log("goodbye !")
    process.exit();
  }
  //Listen for enter keypress and start camera
  if(key.name == "return"){
    takePic(count)
  }

});

//listen for the process to exit when the timeout has been reached
camera.on("exit", function(){
  //console.log(count)
  if(count < 2){
    count++
    camera.stop() //clear camera before take new pic
    takePic(count)
  } else {
    tile(path, input, tileOutputPath, tileOutputName)

    count = 1
  }
});


process.stdin.setRawMode(true);
process.stdin.resume();
