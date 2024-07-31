const inquirer = require('inquirer')

const defaultConfig = {
  // index.html文件的位置
  indexDist: './public/index.html',
  // 入口文件
  entry: './src/main.js',
}

// 定义问题
const questions = [
  {
    type: 'confirm',
    name: 'indexHtmlIsDefault',
    message: `index.html文件位置是否是 ${defaultConfig.indexDist} ?`,
  },
  {
    type: 'input',
    name: 'indexHtmlIsDefaultDest',
    message: '请输入index.html 文件位置',
    when: (answers) => answers.indexHtmlIsDefault === false, // 仅当用户确认时显示此问题
  },
  {
    type: 'confirm',
    name: 'mainJsIsDefault',
    message: `入口文件位置是否为 ${defaultConfig.entry} ?`,
  },
  {
    type: 'input',
    name: 'mainJsIsDefaultDest',
    message: '请输入入口文件位置',
    when: (answers) => answers.mainJsIsDefault === false, // 仅当用户确认时显示此问题
  },
]

module.exports = {
  inquirer,
  questions,
  defaultConfig
}