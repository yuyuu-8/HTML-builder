const fs = require('fs');
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const targetDir = path.join(__dirname, 'files-copy');

  try {
    await fs.promises.rm(targetDir, { recursive: true, force: true });
    await fs.promises.mkdir(targetDir, { recursive: true });

    const items = await fs.promises.readdir(sourceDir, { withFileTypes: true });

    for (const item of items) {
      const sourcePath = path.join(sourceDir, item.name);
      const targetPath = path.join(targetDir, item.name);

      if (item.isDirectory()) {
        await copyDirRecursive(sourcePath, targetPath);
      } else if (item.isFile()) {
        await fs.promises.copyFile(sourcePath, targetPath);
      }
    }

    console.log('Directory copied successfully!');
  } catch (error) {
    console.error('Error copying directory:', error.message);
  }
}

async function copyDirRecursive(source, target) {
  await fs.promises.mkdir(target, { recursive: true });
  const items = await fs.promises.readdir(source, { withFileTypes: true });

  for (const item of items) {
    const sourcePath = path.join(source, item.name);
    const targetPath = path.join(target, item.name);

    if (item.isDirectory()) {
      await copyDirRecursive(sourcePath, targetPath);
    } else if (item.isFile()) {
      await fs.promises.copyFile(sourcePath, targetPath);
    }
  }
}

copyDir();
