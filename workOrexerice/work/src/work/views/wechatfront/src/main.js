// The Vue build version to load with the `import` command!
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

import MintUI from 'mint-ui'
import VueDND from 'awe-dnd'
import hmt from 'vue-hmt'
import '@/plugins/vant'
import 'vant/lib/index.css'
// import echarts from 'echarts'
import 'mint-ui/lib/style.css'
import '@/assets/styles/main.less'
import '@/assets/styles/theme.less'
import '@/assets/styles/common.less'
import '@/assets/styles/register/public.less'

// GraphQL
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { link } from '@/assets/js/apply-ware.js'
import { dsn, release, ENV, baiduOptions } from '@/assets/js/config.js'
import { langPattern, getCurrentLang } from '@/assets/js/langObject'
// import { baiduOptions } from '@/assets/js/config.js'

// import '@/assets/js/vconsole.js'

// Create the apollo client
const apolloClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
    connectToDevTools: true
})
const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})

Vue.use(hmt, {
    options: baiduOptions,
    router
})

// Install the vue plugin
Vue.use(VueApollo)

// lodash js方法库
import lodash from 'lodash'

// moment 做时间处理
import moment from 'moment'

// axios 做跨域请求
import axios from 'axios'

// router and store
import store from './store'
// 多语言
import VueI18n from 'vue-i18n'
import { Locale } from 'vant'
import zhCN from 'vant/lib/locale/lang/zh-CN'
Vue.prototype.$lodash = Vue.lodash = lodash

Vue.prototype.$moment = Vue.moment = moment

Vue.prototype.$http = Vue.http = axios
axios.defaults.baseURL = '/api' // s所有请求公共的url

Vue.config.productionTip = false

let VueTouch = require('vue-touch')
Vue.use(VueTouch, { name: 'v-touch' })

Vue.use(MintUI)
Vue.use(VueDND)
Vue.use(VueI18n)
// Vue.use(Vant)
// Vue.prototype.$echarts = echarts;
const Language = getCurrentLang()
const i18n = new VueI18n({
    locale: Language.lang, // 语言标识
    messages: langPattern
})
function vantLocales(language) {
    Locale.use('zh-CN', zhCN)
}
vantLocales(i18n.locale)
// 初始化默认值
window.localStorage.setItem('lang', Language.lang)
router.beforeEach(async (to, from, next) => {
    console.log("==========================全局前置守卫被调用", to.path)
    // if(window.)
    let newUrl = ['/report', '/main', '/modeling']
    console.log('是否设备端新用户', sessionStorage.getItem('isNewUser'))
    // if (sessionStorage.getItem('isNewUser')) {
    //     newUrl = ['/report', '/main']
    // } else {
    //     newUrl = ['/report', '/main', '/modeling']
    // }
    if (newUrl.includes(to.path)) {
        if (from.path === '/FatherAndMotherHeight') {
            return next()
        }
        console.log('准备检查身份信息')
        // 获取modelInfo，判断是否开启了青少年专项
        let modelInfo = window.localStorage.getItem('modelInfo')
        // 如果存在
        try {
            modelInfo = JSON.parse(modelInfo)
            if (modelInfo.teenagerReport === 1) {
                throw new Error('去检查父母身高')
            }
        } catch (e) {
            let userInfo = window.localStorage.getItem('memberInfo')
            try {
                userInfo = JSON.parse(userInfo)
                if ((!userInfo.fatherHeight || !userInfo.motherHeight) && userInfo.age <= 18) {
                    return next({
                        path: '/FatherAndMotherHeight',
                        query: {
                            to: to.path,
                            info: modelInfo ? true : false
                        }
                    })
                }
            } catch (e) {
                return next({
                    path: '/FatherAndMotherHeight',
                    query: {
                        to: to.path, info: false
                    }
                })
            }
        }
    }
    // const userID = this.$route.query.userID
    let isAppLogin = sessionStorage.getItem('isAppLogin')
    /* 浏览器是不是微信浏览器 */
    const ua = navigator.userAgent.toLowerCase()
    const isWeixin = ua.indexOf('micromessenger') !== -1
    // 如果扫码进生成二维码界面，直接放行
    if (to.path === '/gen-qrcode') {
        return next()
    }
    // 如果从报告首页返回模型加载页面，不跳转
    // 不允许从首页返回模型加载页
    if (to.path === '/modeling' && (from.path === '/report' || from.path === '/new-report') && sessionStorage.getItem('isDeviceReport')) {
        next(false)
    } else if (to.path === '/modeling' && (from.path === '/report' || from.path === '/new-report')) {
        // next(false)
        window.history.back()
    } else if (to.path === '/appAuth/menuCallBack' && from.path === '/report') {
        // 不允许从首页返回 APP 对接回调页，直接退出
        window.history.back()
    } else {
        // 如果当前环境是非微信且访问的不是异常页也不是 APP 对接
        // 跳转到只允许微信打开提醒页
        if (!isWeixin && to.name !== 'exception' && isAppLogin === 0) {
            next({
                name: 'exception',
                query: {
                    redirect: to.fullPath
                }
            })
        } else {
            // 访问的页面需要登录
            if (to.meta.requiresAuth) {
                const loginInfo = window.localStorage.getItem('loginInfo')
                if (loginInfo) {
                    next()
                } else {
                    next({
                        path: '/exception/login'
                    })
                }
            } else {
                next()
            }
        }
    }
})

router.afterEach((to) => {
    let logoCloudEnable = window.localStorage.getItem('logoCloudEnable')
    console.log(`>>>> to => [${to.path}] logoCloudEnable：`, logoCloudEnable)
    if (logoCloudEnable === '1') {
        document.title = 'Visbody'
    }
    window.localStorage.getItem('healthPackageEnable') === '2' && (document.title = '麦澜德佳澜 | Visbody')
    let modelInfo = window.localStorage.getItem('modelInfo')
    // 如果存在modelInfo
    try {
        modelInfo = JSON.parse(modelInfo)
        if (modelInfo.spineReport === 1 && modelInfo.isPillowRecommendReport === 1) {
            document.title = '华住会'
        }
    } catch (e) {
        console.log('modelInfo 解析失败', e)
    }
})

    /* 设置model-iframe与vue交互的唯一全局变量 */
    // eslint-disable-next-line semi-style
    ; (function (window) {
        window.MODEL_STORE = {}
    })(window)

/* -------------- Sentry ------------ */
Sentry.init({
    Vue,
    // 上报地址，SENTRY_DSN 如果不存在则不上报
    dsn: dsn,
    integrations: [
        new Integrations.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            tracingOrigins: ['localhost', 'my-site-url.com', /^\//]
        })
    ],
    // 错误上报采样率 0.0 ~ 1.0 ，1.0 则100%上报
    tracesSampleRate: 1.0,
    // 版本号 SENTRY_RELEASE
    release: release,
    // 环境 SENTRY_ENVIRONMENT
    environment: ENV
})
export const vue = new Vue({
    el: '#app',
    router,
    store,
    provide: apolloProvider.provide(),
    components: {
        App
    },
    i18n,
    template: '<App/>'
})
