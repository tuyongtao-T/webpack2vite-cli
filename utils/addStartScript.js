/*
 * @Author: tuyongtao1
 * @Date: 2024-03-21 14:38:09
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-03-21 14:43:21
 * @Description: 
 */
const fs = require('fs');

function addStartScript() {
    try {
        const data = fs.readFileSync('./package.json', { encoding: 'utf-8' });
        // 解析JSON数据
        let packageObj = JSON.parse(data);
        // 修改字段
        packageObj.scripts.vite = `vite`
        const updatedPackageJson = JSON.stringify(packageObj, null, 2); // 使用2个空格进行缩进
        fs.writeFileSync('./package.json', updatedPackageJson, { encoding: 'utf-8' })

    } catch (error) {
        process.exit(1)
    }

}

module.exports = {
    addStartScript
}