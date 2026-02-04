/*
 * @Description: 测量项目相关路由 - 体成分、围度、体态、肩部
 * @Author: WendyGao
 * @Date: 2022-02-17 13:57:58
 * @LastEditors: liutq
 * @LastEditTime: 2025-05-14 10:17:34
 */
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

// 体成分测量
const mass: RouteConfig = {
    path: '/mass',
    component: Layout,
    children: [
        {
            path: 'guide',
            name: 'WeightGuide',
            meta: {
                title: '体重测量引导',
                nav: {
                    prev: 'navigation-bar.xiang-mu-xuan-ze',
                    title: 'navigation-bar.ti-zhong-ce-liang',
                    icon: true,
                    isBackPre: true
                }
            },
            component: () => import('@/views/mass/weight-guide.vue')
        },
        {
            path: 'weight',
            name: 'WeightMeasure',
            meta: {
                title: '体重测量过程',
                nav: {
                    prev: 'navigation-bar.ti-zhong-ce-liang',
                    title: 'navigation-bar.ti-zhong-ce-liang'
                }
            },
            component: () => import('@/views/mass/weight-measure.vue')
        },
        {
            path: 'confirm',
            name: 'MassConfirm',
            meta: {
                title: '体成分姿势确认',
                nav: {
                    prev: 'navigation-bar.shen-ti-cheng-fen',
                    title: 'navigation-bar.shen-ti-cheng-fen-ce-liang-zhun-bei',
                    icon: true,
                    isBackPre: true
                }
            },
            component: () => import('@/views/mass/confirm.vue')
        },
        {
            path: 'scan',
            name: 'MassScan',
            meta: {
                title: '体成分测量过程',
                nav: {
                    prev: 'navigation-bar.shen-ti-cheng-fen',
                    title: 'navigation-bar.shen-ti-cheng-fen-ce-liang'
                }
            },
            component: () => import('@/views/mass/scan.vue')
        },
        {
            path: 'startErr',
            name: 'MassStartErr',
            meta: {
                title: '身体成分测量异常',
                nav: {
                    prev: 'navigation-bar.shen-ti-cheng-fen',
                    title: 'navigation-bar.shen-ti-cheng-fen-ce-liang'
                }
            },
            component: () => import('@/views/mass/start-error.vue')
        }
    ]
}

// 体态测量
const shape: RouteConfig = {
    path: '/shape',
    component: Layout,
    children: [
        {
            path: 'guide',
            name: 'ShapeGuide',
            meta: {
                title: '体态测量引导',
                nav: {
                    prev: 'navigation-bar.ti-tai-ping-gu',
                    title: 'navigation-bar.ti-tai-ce-liang',
                    icon: true,
                    isBackPre: true,
                    id: 3
                }
            },
            component: () => import('@/views/shape/guide.vue')
        },
        {
            path: 'scan',
            name: 'ShapeScan',
            meta: {
                title: '体态测量过程',
                nav: {
                    prev: 'navigation-bar.ti-tai-ping-gu',
                    title: 'navigation-bar.ti-tai-ce-liang'
                }
            },
            component: () => import('@/views/shape/scan.vue')
        },
        {
            path: 'result',
            name: 'ShapeResult',
            meta: {
                title: '体态测量结果',
                nav: {
                    prev: 'navigation-bar.ti-tai-ping-gu',
                    title: 'navigation-bar.ti-tai-ping-gu'
                }
            },
            component: () => import('@/views/shape/result.vue')
        }
    ]
}

// 体态评估成功后选择性测量体围
const girth: RouteConfig = {
    path: '/girth',
    component: Layout,
    children: [
        {
            path: 'select',
            name: 'GirthSelect',
            meta: {
                title: '围度选择',
                nav: {
                    prev: 'navigation-bar.ti-wei-ce-liang',
                    title: 'navigation-bar.ti-wei-ce-liang'
                }
            },
            component: () => import('@/views/girth/select.vue')
        },
        {
            path: 'guide',
            name: 'GirthGuide',
            meta: {
                title: '围度测量引导',
                nav: {
                    prev: 'navigation-bar.ti-wei-ce-liang',
                    title: 'navigation-bar.ti-wei-ce-liang',
                    icon: true,
                    isBackPre: true,
                    id: 3
                }
            },
            component: () => import('@/views/girth/guide.vue')
        },
        {
            path: 'scan',
            name: 'GirthScan',
            meta: {
                title: '围度测量过程',
                nav: {
                    prev: 'navigation-bar.ti-wei-ce-liang',
                    title: 'navigation-bar.ti-wei-ce-liang',
                    id: 3
                }
            },
            component: () => import('@/views/girth/scan.vue')
        },
        {
            path: 'result',
            name: 'GirthResult',
            meta: {
                title: '体围测量结果',
                nav: {
                    prev: 'navigation-bar.ti-wei-ce-liang',
                    title: 'navigation-bar.ti-wei-ce-liang',
                    id: 3
                }
            },
            component: () => import('@/views/girth/result.vue')
        }
    ]
}

// 肩部测量
const shoulder: RouteConfig = {
    path: '/shoulder',
    component: Layout,
    children: [
        {
            path: 'prepare',
            name: 'ShoulderPrepare',
            meta: {
                title: '肩部测量准备',
                nav: {
                    prev: 'navigation-bar.jian-bu-gong-neng',
                    title: 'navigation-bar.jian-bu-gong-neng-ce-liang',
                    icon: true,
                    isBackPre: true
                }
            },
            component: () => import('@/views/shoulder/prepare.vue')
        },
        {
            // 此页面title需要动态调整
            path: 'scan',
            name: 'ShoulderScan',
            meta: {
                title: '肩部测量过程',
                nav: {
                    id: 3,
                    prev: '体态评估',
                    title: '肩部功能评估测量'
                }
            },
            component: () => import('@/views/shoulder/scan.vue')
        }
    ]
}

// 身高测量
const height: RouteConfig = {
    path: '/height',
    component: Layout,
    children: [
        {
            path: 'prepare',
            name: 'HeightPrepare',
            meta: {
                title: '身高测量',
                nav: {
                    prev: '首页',
                    title: '',
                    icon: true,
                    isBackPre: true
                }
            },
            component: () => import('@/views/height/index.vue')
        }
    ]
}

export { mass, shape, girth, shoulder, height }
