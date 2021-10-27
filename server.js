const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const levelup = require('levelup');
const leveldown = require('leveldown');

const dbParams = levelup(leveldown('./params'));
const dbPictures = levelup(leveldown('./picsdb'));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // handle URL-encoded data
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  next();
});

app.get('/pictures', (req, res) => {
  const stream = [];
  dbPictures
    .createValueStream()
    .on('data', (data) => {
      stream.push(data.toString('utf8'));
    })
    .on('end', () => {
      res.json(stream);
    });
});

app.post('/api/params', (req, res) => {
  const params = {
    title: req.body.title,
    time: req.body.time,
  };
  dbParams.put('params', JSON.stringify(params), (err) => {
    if (err) {
      return console.log('Ooops!', err); // some kind of I/O error
    }
  });
  res.json(params);
});

app.get('/api/getparams', (req, res) => {
  dbParams.get('params', (err, value) => {
    if (err) return console.log('Ooops!', err);
    const appParam = JSON.parse(value);
    res.jsonp(appParam);
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('photobooth', (pic) => {
    console.log(`socket emit pic : ${pic}`);
    io.emit('photobooth', pic);
  });
  socket.on('timer', (timer) => {
    console.log('socket emit timer');
    io.emit('timer', timer);
  });
  socket.on('random', (randompics) => {
    console.log('socket emit random');
    io.emit('random', randompics);
  });
  socket.on('start', (start) => {
    io.emit('start', start);
  });
  socket.on('picAgain', (picAgain) => {
    console.log('pic again');
    io.emit('picAgain', picAgain);
  });
});

http.listen(3009, () => {
  console.log('listening on http://localhost:3009');
});
