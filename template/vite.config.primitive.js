import { defineConfig } from 'vite'
// 支持.vue文件, Vue2.6
import { createVuePlugin } from 'vite-plugin-vue2'
// 支持resolve.alias
import alias from '@rollup/plugin-alias'
import { resolve } from 'path'
// 兼容webpack获取env方式，大幅减少切换工作量
import envCompatible from 'vite-plugin-env-compatible'
// 兼容commonjs
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
// 兼容require.context
import viteRequireContext from '@originjs/vite-plugin-require-context'

// 工具包生成正则
import regexParser from 'regex-parser'
// 增强vite动态引入，支持 import('@/views/' + $component)，
// 同时解决vite要求vue组件必须带文件后缀的问题，这在某些相应项目将极大减少迁移工作量
import dynamicImport from 'vite-plugin-dynamic-import'




function transformScss() {
    return {
        name: 'vite-plugin-transform-scss',
        enforce: 'pre',
        transform(src, id) {
            if (
                /\.(js|jsx|ts|tsx|vue)(\?)*/.test(id) &&
                id.includes('lang.scss') &&
                !id.includes('node_modules')
            ) {
                return {
                    code: src.replace(/(\/deep\/|>>>)/gi, '::v-deep'),
                }
            }
            // 单独的css文件内出现vue深度选择器将不起作用，webpack直接忽略，而vite会报错，这里屏蔽这个错误
            if (
                /\.(scss|less|styl|css)$/.test(id) &&
                !id.includes('node_modules')
            ) {
                return {
                    code: src.replace(/(\/deep\/|::v-deep|>>>)/gi, '__vite_remove_useless_vue_deep__'),
                }
            }
        },
    }
}

// 注入index.html变量
function injectHTMLData(data = {}) {
    const ejs = require('ejs')
    return {
        name: 'html-transform',
        transformIndexHtml(html) {
            return ejs.render(html, data)
        },
    }
}

// 支持未export default的文件
function transformFileExport() {
    return {
        name: 'vite-plugin-transform-file', // 文件未设置默认导出时使用
        transform(src, id) {
            if (
                id.includes('.vite/deps/pdfjs-dist_build_pdf__worker__entry') // 未设置默认导出的文件
            ) {
                const newCode = src.replace('export', 'export default')
                return {
                    code: newCode,
                }
            }
        },
    }
}

// 复用webpack的proxy代理配置
const vueConfig = require('./vue.config.js')
function getViteProxy() {
    const webpackProxy = vueConfig?.devServer?.proxy || {}
    const proxy = {}
    Object.keys(webpackProxy).forEach(key => {
        const proxyConfig = webpackProxy[key]
        proxy[key] = Object.assign({}, proxyConfig)
        const pathRewrite = proxyConfig?.pathRewrite || {}
        proxy[key].rewrite = (path) => {
            Object.keys(pathRewrite).forEach(prefix => {
                path = path.replace(regexParser(prefix), pathRewrite[prefix])
            })
            return path
        }
    })
    return proxy
}

function getViteAlias() {
    const webpackAlias = vueConfig?.configureWebpack?.resolve?.alias || {}
    const alias = []
    Object.keys(webpackAlias).forEach(key => {
        const aliasConfig = webpackAlias[key]
        alias.push({ find: key, replacement: aliasConfig }) // 复用vue-cli的alias
    })
    delete webpackAlias['@']
    const cssRegex = new RegExp('^~([' + Object.keys(webpackAlias).join('|') + '])(.*)$')
    alias.push({ find: cssRegex, replacement: resolve(__dirname, 'src', '$1', '$2') }) // 解决vite不识别~asset的问题
    alias.push({ find: /^~@\/(.*)$/, replacement: resolve(__dirname, 'src', '$1') }) // 解决vite不识别~@的问题
    alias.push({ find: /^~(.*)$/, replacement: '$1' }) // 直接引用node_modules内的文件
    return alias
}
function getPort() {
    const port = vueConfig?.devServer?.port || 8080
    return port
}

export default defineConfig({
    plugins: [
        // 兼容scss旧语法
        transformScss(),
        // 替换不兼容的npm包
        transformNpmModules(),
        // 注入index.html模板变量
        injectHTMLData({ BASE_URL: vueConfig.publicPath }),
        // 支持.vue文件, Vue2.6
        createVuePlugin({
            jsx: true, // 支持vue jsx语法(需要同时把.js改为.jsx或者script标签加属性lang="jsx")
            vueTemplateOptions: {
                compilerOptions: {
                    whitespace: 'condense', // 去除编译后多余的空白
                },
            },
        }),
        // 增强vite动态引入
        dynamicImport(),
        // 兼容commonjs
        viteCommonjs(),
        // 支持resolve.alias
        alias(),
        // 支持未export default的文件
        transformFileExport(),
        // 兼容require.context
        viteRequireContext(),
        // 兼容webpack获取env方式
        envCompatible(),
    ],
    envPrefix: ['VUE_APP_'], // 兼容VUE_APP_前缀
    base: '/dd/core/',
    server: {
        proxy: getViteProxy(), // 从vue.config.js读取proxy
        port: getPort(),
        hmr: {
            overlay: true,
        },
        open: vueConfig?.devServer?.open,
        host: vueConfig?.devServer?.host || 'test.jd.com',
    },
    // define: {
    //   'process.cwd': () => { return process.cwd },
    // },
    build: {
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/styles/variables.scss";
                                 @import "@/styles/mixin.scss";
                                 `,
            },
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
        alias: getViteAlias(),
    },
    define: {
        global: 'globalThis',
    },
})