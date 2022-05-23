const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath);

readStream
  .on('data', (chunk) => {
    stdout.write(chunk.toString());
  })
  .on('error', (err) => {
    stdout.write('Ups, something wrong');
  });
