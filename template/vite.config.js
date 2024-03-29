/*
 * @Author: tuyongtao1
 * @Date: 2024-03-20 20:35:33
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-03-29 10:24:35
 * @Description: 
 */

import { defineConfig } from 'vite'
import { plugins, getPrimitiveDevServer, getPrimitiveAlias, getPrimitivePublicPath } from './viteUtils/index.js'
import { resolve } from 'path'

export default defineConfig({
    base: getPrimitivePublicPath() || '/',
    mode: 'development',
    define: {
        global: 'globalThis',
    },
    plugins,
    envPrefix: ['VUE_APP_'], // 兼容VUE_APP_前缀
    envDir: '',
    server: getPrimitiveDevServer(),
    build: {
    },
    esbuild: {
        loader: {
            '.js': 'jsx', // 指定 `.js` 文件使用 `jsx` loader
        },
    },
    css: {
        preprocessorOptions: {
            // scss: {
            //     additionalData: `@import "@/styles/variables.scss";
            //                      @import "@/styles/mixin.scss";
            //                      `,
            // },
        },
    },
    resolve: {
        extensions: [
            '.mjs',
            '.js',
            '.mts',
            '.ts',
            '.jsx',
            '.tsx',
            '.vue',
            '.json',
        ],
        alias: { ...getPrimitiveAlias(), ...{ '@': resolve(__dirname, '/src') } },
    },
})
