const fs = require('fs/promises');
const path = require('path');

async function displayFilesInfo() {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const stats = await fs.stat(filePath);
        const fileSizeInKB = (stats.size / 1024).toFixed(3); // convert to KB
        const fileExtension = path.extname(file.name).slice(1); // extension without dot
        console.log(`${file.name} - ${fileExtension} - ${fileSizeInKB}kb`);
      }
    }
  } catch (error) {
    console.error('Error reading files:', error.message);
  }
}

displayFilesInfo();
