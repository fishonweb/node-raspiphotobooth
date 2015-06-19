var RaspiCam = require("raspicam")
var tile = require("./utils/tileimg.js")
var now = require("./utils/now.js")
var socket = require("socket.io-client")("http://localhost:3000")
var Gpio = require("onoff").Gpio,
  button = new Gpio(4, "in", "both")
var levelup = require("levelup")
var db = levelup("./mydb")

var count = 1
var path = "./pics/"
var tileOutputPath = "./photobooth/"
var tileOutputName = "chloju" + now()
var input = []


var outputPath = "./pics/pic" + count + ".jpg"
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
  outputPath = path + "pic" + count + ".jpg"
  input.push("pic" + count + ".jpg")
  camera.set("output", outputPath)
  return camera.start()
}

function getNewPic() {
  takePic(count)
  var start = true
  socket.emit('start', start)
}

function addValueToDB(key, value) {
  db.put(key, value, function (err) {
    if (err) return console.log('Ooops!', err) // some kind of I/O error
  })
}

function getValueFromDB(key) {
  db.get(key, function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found
    // ta da!
    console.log('name=' + value)
  })
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
    getNewPic()
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
    tileOutputName = "chloju" + now()
    tile(path, input, tileOutputPath, tileOutputName)
    //save in database

    //init counter
    count = 1
  }
});

//GPIO support
button.watch(function(err, value) {
  getNewPic()
});

process.stdin.setRawMode(true);
process.stdin.resume();