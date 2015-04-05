var express = require('express')
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use('/photobooth', express.static('photobooth'));

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
  });
});



http.listen(3000, function(){
  console.log('listening on http://localhost:3000');
});
