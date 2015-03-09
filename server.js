var express = require('express')
var app = express()


app.use('/pics', express.static('pics'));

app.get('/', function (req, res) {
  res.send('<img src="./pics/pic1.jpg" />')
})

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

console.log(getRandomInt(2, 10))

app.listen(3000)
