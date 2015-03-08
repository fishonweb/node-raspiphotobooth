var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/pics', function (req, res) {
  app.use(express.static('pics'));
})

app.listen(3000)
