var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var levelup = require("levelup");
var leveldown = require("leveldown");
var dbParams = levelup(leveldown('./params'));

app.use('/photobooth', express.static('photobooth'));
app.use('/bower', express.static('bower_components'));
app.use(express.static('public/'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/public/admin.html');
});

app.get('/api/params', function (req, res) {
  var params = {
    title: req.query.title,
    time: req.query.time
  };
  dbParams.put('params', JSON.stringify(params), function (err) {
    console.log('sett params');
    if (err) {
      return console.log('Ooops!', err); // some kind of I/O error
    }
  })
  res.json(params);
});

app.get('/api/getparams', function (req, res) {
  dbParams.get('params', function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found

    // ta da!
    var appParam = JSON.parse(value);
    res.jsonp(appParam);
  })
})

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('photobooth', function (pic) {
    console.log('socket emit pic : ' + pic);
    io.emit('photobooth', pic);
  });
  socket.on('timer', function (timer) {
    console.log('socket emit timer');
    io.emit('timer', timer);
  });
  socket.on('random', function (randompics) {
    console.log('socket emit random');
    io.emit('random', randompics);
  });
  socket.on('start', function (start) {
    io.emit('start', start);
  });
  socket.on('picAgain', function (picAgain) {
    console.log('pic again');
    io.emit('picAgain', picAgain);
  });
});

http.listen(3000, function () {
  console.log('listening on http://localhost:3000');
});
