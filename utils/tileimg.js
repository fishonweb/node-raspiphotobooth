const gm = require('gm');

module.exports = function tile(inputFolder, inputArrayImgs, outputFolder, outputName) {
  // a, b  ->  a b
  console.log('tile image');
  return new Promise((resolve, reject) => {
    gm(inputFolder + inputArrayImgs[0])
      .write(`${outputFolder + outputName}.jpg`, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(outputName);
      });
  });
};
