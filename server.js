var express = require('express')
var app = express()


app.use('/pics', express.static('pics'));

app.get('/', function (req, res) {
  res.send('Hello World')
})



app.listen(3000)
