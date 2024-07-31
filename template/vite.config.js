import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { resolve } from 'path'
import alias from '@rollup/plugin-alias'
import envCompatible from 'vite-plugin-env-compatible'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import viteRequireContext from '@originjs/vite-plugin-require-context'
import dynamicImport from 'vite-plugin-dynamic-import'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// 替换不兼容的npm包
function transformNpmModules() {
  return {
    name: 'vite-plugin-transform-npm-modules',
    enforce: 'pre',
    transform(src, id) {
      // 替换不兼容的包
      if (
        /\.(js|vue)(\?)*/.test(id) &&
        !id.includes('node_modules')
      ) {
        const keyword = [
          { src: 'path', target: 'path-browserify' }
        ]
        keyword.forEach(item => {
          src = src
            .replace(new RegExp(`from\\s+(['"])${item.src}(['"])`, 'gi'), `from $1${item.target}$2`)
            .replace(new RegExp(`require\\((['"])${item.src}(['"])\\)`, 'gi'), `require($1${item.target}$2)`)
        })
        return {
          code: src
        }
      }
    }
  }
}
// 兼容scss旧语法
function transformScss() {
  return {
    name: 'vite-plugin-transform-scss',
    enforce: 'pre',
    transform(src, id) {
      if (
        /\.(js|vue)(\?)*/.test(id) &&
        id.includes('lang.scss') &&
        !id.includes('node_modules')
      ) {
        return {
          code: src.replace(/(\/deep\/|>>>)/gi, '::v-deep')
        }
      }
      // 单独的css文件内出现vue深度选择器将不起作用，webpack直接忽略，而vite会报错，这里屏蔽这个错误
      if (
        /\.(scss|css)$/.test(id) &&
        !id.includes('node_modules')
      ) {
        return {
          code: src.replace(/(\/deep\/|::v-deep|>>>)/gi, '__vite_remove_useless_vue_deep__')
        }
      }
    }
  }
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // 兼容scss旧语法
    transformScss(),
    transformNpmModules(),
    // 支持.vue文件, Vue2.6
    createVuePlugin({
      jsx: true // 支持vue jsx语法(需要同时把.js改为.jsx或者script标签加属性lang="jsx")
    }),
    dynamicImport(),
    viteCommonjs(),
    viteRequireContext(),
    envCompatible(),
    nodePolyfills(),
    // 支持resolve.alias
    alias()
  ],
  envPrefix: ['VUE_APP_'], // 兼容VUE_APP_前缀
  base: '/',
  server: {
    host: 'vite-start.jd.com',
    proxy: {
      '/api': {
        target: 'http://backEndHost.jd.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }

  },
  resolve: {
    extensions: [
      '.js',
      '.vue',
      '.json'
    ],
    alias: {
      '@': resolve(__dirname, './src'), // 确保这里的路径是正确的
    },
  },
  define: {
    global: 'globalThis'
  }
})
