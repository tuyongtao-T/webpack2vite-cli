/*
 * @Author: tuyongtao1
 * @Date: 2024-03-19 13:44:51
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-03-21 14:08:20
 * @Description: 
 */
const { execSync } = require('child_process');

// 设置子进程的工作目录
const options = {
    cwd: process.cwd(), // 将此路径替换为你希望 npm 安装在哪个目录
    stdio: 'inherit' // 直接继承父进程的输入输出，以便在控制台看到输出
};


function installPackage() {
    try {
        // 同步执行命令
        execSync('npm i @originjs/vite-plugin-commonjs @originjs/vite-plugin-require-context @rollup/plugin-alias vite-plugin-node-polyfills vite-plugin-env-compatible vite-plugin-dynamic-import path-browserify sass@1.26 regex-parser ejs vite-plugin-vue2 vite@2 --save-dev', options);
        console.log('包安装成功！');
    } catch (error) {
        console.error(`执行的错误: ${error}`);
    }
}

module.exports = {
    installPackage
}