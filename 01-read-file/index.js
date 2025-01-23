const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath, 'utf8');
readStream.pipe(process.stdout);

readStream.on('error', (err) => {
    console.log("Error: ", err.message);
});