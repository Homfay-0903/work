/*
 * @Description: 页面路由
 * @Author: WendyGao
 * @Date: 2022-02-09 10:10:58
 * @LastEditors: liutq
 * @LastEditTime: 2026-01-06 23:22:35
 */
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import error from './error'
import { mass, shape, girth, shoulder, height } from './measure'
import Init from '@/views/init.vue'
// 主布局  - 除了启动页、开关机页面其他页面通用
import Layout from '@/layout/index.vue'
import store from '@/store'

Vue.use(VueRouter)

// 更新页面
const update: RouteConfig = {
    path: '/update',
    component: Layout,
    children: [
        {
            path: 'index',
            name: 'UpdateClient',
            meta: {
                title: '设备更新'
            },
            component: () => import('@/views/update/index.vue')
        },
        {
            path: 'roll-back',
            name: 'RollBackClient',
            meta: {
                title: '设备回滚'
            },
            component: () => import('@/views/update/roll-back.vue')
        }
    ]
}

// 设置页面
const setting: RouteConfig = {
    path: '/setting',
    component: Layout,
    children: [
        {
            path: 'index',
            name: 'SettingIndex',
            meta: {
                title: '设置首页',
                nav: {
                    prev: 'navigation-bar.shou-ye',
                    title: 'navigation-bar.she-zhi',
                    icon: true,
                    showBtnText: true,
                    showSure: true
                }
            },
            component: () => import('@/views/setting/index.vue')
        },
        {
            path: 'dynamic',
            name: 'SettingOpenArml',
            meta: {
                title: '动态实验室设置',
                nav: {
                    prev: 'navigation-bar.she-zhi',
                    title: 'navigation-bar.dong-tai-shi-yan-shi',
                    icon: true,
                    showBtnText: true,
                    showSure: true
                }
            },
            component: () => import('@/views/setting/dynamicLaboratory.vue')
        },
        {
            path: 'heigth',
            name: 'SettingHeigth',
            meta: {
                title: '身高设置',
                nav: {
                    prev: 'navigation-bar.she-zhi',
                    title: '身高设置',
                    icon: true,
                    showBtnText: true,
                    showSure: true
                }
            },
            component: () => import('@/views/setting/settingHeigth.vue')
        },
        {
            path: 'volume',
            name: 'VolumeSetting',
            meta: {
                title: '音量设置',
                nav: {
                    prev: 'navigation-bar.she-zhi',
                    title: 'navigation-bar.sheng-yin-she-zhi',
                    icon: true,
                    showBtnText: true,
                    showSure: false
                }
            },
            component: () => import('@/views/setting/volume.vue')
        },
        {
            path: 'luminance',
            name: 'LuminanceSetting',
            meta: {
                title: '亮度设置',
                nav: {
                    prev: 'navigation-bar.she-zhi',
                    title: 'navigation-bar.liang-du-she-zhi',
                    icon: true,
                    showBtnText: true,
                    showSure: false
                }
            },
            component: () => import('@/views/setting/luminance.vue')
        },
        {
            path: 'detect',
            name: 'DetectSetting',
            meta: {
                title: '手势识别设置',
                nav: {
                    prev: 'navigation-bar.she-zhi',
                    title: 'navigation-bar.shou-shi-shi-bie',
                    icon: true,
                    showBtnText: true,
                    showSure: true
                }
            },
            component: () => import('@/views/setting/detect/index.vue')
        },
        {
            path: 'detect/gesture',
            name: 'DetectGesture',
            meta: {
                title: '手势识别引导',
                nav: {
                    prev: 'navigation-bar.shou-shi-shi-bie',
                    title: 'navigation-bar.shou-shi-cao-zuo-yin-dao',
                    icon: true,
                    showBtnText: true,
                    showSure: false
                }
            },
            component: () => import('@/views/setting/detect/gesture.vue')
        },
        {
            path: 'print',
            name: 'PrintSetting',
            meta: {
                title: '打印设置',
                nav: {
                    prev: 'navigation-bar.she-zhi',
                    title: 'navigation-bar.da-yin-she-zhi',
                    icon: true,
                    showBtnText: true,
                    showSure: true
                }
            },
            component: () => import('@/views/setting/print.vue')
        },
        {
            path: 'pageSize',
            name: 'PageSize',
            meta: {
                title: '纸张规格',
                nav: {
                    prev: 'navigation-bar.da-yin-she-zhi',
                    title: 'navigation-bar.zhi-zhang-gui-ge',
                    icon: true
                }
            },
            component: () => import('@/views/setting/paper/size.vue')
        },
        {
            path: 'device',
            name: 'DeviceSetting',
            meta: {
                title: '设备设置',
                nav: {
                    prev: 'navigation-bar.she-zhi',
                    title: 'navigation-bar.wang-luo-she-zhi',
                    icon: true,
                    showBtnText: true,
                    showSure: true
                }
            },
            component: () => import('@/views/setting/device.vue')
        },
        {
            path: 'network/diagnose',
            name: 'NetworkDiagnose',
            meta: {
                title: '网络检测',
                nav: {
                    prev: 'navigation-bar.she-bei-jian-ce',
                    title: 'navigation-bar.wang-luo-zhen-duan',
                    icon: true,
                    showBtnText: true,
                    showSure: false
                },
                // 设备是否可以长按返回
                // isBack: true
            },
            component: () => import('@/views/setting/network/diagnose.vue')
        },
        {
            path: 'network/deviceDiagnose',
            name: 'deviceDiagnose',
            meta: {
                title: '设备检测',
                nav: {
                    prev: 'navigation-bar.she-bei-jian-ce',
                    title: 'navigation-bar.wang-luo-zhen-duan',
                    icon: true,
                    showBtnText: true,
                    showSure: false
                },
                // 设备是否可以长按返回
                // isBack: true
            },
            component: () => import('@/views/setting/network/deviceDiagnose.vue')
        },
        {
            path: 'network/report',
            name: 'NetworkReport',
            meta: {
                title: '网络报告',
                nav: {
                    prev: 'navigation-bar.she-bei-jian-ce',
                    title: 'navigation-bar.wang-luo-zhen-duan',
                    icon: true,
                    showBtnText: true,
                    showSure: false
                },
                // isBack: true
            },
            component: () => import('@/views/setting/network/report.vue')
        },
        {
            path: 'network/check',
            name: 'networkCheck',
            meta: {
                title: '网络分析',
                nav: {
                    prev: 'navigation-bar.she-bei-jian-ce',
                    title: 'setting.check.wang-luo-fen-xi',
                    icon: true,
                    showBtnText: true,
                    showSure: true
                },
                // isBack: true
            },
            component: () => import('@/views/setting/network/check.vue')
        },
        {
            path: 'language',
            name: 'SettingLanguage',
            meta: {
                title: '语言',
                nav: {
                    prev: 'navigation-bar.she-zhi',
                    title: 'setting.check.yu-yan',
                    icon: true,
                    showBtnText: true,
                    showSure: true
                },
                // isBack: true
            },
            component: () => import('@/views/setting/language.vue')
        },
        {
            path: 'bind',
            name: 'settingReportBind',
            meta: {
                title: '报告获取方式',
                nav: {
                    prev: 'navigation-bar.she-zhi',
                    title: 'setting.check.bao-gao-huo-qu-fang-shi',
                    icon: true,
                    showBtnText: true,
                    showSure: true
                },
                // isBack: true
            },
            component: () => import('@/views/setting/bind.vue')
        },
        {
            path: 'guidance',
            name: 'settingBtnGuidance',
            meta: {
                title: '按键指引',
                nav: {
                    prev: 'navigation-bar.she-zhi',
                    title: 'setting.check.an-jian-zhi-yin',
                    icon: true,
                    showBtnText: false,
                    showSure: true
                },
                // isBack: true
            },
            component: () => import('@/views/setting/guidance.vue')
        },
        {
            path: 'device-mode',
            name: 'deviceMode',
            meta: {
                title: '测量模式',
                nav: {
                    prev: 'navigation-bar.she-zhi',
                    title: 'setting.index.device-mode',
                    icon: true,
                    showBtnText: false,
                    showSure: true
                },
                // isBack: true
            },
            component: () => import('@/views/setting/device-mode/index.vue')
        },
        {
            path: 'beauty-mode',
            name: 'beautyMode',
            meta: {
                title: '测量模式',
                nav: {
                    prev: 'navigation-bar.she-zhi',
                    title: 'beauty.device-mode',
                    icon: true,
                    showBtnText: false,
                    showSure: true
                },
                // isBack: true
            },
            component: () => import('@/views/setting/beauty-mode/index.vue')
        },
        // {
        //     path: 'internet',
        //     name: 'InternetSetting',
        //     meta: {
        //         title: 'setting.index.wang-luo-she-zhi',
        //         nav: {
        //             prev: 'navigation-bar.she-zhi',
        //             title: 'setting.index.wang-luo-she-zhi',
        //             icon: true,
        //             showBtnText: false,
        //             showSure: true
        //         },
        //         isBack: true
        //     },
        //     component: () => import('@/views/setting/internet/index.vue')
        // },
        {
            path: 'network/wifiList',
            name: 'wifiList',
            meta: {
                title: 'setting.index.wang-luo-she-zhi',     //'无线网络'
                nav: {
                    prev: 'setting.index.wang-luo-she-zhi',
                    title: 'wifi.items-title-1',
                    icon: true,
                    showBtnText: false,
                    showSure: true
                },
                // isBack: true
            },
            component: () => import('@/views/setting/network/wifiList.vue')
        }
    ]
}

// 项目选择
const scanSelect: RouteConfig = {
    path: '/scan-select',
    component: Layout,
    children: [
        {
            path: 'button-mode',
            name: 'ButtonSelect',
            meta: {
                title: '测量项目选择-按钮模式启动',
                nav: {
                    prev: 'navigation-bar.xiang-mu-xuan-ze',
                    title: 'navigation-bar.xuan-ze-ce-liang-xiang-mu',
                    align: 'center',
                    icon: false,
                    id: 3,
                    isBackPre: true
                },
                isBack: true
            },
            component: () => import('@/views/scan-select/button-mode.vue')
        },
        {
            path: 'stand-up',
            name: 'StandUpSelect',
            meta: {
                title: '测量项目选择-站人检测启动',
                nav: {
                    prev: 'navigation-bar.shou-ye',
                    title: 'navigation-bar.qing-an-tu-shi-dong-zuo-jin-ru-ce-liang-xiang-mu',
                    align: 'center',
                    icon: false,
                    isBackPre: true
                }
            },
            component: () => import('@/views/scan-select/stand-up.vue')
        },
        {
            path: 'stand-up-pro5',
            name: 'StandUpSelectPro5',
            meta: {
                title: '测量项目选择-站人检测启动',
                nav: {
                    prev: 'navigation-bar.shou-ye',
                    title: 'navigation-bar.qing-an-tu-shi-dong-zuo-jin-ru-ce-liang-xiang-mu',
                    align: 'center',
                    icon: false,
                    isBackPre: true
                }
            },
            component: () => import('@/views/scan-select/standup/index.vue')
        },
        {
            path: 'zhun-bei',
            name: 'ZhunBei',
            meta: {
                title: '测量项目选择-站人检测启动',
                nav: {
                    prev: 'navigation-bar.xiang-mu-xuan-ze',
                    title: 'navigation-bar.qing-zuo-hao-yi-xia-zhun-bei',
                    align: 'center',
                    icon: false,
                    id: 3
                }
            },
            component: () => import('@/views/scan-continue/zhun-bei.vue')
        },
        {
            path: 'run-time',
            name: 'RunTime',
            meta: {
                title: '测量倒计时页面',
                nav: {
                    prev: '',
                    title: '',
                    align: ''
                }
            },
            component: () => import('@/views/scan-continue/run-time.vue')
        }
    ]
}

// 继续测量
const scanContinue: RouteConfig = {
    path: '/scan-continue',
    component: Layout,
    children: [
        {
            path: 'button-mode',
            name: 'ButtonContinue',
            meta: {
                title: '继续测量选择-按钮模式',
                nav: {
                    prev: '',
                    title: 'navigation-bar.shi-fou-ji-xu-ce-liang',
                    align: 'center',
                    id: 3
                },
                isBack: true
            },
            component: () => import('@/views/scan-continue/button-mode.vue')
        },

        {
            // 默认手势模式
            // 手势服务异常或关闭手势选择则使用按钮模式
            path: 'stand-up',
            name: 'GestureContinue',
            meta: {
                title: '继续测量选择-手势模式',
                nav: {
                    prev: 'navigation-bar.shou-ye',
                    title: 'navigation-bar.shi-fou-ji-xu-ce-liang',
                    align: 'center',
                    icon: true
                },
                isBack: true
            },
            component: () => import('@/views/scan-continue/gesture-mode.vue')
        },
        {
            // 默认手势模式
            // 手势服务异常或关闭手势选择则使用按钮模式
            path: 'stand-up',
            name: 'TouchContinue',
            meta: {
                title: '继续测量选择-触屏模式',
                nav: {
                    prev: 'navigation-bar.shou-ye',
                    title: 'navigation-bar.shi-fou-ji-xu-ce-liang',
                    align: 'center',
                    icon: true
                },
                isBack: true
            },
            component: () => import('@/views/scan-continue/touch-mode.vue')
        }
    ]
}
// 其他页面 - 不需要顶部状态栏
const other: RouteConfig[] = [
    {
        path: '',
        name: 'Init',
        meta: {
            title: '应用启动初始化'
        },
        component: Init
    },
    {
        path: '/device-switch',
        name: 'DeviceSwitch',
        meta: {
            title: '设备开关机动画'
        },
        component: () => import('@/views/device-switch.vue')
    },
    {
        path: '/customer-ad',
        name: 'CustomerAd',
        meta: {
            title: '客户视频'
        },
        component: () => import('@/views/customer-ad.vue')
    }
]

// NOTE: 页面传参全部使用query
const constant: RouteConfig[] = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/check-self',
                name: 'CheckSelf',
                meta: {
                    title: '设备自检'
                },
                component: () => import('@/views/check-self.vue')
            },
            {
                path: '/home',
                name: 'Home',
                meta: {
                    title: '设备待机'
                },
                component: () => import('@/views/home/index.vue')
            },
            {
                path: '/print-list',
                name: 'PrintList',
                meta: {
                    title: '打印列表',
                    nav: {
                        prev: 'navigation-bar.shou-ye',
                        title: 'navigation-bar.bao-gao-lie-biao',
                        showBtnText: store.getters.deviceInfo.deviceType !== 4 ? false : true,
                        showSure: true,
                        icon: true
                    },
                    isBack: true
                },
                beforeEnter: (to, from, next) => {
                    // reject the navigation
                    console.log('进入打印列表页' + JSON.stringify(to.meta))
                    // return to
                    const showBtnText = store.getters.deviceInfo.deviceType !== 4 ? false : true
                    // eslint-disable-line no-undef
                    if (to.meta !== undefined) {
                        to.meta.nav.showBtnText = showBtnText
                    }
                    next()
                },
                component: () => import('@/views/print-list.vue')
            },
            {
                path: '/welcome',
                name: 'Welcome',
                meta: {
                    title: '测量欢迎',
                    isBack: true
                },

                component: () => import('@/views/welcome.vue')
            },
            {
                path: '/scan-result',
                name: 'ScanResult',
                meta: {
                    title: '测量结果',
                    nav: {
                        prev: '',
                        title: 'navigation-bar.huo-qu-ce-liang-bao-gao',
                        align: 'center',
                        id: 3
                    },
                    // isBack: true
                },
                component: () => import('@/views/scan-result.vue')
            },
            {
                path: '/acquire',
                name: 'Acquire',
                meta: {
                    title: '已获取相关报告',
                    nav: {
                        prev: 'navigation-bar.wu-dian-liu',
                        title: 'navigation-bar.wu-dian-liu',
                        icon: true
                    },
                    isBack: true
                },
                component: () => import('@/views/acquire.vue')
            },
            {
                path: '/getReport',
                name: 'getReport',
                meta: {
                    title: '测量结果',
                    nav: {
                        prev: 'navigation-bar.shou-ye',
                        title: 'navigation-bar.huo-qu-ce-liang-bao-gao',
                        align: 'center',
                        icon: true
                    },
                    isBack: true
                },
                component: () => import('@/views/getReport.vue')
            },
            {
                path: '/view-report',
                name: 'viewReport',
                meta: {
                    title: '查看报告',
                    // nav: {
                    //     prev: '',
                    //     title: '请进行身份检录',
                    //     align: 'center',
                    //     icon: true
                    // },
                    // isBack: true
                },
                component: () => import('@/views/view-report.vue')
            },
            {
                path: '/identity-check',
                name: 'IdentityCheck',
                meta: {
                    title: '身份检录',
                    nav: {
                        prev: '',
                        title: '请进行身份检录',
                        align: 'center'
                    },
                    isBack: true
                },
                component: () => import('@/views/identity-check/qr-code.vue')
            },
            {
                path: '/recovery',
                name: 'Recovery',
                meta: {
                    title: '设备恢复-重启算法服务'
                },
                component: () => import('@/views/recovery.vue')
            },
            {
                path: '/renewal',
                name: 'Renewal',
                meta: {
                    title: '到期续费提醒'
                },
                component: () => import('@/views/renewal.vue')
            },
            {
                path: '/ai-renewal',
                name: 'AiRenewal',
                meta: {
                    title: '设备未激活'
                },
                component: () => import('@/views/ai-renewal.vue')
            }
        ]
    },
    scanSelect,
    scanContinue,
    mass,
    shape,
    girth,
    shoulder,
    height,
    setting,
    update,
    error
]
const routes = [...other, ...constant]

const router = new VueRouter({
    routes
})

const originalPush = VueRouter.prototype.push
const push = (location: string) => {
    // tslint:disable-next-line
    return (originalPush.call(router, location) as any).catch((err: any) => err)
}
VueRouter.prototype.push = push

router.afterEach((to) => {
    window.logger.info(`[页面切换]：进入${to.meta?.title}页面，view: ${to.name}，query: ${JSON.stringify(to.query)}`)
    // 重置页面信息
    store.commit('CHANGE_PAGE_INFO', {
        // 右侧操作按钮说明
        btnList: [],
        // 是否开启1分钟未操作超时
        openNotOperated: false
    })
})
router.beforeEach((to, from, next) => {
    next()
})

export default router
