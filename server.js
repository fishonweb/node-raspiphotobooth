var express = require('express')
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use('/photobooth', express.static('photobooth'));
app.use('/bower', express.static('bower_components'));
app.use(express.static('public/'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('photobooth', function(pic){
    console.log('new photobooth : ' + pic);
    io.emit('photobooth', pic);
  });
  socket.on('start', function(start){
    io.emit('start', start);
  });
  socket.on('again', function(again){
    io.emit('again', again);
  });
});



http.listen(3000, function(){
  console.log('listening on http://localhost:3000');
});