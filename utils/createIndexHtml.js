#!/usr/bin / env node

const fs = require('fs');

function createIndexHtml() {
    // 源文件路径
    const source = './public/index.html';
    // 目标文件路径
    const destination = './index.html';

    try {
        // 使用 fs.copyFileSync 方法同步复制文件
        fs.copyFileSync(source, destination);
        console.log('文件复制成功！');
        const data = fs.readFileSync(destination, 'utf8');

        console.log('查找 <div id="app"></div> 标签并在其后添加一行');
        const newContent = data.replace(/(<div id="app"><\/div>)/, `$1\n<script type="module" src="/src/main.js"></script>`);

        // 同步写入修改后的内容到文件
        fs.writeFileSync(destination, newContent, 'utf8');
        console.log('内容添加成功！');
    } catch (err) {
        console.error('复制文件时出错:', err);
    }

}

module.exports = {
    createIndexHtml
}
