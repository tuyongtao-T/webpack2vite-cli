# 介绍

该项目提供基础的 vue-cli 搭建的 vue2 项目转为 vite 启动的能力，目标是： 对项目不进行大改动的基础上，提高本地开发构建时的效率。

该库提供的能力：

- 自动化的生成 vite 需要的 HTML 文件和 vite.config.js 文件
- 自动的环境变量转换： 兼容 webpack 获取 env 方式。不需要更改项目中获取环境变量的方式
- 兼容 node 中的一些 api,如 兼容 require.context。
- 等 webpack 与 vite 不兼容的功能。

# 使用

## 安装

```
$ npm i webpack2vite-cli -D
```

## 执行

```
$ w2v
```

## 启动

```
$ npm run vite
```

# FQA

1. SCSS 导出的变量在 JS 文件找不到,如下

   ```scss
   :export {
   }
   ```

   Vite 中，如果你希望使用 CSS Modules 功能来局部化组件的样式，确实需要按照特定的命名约定来命名你的 SCSS 文件。通常，这个约定是将文件命名为 \*.module.scss，这样 Vite 和其他构建工具就能够识别这些文件并作为 CSS Modules 来处理它们。

2. 遇到 process.pwd() 问题

   在 main.js 中 引入 process 变量，执行 window.process = process

3. commonjs 和 ES6 module 导入问题
   手动更改一下模块导出引入方式

4. JSX 预发兼容问题

```
vnodes.push(<i class="iconfont sidebar-icon">{(icon)}</i>)
```
vue SFC组件提示不识别jsx语法，需要手动添加`lang="jsx"`或`lang="tsx"`

