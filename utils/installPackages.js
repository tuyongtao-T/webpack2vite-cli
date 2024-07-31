const { execSync } = require('child_process');

const vitePlugins = [ 
    'vite-plugin-dynamic-import@1.5.0', 
    'vite-plugin-env-compatible@1.1.1', 
    'vite-plugin-node-polyfills@0.7.0',
    '@originjs/vite-plugin-commonjs@1.0.3', 
    '@originjs/vite-plugin-require-context@1.0.9', 
    '@rollup/plugin-alias@5.1.0', 
    'path-browserify@1.0.1',
    'sass@1.26.8',
]
const vite = [
    'vite-plugin-vue2@1.9.0',
    'vite@2.9.18'
]

// 设置子进程的工作目录
const options = {
    cwd: process.cwd(), // 将此路径替换为你希望 npm 安装在哪个目录
    stdio: 'inherit' // 直接继承父进程的输入输出，以便在控制台看到输出
};

function installPackage() {
    try {
        // 同步执行命令
        const viteInstallCommand = `npm i ${vite.join(' ')} - D`
        const pluginInstallCommand = `npm i ${vitePlugins.join(' ')} - D`
        execSync(viteInstallCommand, options);
        console.log('vite包安装成功！');
        execSync(pluginInstallCommand, options);
        console.log('vite 插件安装成功！');
    } catch (error) {
        console.error(`执行的错误: ${error}`);
    }
}

module.exports = {
    installPackage
}