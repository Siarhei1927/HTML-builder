let fs = require('fs');
let path = require('path');
let filePath = path.join(__dirname, 'text.txt');

fs.readFile(filePath, 'utf8', function (err, data) {
    console.log(data);
});
