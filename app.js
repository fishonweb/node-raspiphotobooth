var RaspiCam = require("raspicam");
var tile = require("./utils/tileimg.js");
var now = require("./utils/now.js");
var randomPics = require("./utils/randompics.js");
var socket = require("socket.io-client")(
  `http://localhost:${process.env.SERVER_PORT}`
);
var levelup = require("levelup");
var leveldown = require("leveldown");
var db = levelup(leveldown("./picsdb"));
var randomString = require("random-string");

var input = [];
var maxPics = 20;
var count = 1;
var photobooth = {
  path: "./pics/",
  tileOutputPath: "./photobooth/",
  tileOutputName: "photobooth",
  timer: 3000,
  picNumber: 2,
};

var pressed = false;

var Gpio = require("onoff").Gpio,
  led = new Gpio(14, "out"),
  button = new Gpio(4, "in", "both");

var rp = require("request-promise");

rp(`http://localhost:${process.env.SERVER_PORT}/api/getparams`)
  .then(function (params) {
    if (params != null) {
      params = JSON.parse(params);
      photobooth.picNumber = params.picNumber;
      photobooth.tileOutputName = params.title
        .replace(/[^a-z]/g, "")
        .replace(/\s/g, "_");
      photobooth.timer = params.time;
    }
  })
  .catch(function (err) {
    console.log(err);
  });

var outputPath = "./pics/pic" + count + ".jpg";
var options = {
  mode: "photo",
  width: 1024,
  height: 768,
  output: photobooth.path,
  quality: 10,
  timeout: photobooth.timer,
  fullscreen: true,
};
const camera = RaspiCam(options);
var keypress = require("keypress");

function takePic(count) {
  console.log("takepic " + count);
  outputPath = photobooth.path + "pic" + count + ".jpg";
  input.push("pic" + count + ".jpg");
  camera.set("output", outputPath);
  socket.emit("timer", photobooth.timer);
  return camera.start();
}

// make `process.stdin` begin emitting 'keypress' events
keypress(process.stdin);
console.log("keypress return");

// listen for the 'keypress' event
process.stdin.on("keypress", function (ch, key) {
  if (key && key.ctrl && key.name == "c") {
    console.log("goodbye !");
    process.exit();
  }
  if (key.name == "return") {
    console.log("keypress return");
    if (pressed === false) {
      pressed = true;
      console.log("key return pressed !");
      takePic(count);
      var start = true;
      led.writeSync(0);
      socket.emit("start", start);
    }
  }
});

//listen for the process to exit when the timeout has been reached
let tileOutputName = "";
camera.on("exit", function () {
  if (count < photobooth.picNumber) {
    count++;
    camera.stop(); //clear camera before take new pic
    takePic(count);
  } else {
    tileOutputName = photobooth.tileOutputName + now();
    tile(
      photobooth.path,
      input,
      photobooth.tileOutputPath,
      tileOutputName,
      photobooth.picNumber
    );
    count = 1;
  }
});

button.watch(function (err, value) {
  if (pressed === false) {
    pressed = true;
    console.log("button pressed !");
    takePic(count);
    var start = true;
    led.writeSync(0);
    socket.emit("start", start);
  }
});

led.writeSync(1);

socket.on("picAgain", function () {
  pressed = false;
  led.writeSync(1);
  return pressed;
});

function getRandomString() {
  var x = randomString();
  return x;
}

socket.on("photobooth", function (outputName) {
  console.log(outputName);
  db.put(getRandomString(), outputName, function (err) {
    if (err) return console.log("Ooops!", err); // some kind of I/O error
  });
  randomPics(maxPics, db);
});

process.stdin.setRawMode(true);
process.stdin.resume();
