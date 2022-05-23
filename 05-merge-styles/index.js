const path = require("path");
const fs = require("fs");

const stylesDirectory = path.join(__dirname, "styles");

async function readStyles(dirPath) {
    const styleFiles = await fs.promises.readdir(dirPath, {
        withFileTypes: true,
    });
    const stylesArr = [];

    for (const file of styleFiles) {
        const currentPath = path.join(dirPath, file.name);

        if (path.extname(file.name) === ".css" && !file.isDirectory()) {
            const data = await fs.promises.readFile(currentPath, "utf-8");
            stylesArr.push(data);
        }
    }
    createBundle(stylesArr);
}

readStyles(stylesDirectory);

async function createBundle(arr) {
    const outputStream = await fs.createWriteStream(
        path.join(__dirname, "project-dist", "bundle.css")
    );
    outputStream.write(arr.join(""));
}
