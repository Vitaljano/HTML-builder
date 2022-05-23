const path = require("path");
const fsi = require("fs");
const fs = require("fs").promises;

const DIST_FOLDER = "project-dist";
const DEST_PATH = path.join(__dirname, DIST_FOLDER);
const SRC_PATH = path.join(__dirname);

const assetsSrcPath = path.join(SRC_PATH, "assets");
const assetsDestPath = path.join(DEST_PATH, "assets");
const styleDestPath = path.join(DEST_PATH, "style.css");
const styleSrcPath = path.join(SRC_PATH, "styles");
const componentPath = path.join(__dirname, "components");
const indexPath = path.join(DEST_PATH, "index.html");

removeDist().then(() => {
    createFolder(DEST_PATH);
    copyAssetFolder(assetsSrcPath, assetsDestPath);
    index();
    style();
});

function removeDist() {
    return fs.rm(DEST_PATH, { recursive: true, force: true });
}
async function createFolder(folderPath) {
    await fs.mkdir(folderPath, { recursive: true });
}

async function copyAssetFolder(srcPath, destPath) {
    const dir = await fs.readdir(srcPath, { withFileTypes: true });
    let currentPath = "";

    for (const element of dir) {
        currentPath = path.join(srcPath, element.name);

        if (element.isDirectory()) {
            await createFolder(path.join(destPath, element.name));
            await copyAssetFolder(
                currentPath,
                path.join(destPath, element.name)
            );
        } else {
            await fs.copyFile(currentPath, path.join(destPath, element.name));
        }
    }
}

async function readTemplate() {
    try {
        const data = await fs.readFile(
            path.join(__dirname, "template.html"),
            "utf-8"
        );
        return data;
    } catch (err) {
        console.log("Ups something wrong with Template", err);
    }
}

async function index() {
    try {
        let html = await readTemplate();

        const components = await fs.readdir(componentPath, {
            withFileTypes: true,
        });
        for (const component of components) {
            const tmp = await fs.readFile(
                path.join(componentPath, component.name)
            );
            const tmpExt = path.extname(component.name);
            const tmpName = path.basename(component.name, tmpExt);

            html = html.replace(`{{${tmpName}}}`, tmp);
        }

        fs.writeFile(indexPath, html);
    } catch (err) {
        console.log("Ups something wrong Index html", err);
    }
}

async function style() {
    try {
        let result = "";
        const dir = await fs.readdir(styleSrcPath, { withFileTypes: true });

        for (const file of dir) {
            result += await fs.readFile(path.join(styleSrcPath, file.name));
        }

        fs.writeFile(styleDestPath, result);
    } catch (err) {
        console.log("Ups. something is wrong with Styles... ", err);
    }
}
