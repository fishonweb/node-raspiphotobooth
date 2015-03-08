
var RaspiCam = require("raspicam");
var count = 0




var keypress = require('keypress');

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
    var outputPath = "./pics/pic" + count + ".jpg";
    var options = {
      mode : "photo",
      width : 1024,
      height : 768,
      output : outputPath,
      quality : 10
    }
    var camera = new RaspiCam(options);
    camera.start()

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
