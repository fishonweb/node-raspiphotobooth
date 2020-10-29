const RaspiCam = require('raspicam');

const photobooth = {
  path: './pics/',
  tileOutputPath: './photobooth/',
  tileOutputName: 'photobooth',
  timer: 3000,
  picNumber: 2,
};

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

let pressed = false;

const rpio = require('rpio');

// init rpio
const ledPin = 8;
const buttonPin = 7;
rpio.open(ledPin, rpio.OUTPUT, rpio.HIGH);
rpio.open(buttonPin, rpio.INPUT, rpio.PULL_UP);

const rp = require('request-promise');
const now = require('./utils/now.js');
const tile = require('./utils/tileimg.js');
const randomPics = require('./utils/randompics.js');

let DEBUG = false;

const myArgs = process.argv.slice(2);
if (myArgs[0] === '--debug') {
  DEBUG = true;
}

function getRandomString() {
  const x = randomString();
  return x;
}

function mockCamera() {
  input[0] = 'debug.jpg';
  const tileOutputName = photobooth.tileOutputName + now();
  tile(
    photobooth.path,
    input,
    photobooth.tileOutputPath,
    tileOutputName,
    photobooth.picNumber,
  ).then((outputName) => {
    db.put(getRandomString(), outputName, (err) => {
      if (err) {
        console.log('Ooops!', err);
      }
    });
    return randomPics(maxPics, db);
  }).catch((err) => console.error(err));
  count = 1;
  pressed = false;
}

rp(`http://localhost:${process.env.SERVER_PORT}/api/getparams`)
  .then((params) => {
    if (params != null) {
      // eslint-disable-next-line no-param-reassign
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

function takePic(counter) {
  console.log(`takepic ${counter}`);
  outputPath = `${photobooth.path}pic${counter}.jpg`;
  input.push(`pic${counter}.jpg`);
  camera.set('output', outputPath);
  socket.emit('timer', photobooth.timer);
  if (DEBUG) {
    mockCamera();
  } else {
    camera.start();
  }
}

function pressButton() {
  if (pressed === false) {
    pressed = true;
    console.log('button pressed !');
    takePic(count);
    const start = true;
    rpio.write(ledPin, rpio.LOW);
    socket.emit('start', start);
  }
}

rpio.poll(buttonPin, (cbpin) => {
  rpio.msleep(30);
  const state = rpio.read(cbpin) ? 'released' : 'pressed';
  console.log('Button event on P%d (button currently %s)', cbpin, state);
  pressButton();
});

// make `process.stdin` begin emitting 'keypress' events
keypress(process.stdin);

// listen for the 'keypress' event
process.stdin.on('keypress', (ch, key) => {
  if (key && key.ctrl && key.name === 'c') {
    console.log('goodbye !');
    process.exit();
  }
  if (key.name === 'return') {
    console.log('keypress return');
    pressButton();
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
    ).then((outputName) => {
      db.put(getRandomString(), outputName, (err) => {
        if (err) {
          console.log('Ooops!', err);
        }
      });
      return randomPics(maxPics, db);
    }).catch((err) => console.error(err));
    count = 1;
  }
});

socket.on('picAgain', () => {
  pressed = false;
  rpio.write(ledPin, rpio.HIGHT);
  return pressed;
});

process.stdin.setRawMode(true);
process.stdin.resume();
