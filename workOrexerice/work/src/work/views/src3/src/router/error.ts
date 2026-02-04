/*
 * @Description: 异常相关路由
 * @Author: WendyGao
 * @Date: 2022-02-14 17:12:33
 * @LastEditors: liutq
 * @LastEditTime: 2025-05-15 13:48:38
 */
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
const errorRoutes: RouteConfig = {
    path: '/',
    component: Layout,
    children: [
        {
            path: '/error/device-error',
            name: 'DeviceError',
            meta: {
                title: '设备异常常驻'
            },
            component: () => import('../views/error/device-error.vue')
        },
        {
            path: '/error/emergency',
            name: 'Emergency',
            meta: {
                title: '急停提醒',
                isBack: true
            },
            component: () => import('../views/error/emergency.vue')
        },
        {
            path: '/error/network-anomaly',
            name: 'NetworkAnomaly',
            meta: {
                title: '网络异常'
            },
            component: () => import('../views/error/network-anomaly.vue')
        },
        {
            path: '/error/printer-error',
            name: 'PrinterError',
            meta: {
                title: '打印机异常',
                isBack: true
            },
            component: () => import('../views/error/printer-error.vue')
        },
        {
            path: '/error/turntable-error',
            name: 'TurntableError',
            meta: {
                title: '',
                isBack: true
            },
            component: () => import('../views/error/turntable-error.vue')
        },
        {
            path: '/views/reset-page',
            name: 'ResetPage',
            meta: {
                title: '设备恢复页面中',
                isBack: true
            },
            component: () => import('../views/reset-page.vue')
        }
    ]
}

export default errorRoutes
