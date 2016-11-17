var RaspiCam = require('raspicam');
var tile = require('./utils/tileimg.js');
var now = require('./utils/now.js');
var randomPics = require('./utils/randompics.js');
var socket = require('socket.io-client')('http://localhost:3000');
var levelup = require('levelup');
var db = levelup('./picsdb');
var randomString = require('random-string');
var nodeArgs = process.argv.slice(2);

var input = [];
var maxPics = 20;
var count = 1;
var photobooth = {
    path: './pics/',
    tileOutputPath: './photobooth/',
    tileOutputName: 'photobooth',
    timer: 3000,
    picNumber: 2
}

var pressed = false;

var Gpio = require('onoff').Gpio,
  led = new Gpio(14, 'out'),
  button = new Gpio(4, 'in', 'both');

var rp = require('request-promise');

rp('http://localhost:3000/api/getparams')
    .then(function (params) {
        if (params != null) {
            params = JSON.parse(params);
            photobooth.picNumber = params.picNumber;
            photobooth.tileOutputName = params.title.replace(/[^a-z]/g, '').replace(/\s/g, '_');
            photobooth.timer = params.time;
        }
    })
    .catch(function (err) {
        console.log(err);
    });

var outputPath = './pics/pic' + count + '.jpg';
var options = {
  mode : 'photo',
  width : 1024,
  height : 768,
  output : photobooth.path,
  quality : 10,
  timeout : photobooth.timer,
  fullscreen : true
}
camera = RaspiCam(options);
var keypress = require('keypress');

function takePic(count) {
  console.log('takepic ' + count);
  outputPath = photobooth.path + 'pic' + count + '.jpg';
  input.push('pic' + count + '.jpg');
  camera.set('output', outputPath);
  socket.emit('timer', photobooth.timer);
  return camera.start();
}

// make `process.stdin` begin emitting 'keypress' events
keypress(process.stdin);
// listen for the 'keypress' event
process.stdin.on('keypress', function (ch, key) {
  if (key && key.ctrl && key.name == 'c') {
    console.log('goodbye !');
    process.exit();
  }
  //Listen for enter keypress and start camera
  if(key.name == 'return'){
    if (pressed === false) {
      pressed = true;
      console.log('button pressed !');
      takePic(count);
      var start = true;
      led.writeSync(0);
      socket.emit('start', start);
    }
  }

});

//listen for the process to exit when the timeout has been reached
camera.on('exit', function(){
  //console.log(count)
  if(count < photobooth.picNumber){
    count++;
    camera.stop(); //clear camera before take new pic
    takePic(count);
  } else {
    tileOutputName = photobooth.tileOutputName + now();
    tile(photobooth.path, input, photobooth.tileOutputPath, tileOutputName, photobooth.picNumber);

    count = 1
  }
})

button.watch(function(err, value) {
  if (pressed === false) {
    pressed = true
    console.log('button pressed !')
    takePic(count)
    var start = true
    led.writeSync(0)
    socket.emit('start', start)
  }
})

led.writeSync(1)

socket.on('picAgain', function() {
  pressed = false
  led.writeSync(1)
  return pressed
})

function getRandomString() {
  var x = randomString()
  return x
}

socket.on('photobooth', function(outputName) {
  db.put(getRandomString(), outputName, function (err) {
    if (err) return console.log('Ooops!', err) // some kind of I/O error
  })
 randomPics(maxPics, db)
})

process.stdin.setRawMode(true);
process.stdin.resume();
