const path = require('path');
const fs = require('fs');

const DIRECTORY_PATH = path.join(__dirname, 'secret-folder');

readDir(DIRECTORY_PATH);

async function readDir(directoryPath) {
  const options = { withFileTypes: true };
  const dirElements = await fs.promises.readdir(directoryPath, options);

  for (const element of dirElements) {
    currentPath = path.join(directoryPath, element.name);

    if (element.isDirectory()) {
      readDir(currentPath);
    } else {
      fileInfo(currentPath).then((info) => {
        console.log(info);
      });
    }
  }
}

async function fileInfo(filePath) {
  const file = await fs.promises.stat(filePath);
  const fileSize = file.size;
  const fileExtName = path.extname(filePath);
  const fileName = path.basename(filePath, fileExtName);
  const result = `${fileName}-${fileExtName.slice(1) || 'no-exe'}-${fileSize}b`;
  return result;
}
