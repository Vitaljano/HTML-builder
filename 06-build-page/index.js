const path = require('path');
const fs = require('fs');

const SRC_PATH = path.join(__dirname);
const DEST_PATH = path.join(__dirname, 'project-dist');

createFolder(path.join(__dirname, 'project-dist'));
copyFolder(path.join(SRC_PATH, 'assets'), path.join(DEST_PATH, 'assets'));
index();
style();
async function createFolder(folderPath) {
  await fs.promises.mkdir(folderPath, { recursive: true });
}

async function copyFolder(srcPath, destPath) {
  const dir = await fs.promises.readdir(srcPath, { withFileTypes: true });
  let currentPath = '';
  // createFolder(destPath);

  for (const element of dir) {
    currentPath = path.join(srcPath, element.name);

    if (element.isDirectory()) {
      await createFolder(path.join(destPath, element.name));
      await copyFolder(currentPath, path.join(destPath, element.name));
      // console.log(currentPath);
    } else {
      await fs.promises.copyFile(currentPath, path.join(destPath, element.name));
    }
  }
}

async function readTemplate() {
  try {
    const data = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function index() {
  try {
    const componentPath = path.join(__dirname, 'components');
    const writeStream = await fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
    let html = await readTemplate();
    // Replace html template
    // console.log(componentPath);
    // console.log(html.replace('{{header}}', 'WTF'));

    const components = await fs.promises.readdir(componentPath, { withFileTypes: true });
    for (const component of components) {
      const tmp = await fs.promises.readFile(path.join(componentPath, component.name));
      const tmpName = path.basename(component.name, path.extname(component.name));

      html = html.replace(`{{${tmpName}}}`, tmp);
    }
    writeStream.write(html);
  } catch (err) {
    console.log(err);
  }
}

async function style() {
  const STYLE_PATH = path.join(__dirname, 'styles');
  const STYLE_DIST_PATH = path.join(__dirname, 'project-dist', 'style.css');
  let result = '';
  const dir = await fs.promises.readdir(STYLE_PATH, { withFileTypes: true });

  for (const file of dir) {
    result += await fs.promises.readFile(path.join(STYLE_PATH, file.name));
  }

  const writeStream = await fs.createWriteStream(STYLE_DIST_PATH);
  writeStream.write(result);
}
