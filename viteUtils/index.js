
import { createVuePlugin } from 'vite-plugin-vue2'
import dynamicImport from 'vite-plugin-dynamic-import'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import alias from '@rollup/plugin-alias'
import viteRequireContext from '@originjs/vite-plugin-require-context'
import envCompatible from 'vite-plugin-env-compatible'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// 工具包生成正则
import regexParser from 'regex-parser'
import { resolve } from 'path'

const vueConfig = require('../vue.config.js')

const plugins = [
    transformScss(),
    // transformNodeModules(),
    injectHTMLData(
        {
            BASE_URL: getPrimitivePublicPath(),
            webpackConfig: {
                name: ''
            },
            htmlWebpackPlugin: {
                options: {
                    title: ''
                }
            }
        }
    ),
    // 增强vite动态引入，支持 import('@/views/' + $component)
    dynamicImport(),
    // 兼容commonjs
    viteCommonjs(),
    // 支持resolve.alias
    alias(),
    // 兼容require.context
    viteRequireContext(),
    // 兼容webpack获取env方式
    envCompatible(),
    // 支持.vue文件, Vue2.6
    createVuePlugin({
        jsx: true, // 支持vue jsx语法(需要同时把.js改为.jsx或者script标签加属性lang="jsx")
        vueTemplateOptions: {
            compilerOptions: {
                whitespace: 'condense', // 去除编译后多余的空白
            },
        },
    }),
    //填充 Node 浏览器环境的核心模块
    nodePolyfills({
        globals: {
            process: true,
        },
        overrides: {
            path: 'path-browserify',
        },
    }),
]

// 兼容scss旧语法
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

// 转换不能直接在浏览器中使用的 node 相关模块
function transformNodeModules() {
    return {
        name: 'vite-plugin-transform-node-modules',
        enforce: 'pre',
        transform(src, id) {
            // 替换不兼容的包
            if (
                /\.(js|jsx|ts|tsx|vue)(\?)*/.test(id) &&
                !id.includes('node_modules')
            ) {
                // path => path-browserify, vite禁止浏览器访问node内置模块
                const keyword = [
                    { src: 'path', target: 'path-browserify' },
                ]
                keyword.forEach(item => {
                    src = src
                        .replace(new RegExp(`from\\s+(['"])${item.src}(['"])`, 'gi'), `from $1${item.target}$2`)
                        .replace(new RegExp(`require\\((['"])${item.src}(['"])\\)`, 'gi'), `require($1${item.target}$2)`)
                })
                return {
                    code: src,
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


// webpack 中 pathRewrite 改成  vite中的 rewrite
function getPrimitiveDevServer() {
    const primitiveProxy = vueConfig?.devServer?.proxy || {}
    const proxy = {}
    Object.keys(primitiveProxy).forEach(key => {
        const proxyConfig = primitiveProxy[key]
        proxy[key] = Object.assign({}, proxyConfig)
        const pathRewrite = proxyConfig?.pathRewrite || {}
        proxy[key].rewrite = (path) => {
            Object.keys(pathRewrite).forEach(prefix => {
                path = path.replace(regexParser(prefix), pathRewrite[prefix])
            })
            return path
        }
    })
    vueConfig.devServer.proxy = proxy
    return vueConfig.devServer
}


function getPrimitiveAlias() {
    const primitiveAlias = vueConfig?.configureWebpack?.resolve?.alias || {}
    const alias = []
    Object.keys(primitiveAlias).forEach(key => {
        const aliasConfig = primitiveAlias[key]
        alias.push({ find: key, replacement: aliasConfig }) // 复用vue-cli的alias
    })
    delete primitiveAlias['@']
    const cssRegex = new RegExp('^~([' + Object.keys(primitiveAlias).join('|') + '])(.*)$')
    alias.push({ find: cssRegex, replacement: resolve(__dirname, 'src', '$1', '$2') }) // 解决vite不识别~asset的问题
    alias.push({ find: /^~@\/(.*)$/, replacement: resolve(__dirname, 'src', '$1') }) // 解决vite不识别~@的问题
    alias.push({ find: /^~(.*)$/, replacement: '$1' }) // 直接引用node_modules内的文件
    return alias
}

function getPrimitivePublicPath() {
    return vueConfig?.publicPath + '/'
}


export { plugins, getPrimitiveDevServer, getPrimitiveAlias, getPrimitivePublicPath }