const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'file-copy');

try {
  readFolder(srcPath, destPath);
} catch (error) {
  console.log('Ups something is wrong', error);
}

async function createDir(destPath) {
  await fs.promises.mkdir(destPath, { recursive: true });
}

async function copyFile(srcPath, destPath) {
  fs.promises.copyFile(srcPath, destPath);
}

async function readFolder(srcPath, destPath) {
  const folderFiles = await fs.promises.readdir(srcPath, { withFileTypes: true });
  await createDir(destPath);
  for (const file of folderFiles) {
    copyFile(path.join(srcPath, file.name), path.join(destPath, file.name));
  }
}
