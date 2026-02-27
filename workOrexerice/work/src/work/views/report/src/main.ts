/*
 * @Description: 入口文件
 * @Author: WendyGao
 * @Date: 2022-02-08 11:26:02
 * @LastEditors: ouyaping
 * @LastEditTime: 2022-10-18 18:55:04
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import CONFIG from '@/config/index'
import { _changeViewPage, _dotMsg } from './util'
import { EventEmitter } from 'events'

import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

// 全局样式
import './assets/css/global.less'
import './assets/fonts/iconfont/iconfont.css'
import './assets/fonts/iconfont/iconfont.js'

import { StatusClient, ControlClient, UpdateClient, HardwareClient, AlgorithmClient } from '@/grpc/client'
import { ClientServer } from '@/grpc/serve'

import { i18n } from './i18n'

import logger from './config/log'
window.logger = logger.common

EventEmitter.prototype.setMaxListeners(10)
window.events = new EventEmitter()

Vue.config.productionTip = false
Vue.prototype.$changeViewPage = _changeViewPage
Vue.prototype.$dotMsg = _dotMsg

window.logger.info('CONFIG', CONFIG)

Sentry.init({
    Vue,
    // 上报地址，SENTRY_DSN 如果不存在则不上报
    dsn: CONFIG.SENTRY.VUE_DSN,
    integrations: [
        new Integrations.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            tracingOrigins: ['localhost', 'my-site-url.com', /^\//]
        })
    ],
    // 错误上报采样率 0.0 ~ 1.0 ，1.0 则100%上报
    tracesSampleRate: 1.0,
    // 版本号 SENTRY_RELEASE
    release: CONFIG.MASTER_VERSION || `${CONFIG.APP_NAME}@v${CONFIG.APP_VERSION}`,
    // 环境 SENTRY_ENVIRONMENT
    environment: CONFIG.SENTRY.ENVIRONMENT || process.env.NODE_ENV
})

// 添加应用版本号
Sentry.setTag('version', CONFIG.APP_VERSION)

// 添加上下文
const content = CONFIG.SENTRY.CONTENT || {}
if (Object.keys(content).length !== 0) {
    Sentry.setContext('device-info', CONFIG.SENTRY.CONTENT)
}

// 添加自定义标签
const tags = CONFIG.SENTRY.TAG || {}
for (const key in tags) {
    Sentry.setTag(key, tags[key])
}

// 设备端默认使用设备id作为唯一标识
Sentry.setUser({ id: CONFIG.DEVICE_ID })

// 全局调试方法
if (process.env.NODE_ENV !== 'production') {
    window._changeViewPage = _changeViewPage
}
// grpc 服务监听端口并启动
new ClientServer(CONFIG.SERVICE.CLIENT_ADDR)

// 状态通知服务客户端启动
// const statusClient = new StatusClient(CONFIG.SERVICE.STATUS_ADDR)
Vue.prototype.$statusClient = new StatusClient(CONFIG.SERVICE.STATUS_ADDR)

// 控制服务客户端启动
Vue.prototype.$controlClient = new ControlClient(CONFIG.SERVICE.CONTROL_ADDR)
// 硬件服务客户端
Vue.prototype.$hardwareClient = new HardwareClient(CONFIG.SERVICE.HARDWARE_ADDR)
// 更新服务客户端
Vue.prototype.$updateClient = new UpdateClient(CONFIG.SERVICE.UPDATE_ADDR)
// 算法服务客户端
Vue.prototype.$algClient = new AlgorithmClient(CONFIG.SERVICE.ALG_ADDR)
// // 扫描服务客户端
// Vue.prototype.$scanClient = new ScanClient(CONFIG.SERVICE.SCAN_ADDR)
// // 手势服务客户端
// Vue.prototype.$gestureClient = new GestureClient(CONFIG.SERVICE.GESTURE_ADDR)
// // 肩部服务客户端
// Vue.prototype.$shoulderClient = new ShoulderClient(CONFIG.SERVICE.SHOULDER_ADDR)

const app = new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App)
}).$mount('#app')

Vue.prototype.$$store = app.$store
