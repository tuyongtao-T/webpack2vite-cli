


const vueConfig = require('./vue.config.js')

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
    vueConfig?.devServer.proxy = proxy
    return vueConfig?.devServer
}


function getPrimitiveAlias() {
    const primitiveAlias = vueConfig?.configureWebpack?.resolve?.alias || {}
    const alias = []
    Object.keys(primitiveAlias).forEach(key => {
        const aliasConfig = primitiveAlias[key]
        alias.push({ find: key, replacement: aliasConfig }) // 复用vue-cli的alias
    })
    // delete primitiveAlias['@']
    const cssRegex = new RegExp('^~([' + Object.keys(primitiveAlias).join('|') + '])(.*)$')
    alias.push({ find: cssRegex, replacement: resolve(__dirname, 'src', '$1', '$2') }) // 解决vite不识别~asset的问题
    alias.push({ find: /^~@\/(.*)$/, replacement: resolve(__dirname, 'src', '$1') }) // 解决vite不识别~@的问题
    alias.push({ find: /^~(.*)$/, replacement: '$1' }) // 直接引用node_modules内的文件
    return alias
}

function getPrimitivePublicPath() {
    return vueConfig?.publicPath || ''
}

export { getPrimitiveDevServer, getPrimitiveAlias, getPrimitivePublicPath }