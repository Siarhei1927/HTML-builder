let fs = require('fs');
let path = require('path');
let filePath = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(filePath, 'utf8');

stream.on('data', (chunk) => {
    console.log(chunk);
});

