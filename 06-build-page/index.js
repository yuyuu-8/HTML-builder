const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const outputHTMLPath = path.join(projectDist, 'index.html');
const outputCSSPath = path.join(projectDist, 'style.css');
const outputAssetsPath = path.join(projectDist, 'assets');

async function copyDirectory(source, destination) {
  await fs.promises.mkdir(destination, { recursive: true });
  const entries = await fs.promises.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
    } else {
      await fs.promises.copyFile(sourcePath, destinationPath);
    }
  }
}

async function mergeStyles(stylesFolder, outputFile) {
  const files = await fs.promises.readdir(stylesFolder, { withFileTypes: true });
  const bundleStream = fs.createWriteStream(outputFile, 'utf-8');

  for (const file of files) {
    const filePath = path.join(stylesFolder, file.name);
    if (file.isFile() && path.extname(file.name) === '.css') {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      bundleStream.write(content + '\n');
    }
  }
}

async function buildHTML(templateFile, componentsFolder, outputFile) {
  let template = await fs.promises.readFile(templateFile, 'utf-8');

  const matches = template.match(/{{\s*[\w-]+\s*}}/g);
  if (matches) {
    for (const match of matches) {
      const tagName = match.replace(/{{\s*|\s*}}/g, '');
      const componentPath = path.join(componentsFolder, `${tagName}.html`);

      try {
        const componentContent = await fs.promises.readFile(componentPath, 'utf-8');
        template = template.replace(new RegExp(match, 'g'), componentContent);
      } catch (err) {
        console.warn(`Component for tag "${tagName}" not found.`);
      }
    }
  }

  await fs.promises.writeFile(outputFile, template, 'utf-8');
}

async function buildPage() {
  try {
    await fs.promises.mkdir(projectDist, { recursive: true });

    await buildHTML(templatePath, componentsPath, outputHTMLPath);

    await mergeStyles(stylesPath, outputCSSPath);

    await copyDirectory(assetsPath, outputAssetsPath);

    console.log('Page has been successfully built!');
  } catch (err) {
    console.error('Error during page build:', err.message);
  }
}

buildPage();