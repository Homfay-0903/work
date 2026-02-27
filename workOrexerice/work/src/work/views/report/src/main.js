/* eslint-disable vue/order-in-components */
/*
 * @Author: Muse admin@yunsinek.cn
 * @Date: 2023-08-15 10:39:58
 * @LastEditors: liutq
 * @LastEditTime: 2024-01-09 17:31:21
 * @FilePath: /vr-pro3-report-frontend/src/main.js
 * @Description:
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import hmt from 'vue-hmt'
// import echarts from 'echarts'
import * as echarts from 'echarts'
// ElementUI !
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// GraphQL
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { link } from '@/assets/js/applyWare.js'

// Baidu
import { baiduOptions } from '@/assets/js/config.js'

// Create the apollo client
const apolloClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
    connectToDevTools: true,
})
const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
})

// 百度统计配置
const options = {
    siteId: baiduOptions
}

Vue.use(hmt, {
    options,
    router
})

// Install the vue plugin
Vue.use(VueApollo)

Vue.use(ElementUI)
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
    next()
});
// router.beforeEach((to, from, next) => {});

/* 设置model-iframe与vue交互的唯一全局变量 */
(function(window) {
    window.MODEL_STORE = {}
})(window)

function checkPermission(el, binding) {
    const value = el ? binding.value : binding
    const mode = (localStorage.getItem('report_mode') || '').split(',')
    if (mode.length === 0) {
        return true
    }
    if (value && value instanceof Array && value.length > 0) {
        const permissionRoles = value
        const hasPermission = mode.some(role => {
            return permissionRoles.includes(role)
        })
        if (!hasPermission) {
            el && el.parentNode && el.parentNode.removeChild(el)
            return false
        } else {
            return true
        }
    }
    else {
        throw new Error('need mode! Like v-report-show="[\'007\']"')
    }
}

// 自定义指令 v-report-check


const checkDirective = function(Vue) {
    Vue.directive('report-show', {
        inserted(el, binding) {
            checkPermission(el, binding)
        },
        update(el, binding) {
            checkPermission(el, binding)
        }
    })
}
Vue.use(checkDirective)
/* eslint-disable no-new */
new Vue({
    components: {
        App
    },
    methods: {
        checkPermission
    },
    provide: apolloProvider.provide(),
    el: '#app',
    router,
    template: '<App/>'
})