// The Vue build version to load with the `import` command!
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from '@/router'
// 引入vuex
import store from '@/store'
// 百度统计插件
import hmt from 'vue-hmt'
/* element-ui引入 */
import ElementUI from 'element-ui'
/* element-ui css 引入 */
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style/main.less'
// GraphQL
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import VueClipboard from 'vue-clipboard2'
import { link } from '@/assets/js/apply-ware.js'
import { baiduOptions } from '@/assets/js/config.js'
// 地区选择器
import VDistpicker from 'v-distpicker'
Vue.component('v-distpicker', VDistpicker)
import Toasted from 'vue-toasted'
Vue.use(Toasted)
Vue.use(hmt, {
    options: baiduOptions,
    router
})

// Create the apollo client
const apolloClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
    connectToDevTools: true
})
const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})

// Install the vue plugin
Vue.use(VueApollo)
Vue.use(ElementUI)
Vue.use(VueClipboard)

Vue.config.productionTip = false

const eventBus = new Vue()
Vue.prototype.$eventBus = eventBus

/* 设置model-iframe与vue交互的唯一全局变量 */
// eslint-disable-next-line semi-style
;(function(window) {
    window.MODEL_STORE = {}
})(window)

router.beforeEach(async (to, from, next) => {
    const user = JSON.parse(window.localStorage.getItem('userTokens'))
    // 已登录
    if (user) {
        // 监听reportList 和 custom
        if (['home', 'Custom'].indexOf(to.name) > -1) {
            console.log('刷新数据')
            eventBus.$emit('changeRouter', to.name, from.name)
        }
        if (to.path === '/') {
            next({
                path: '/home'
            })
        } else {
            let perm = store.state.userInfo.perm
            // 刷新页面重新获取用户信息
            if (typeof perm === 'undefined') {
                const result = await store.dispatch('getUserInfo', apolloProvider)
                // 用户信息获取成功
                if (result) {
                    perm = store.state.userInfo.perm
                } else {
                    next({
                        path: `/login?time=${new Date().getTime()}`
                    })
                }
            }

            // 校验用户账号权限
            // 未开通app或api访问对接页面
            if (to.path === '/access' && perm.app === 0 && perm.api === 0) {
                next({
                    path: '/access/single'
                })
            } else if (to.path === '/access/app' && perm.app === 0) {
                next({
                    path: '/access'
                })
            } else if (to.path === '/access/api' && perm.api === 0) {
                next({
                    path: '/access'
                })
            } else {
                next()
            }
        }
    } else {
        // 未登录访问登录页面
        if (to.path === '/login' || to.path === '/forget' || to.path === '/contact') {
            next()
        } else {
            next({
                path: `/login?time=${new Date().getTime()}`
            })
        }
    }
})

/* eslint-disable no-new */
new Vue({
    components: {
        App
    },
    provide: apolloProvider.provide(),
    el: '#app',
    router,
    template: '<App/>',
    store
})
