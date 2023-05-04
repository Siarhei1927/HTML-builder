const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const filePath = '02-write-file/output.txt';

fs.open(filePath, 'w', function (err, fd) {
    if (err) throw err;

    fs.close(fd, function (err) {
        if (err) throw err;
    });
});

rl.setPrompt('Введите текст: ');
rl.prompt();

rl.on('line', function (input) {
    if (input === 'exit') {
        console.log('Завершение работы');
        rl.close();
    } else {
        fs.appendFile(filePath, input + '\n', function (err) {
            if (err) throw err;
        });
        rl.prompt();
    }
});

rl.on('close', function () {
    console.log('Программа завершена');
});
