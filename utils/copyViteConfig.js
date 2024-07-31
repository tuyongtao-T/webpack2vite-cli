/*
 * @Author: tuyongtao1
 * @Date: 2024-03-19 13:34:29
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-03-20 20:53:39
 * @Description: 
 */
const fs = require('fs');
const path = require('path');

// 定义源文件路径和目标文件路径
const sourceFilePath = path.join(__dirname, '../template/vite.config.js');
const targetFilePath = process.cwd() + '/vite.config.js';

function copyViteConfig() {
    // 同步复制文件
    try {
        fs.copyFileSync(sourceFilePath, targetFilePath);
        console.log('vite.config.js 复制成功');
    } catch (err) {
        console.error('Error occurred while copying the file:', err);
    }
}

module.exports = {
    copyViteConfig
}

