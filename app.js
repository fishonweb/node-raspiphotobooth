const RaspiCam = require('raspicam');
const tile = require('./utils/tileimg.js');
const now = require('./utils/now.js');
const socket = require('socket.io-client')(
  `http://localhost:${process.env.SERVER_PORT}`,
);
const levelup = require('levelup');
const leveldown = require('leveldown');

const db = levelup(leveldown('./picsdb'));
const randomString = require('random-string');

const input = [];
const maxPics = 20;
let count = 1;
const photobooth = {
  path: './pics/',
  tileOutputPath: './photobooth/',
  tileOutputName: 'photobooth',
  timer: 3000,
  picNumber: 2,
};

let pressed = false;

const { Gpio } = require('onoff');

const led = new Gpio(14, 'out');
const button = new Gpio(4, 'in', 'both');

const rp = require('request-promise');

rp(`http://localhost:${process.env.SERVER_PORT}/api/getparams`)
  .then((params) => {
    if (params != null) {
      params = JSON.parse(params);
      photobooth.picNumber = params.picNumber;
      photobooth.tileOutputName = params.title
        .replace(/[^a-z]/g, '')
        .replace(/\s/g, '_');
      photobooth.timer = params.time;
    }
  })
  .catch((err) => {
    console.log(err);
  });

let outputPath = `./pics/pic${count}.jpg`;
const options = {
  mode: 'photo',
  width: 1024,
  height: 768,
  output: photobooth.path,
  quality: 10,
  timeout: photobooth.timer,
  fullscreen: true,
};
const camera = RaspiCam(options);
const keypress = require('keypress');
const randomPics = require('./utils/randompics.js');

function takePic(count) {
  console.log(`takepic ${count}`);
  outputPath = `${photobooth.path}pic${count}.jpg`;
  input.push(`pic${count}.jpg`);
  camera.set('output', outputPath);
  socket.emit('timer', photobooth.timer);
  return camera.start();
}

// make `process.stdin` begin emitting 'keypress' events
keypress(process.stdin);
console.log('keypress return');

// listen for the 'keypress' event
process.stdin.on('keypress', (ch, key) => {
  if (key && key.ctrl && key.name == 'c') {
    console.log('goodbye !');
    process.exit();
  }
  if (key.name == 'return') {
    console.log('keypress return');
    if (pressed === false) {
      pressed = true;
      console.log('key return pressed !');
      takePic(count);
      const start = true;
      led.writeSync(0);
      socket.emit('start', start);
    }
  }
});

// listen for the process to exit when the timeout has been reached
let tileOutputName = '';
camera.on('exit', () => {
  if (count < photobooth.picNumber) {
    count += count;
    camera.stop(); // clear camera before take new pic
    takePic(count);
  } else {
    tileOutputName = photobooth.tileOutputName + now();
    tile(
      photobooth.path,
      input,
      photobooth.tileOutputPath,
      tileOutputName,
      photobooth.picNumber,
    );
    count = 1;
  }
});

button.watch((err, value) => {
  if (pressed === false) {
    pressed = true;
    console.log('button pressed !');
    takePic(count);
    const start = true;
    led.writeSync(0);
    socket.emit('start', start);
  }
});

led.writeSync(1);

socket.on('picAgain', () => {
  pressed = false;
  led.writeSync(1);
  return pressed;
});

function getRandomString() {
  const x = randomString();
  return x;
}

socket.on('photobooth', (outputName) => {
  console.log(outputName);
  db.put(getRandomString(), outputName, (err) => {
    if (err) return console.log('Ooops!', err); // some kind of I/O error
  });
  randomPics(maxPics, db);
});

process.stdin.setRawMode(true);
process.stdin.resume();
