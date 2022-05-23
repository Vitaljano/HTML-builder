const fs = require('fs');
const path = require('path');
const process = require('process');

const EXIT_SYMBOL = 'exit';
const OUTPUT_FILE = 'text.txt';

let writeOutputStream;

greeting();
handleTextInput();
handleParting();

function greeting() {
  process.stdout.write('Enter your text: \n');
}

function handleTextInput() {
  process.stdin.on('data', (chunk) => {
    let text = chunk.toString().trim();

    if (text === EXIT_SYMBOL) {
      process.exit(0);
    }
    writeTextToFile(text);
  });
}

async function writeTextToFile(text) {
  if (!writeOutputStream) {
    writeOutputStream = await fs.createWriteStream(path.join(__dirname, OUTPUT_FILE));
  }
  await writeOutputStream.write(`${text}\n`);
}

function handleParting() {
  process.on('SIGINT', () => {
    process.exit();
  });

  process.on('exit', () => {
    console.log('Good bye');
  });
}
