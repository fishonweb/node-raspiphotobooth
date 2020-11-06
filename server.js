const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const levelup = require('levelup');
const leveldown = require('leveldown');

const dbParams = levelup(leveldown('./params'));
const dbPictures = levelup(leveldown('./picsdb'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use('/photobooth', express.static('photobooth'));
app.use(express.static('dist/'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.get('/admin', (req, res) => {
  res.sendFile(`${__dirname}/dist/admin.html`);
});

app.get('/pictures', (req, res) => {
  const stream = [];
  dbPictures.createValueStream()
    .on('data', (data) => {
      stream.push(data.toString('utf8'));
    })
    .on('end', () => {
      res.json(stream);
    });
});

app.post('/api/params', (req, res) => {
  const params = {
    title: req.query.title,
    time: req.query.time,
  };
  dbParams.put('params', JSON.stringify(params), (err) => {
    console.log('sett params');
    if (err) {
      return console.log('Ooops!', err); // some kind of I/O error
    }
  });
  res.json(params);
});

app.get('/api/getparams', (req, res) => {
  dbParams.get('params', (err, value) => {
    if (err) return console.log('Ooops!', err); // likely the key was not found

    // ta da!
    const appParam = JSON.parse(value);
    res.jsonp(appParam);
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  io.emit('welcome');
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
