const fs = require('fs');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist');
const bundlePath = path.join(outputFolder, 'bundle.css');

async function mergeStyles() {
  try {
    await fs.promises.mkdir(outputFolder, { recursive: true });

    const files = await fs.promises.readdir(stylesFolder, { withFileTypes: true });

    const bundleStream = fs.createWriteStream(bundlePath, 'utf-8');

    for (const file of files) {
      const filePath = path.join(stylesFolder, file.name);

      if (file.isFile() && path.extname(file.name) === '.css') {
        const cssContent = await fs.promises.readFile(filePath, 'utf-8');

        bundleStream.write(cssContent + '\n');
      }
    }

    console.log('CSS files have been successfully merged into bundle.css!');
  } catch (err) {
    console.error('Error during merging styles:', err.message);
  }
}

mergeStyles();
