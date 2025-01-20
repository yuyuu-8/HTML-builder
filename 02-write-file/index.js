const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const fileStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Welcome! Please enter text to save it to a file. Type "exit" or press Ctrl+C to quit.');

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Thank you for using the program. Goodbye!');
    rl.close();
  } else {
    fileStream.write(input + '\n', (err) => {
      if (err) {
        console.error('Error writing to file:', err.message);
      }
      console.log('Input saved to file. Enter some more or type "exit" or press Ctrl+C to quit.');
    });
  }
});

rl.on('SIGINT', () => {
  console.log('\nThank you for using the program. Goodbye!');
  rl.close();
});