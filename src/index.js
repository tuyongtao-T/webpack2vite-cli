/*
 * @Author: tuyongtao1
 * @Date: 2024-03-06 10:42:41
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-03-06 13:51:16
 * @Description: 
 */
import { confirm } from '@inquirer/prompts';
import { execSync } from 'child_process'
import cliProgress from 'cli-progress'

const cliInstance = new cliProgress.SingleBar({
    format: 'progress [{bar}] {percentage}% | {doSomething} | {value}/{total}',
}, cliProgress.Presets.shades_classic)
async function run() {
    console.log('----开始----');
    await confirm({ message: '确认使用vite作为本地开发构建工具?' });
    console.log('%c----准备安装vite 工具包----', "color:red;")
    // 创建一个进度条实例

    execSync('npm i @originjs/vite-plugin-commonjs @originjs/vite-plugin-require-context @rollup/plugin-alias vite-plugin-env-compatible vite-plugin-dynamic-import path-browserify sass@1.26 regex-parser ejs --save-dev ', (err) => {
        if (err) {
            console.error(`Error installing dependencies: ${err}`);
            return;
        }
        // 进度条结束
        bar.stop();
        console.log('%c----安装vite 工具包完成----', "color:green;")
    });
    // 开始进度条
    bar.start(0);

    // 模拟进度更新
    setInterval(() => {
        bar.update(Math.min(bar.total, bar.curr + 10));
    }, 100);
    console.log('%c----准备安装vite----', "color:red;")
    const bar2 = new ProgressBar('[:bar] :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: 100
    });
    execSync('npm i vite-plugin-vue2 vite@2 --save-dev ', (err) => {
        if (err) {
            console.error(`Error installing dependencies: ${err}`);
            return;
        }
        bar2.stop();
        console.log('%c----安装vite完成----', "color:green;")
    });
    bar2.start(0);

    // 模拟进度更新
    setInterval(() => {
        bar2.update(Math.min(bar2.total, bar2.curr + 10));
    }, 100);
}

export { run } 
