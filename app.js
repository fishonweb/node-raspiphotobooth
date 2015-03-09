
//gpio var
var led1_pin = 15,
    led2_pin = 19,
    led3_pin = 21,
    led4_pin = 23,
    ledBtn_pin = 11,
    button1_pin = 22,
    button2_pin = 18,
    button3_pin = 16;

    var gpio = require('rpi-gpio');

    gpio.setup(ledBtn_pin, gpio.DIR_IN, readInput);

    function readInput() {
        gpio.read(7, function(err, value) {
            console.log('The value is ' + value);
        });
    }

var RaspiCam = require("raspicam");
var count = 0


var outputPath = "./pics/pic" + count + ".jpg";
var options = {
  mode : "photo",
  width : 1024,
  height : 768,
  output : outputPath,
  quality : 10
}

var keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

var camera = new RaspiCam(options);
// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  if (key && key.ctrl && key.name == 'c') {
    console.log("goodbye !")
    process.exit();
  }
  //Listen for enter keypress and start camera
  if(key.name == "return"){
    outputPath = "./pics/pic" + count + ".jpg";
    var options = {
      mode : "photo",
      width : 1024,
      height : 768,
      output : outputPath,
      quality : 10
    }
    camera = new RaspiCam(options);
    camera.start()
    return camera
  }

});

//listen for the process to exit when the timeout has been reached
camera.on("exit", function(){
  count++
});


process.stdin.setRawMode(true);
process.stdin.resume();



//to take a snapshot, start a timelapse or video recording
//camera.start( );

//to stop a timelapse or video recording
/*setTimeout(function() {
  camera.stop();
}, 800)*/
