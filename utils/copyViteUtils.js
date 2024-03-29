/*
 * @Author: tuyongtao1
 * @Date: 2024-03-19 13:12:02
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-03-20 21:18:35
 * @Description: 
 */
const fs = require('fs');
const path = require('path');

// 递归创建目录
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

// 复制文件
function copyFileSync(source, target) {
    let targetFile = target;

    // 如果目标是目录，则创建相同的文件名
    if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
        targetFile = path.join(target, path.basename(source));
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

// 递归复制目录
function copyFolderRecursiveSync(source, target) {
    let files = [];

    // 检查目标目录是否需要创建
    const targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        mkdirsSync(targetFolder);
    }

    // 检查源目录是否是目录
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            const curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

const sourcePath = path.join(__dirname, '../viteUtils');
const targetPath = './';

function copyViteUtils() {
    copyFolderRecursiveSync(sourcePath, targetPath);
}


module.exports = {
    copyViteUtils
}

// const fs = require('fs');
// const path = require('path');

// function copyDirectory(src, dest) {
//     // 创建目标目录
//     if (!fs.existsSync(dest)) {
//         fs.mkdirSync(dest, { recursive: true });
//     }

//     // 读取源目录中的文件和文件夹
//     let entries = fs.readdirSync(src, { withFileTypes: true });

//     for (let entry of entries) {
//         let srcPath = path.join(src, entry.name);
//         let destPath = path.join(dest, entry.name);

//         // 判断是文件还是文件夹
//         entry.isDirectory() ? copyDirectory(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
//     }
// }


// const sourcePath = path.join(__dirname, '../viteUtils');
// const targetPath = './';

// function copyViteUtils() {
//     copyDirectory(sourcePath, targetPath);
// }
// module.exports = {
//     copyViteUtils
// }

