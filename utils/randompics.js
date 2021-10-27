const socket = require('socket.io-client')(`http://localhost:${process.env.SERVER_PORT}`);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const getRandomPics = (count, database) => {
  const stream = [];
  const randomPics = [];
  database.createValueStream()
    .on('data', (data) => {
      stream.push(data);
    })
    .on('end', () => {
      const len = stream.length;
      if (count > len) {
        for (let i = 0; i < len; i += i) {
          randomPics.push(stream[i].toString('utf8'));
        }
      } else {
        for (let i = 0; i < count; i += i) {
          randomPics.push(stream[getRandomInt(1, stream.length)]);
        }
      }
      socket.emit('random', randomPics);
    });
};

module.exports = getRandomPics;
