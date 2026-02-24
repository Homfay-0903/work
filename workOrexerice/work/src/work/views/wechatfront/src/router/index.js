/**
 * App router config
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { isVAPro3, isVAPro5, isVAPro7 } from '@/types/device'
Vue.use(VueRouter)

const routes = [
    {
        // 微信回调登录
        path: '/',
        component: resolve => {
            import('@/pages/MenuCallBack.vue').then(resolve)
        }
    },
    {
        // 微信自定义菜单登录回调
        path: '/wechatAuth/menuCallBack',
        component: resolve => {
            import('@/pages/MenuCallBack.vue').then(resolve)
        }
    },
    {
        // 微信扫码登录回调
        path: '/wechatAuth/qrcodeCallBack',
        component: resolve => {
            import('@/pages/QrcodeCallBack.vue').then(resolve)
        }
    },
    {
        // 设备端公众号, 序列号绑定访问
        path: '/deviceAuth/deviceCallBack',
        component: resolve => {
            import('@/pages/DeviceBack.vue').then(resolve)
        }
    },
    {
        // APP对接回调登录
        path: '/appAuth/menuCallBack',
        component: resolve => {
            import('@/pages/AppCallBack.vue').then(resolve)
        }
    },
    {
        // APP对接回调登录(PC版 - 直接跳转到PC报告)
        path: '/appAuth/menuCallBackPc',
        component: resolve => {
            import('@/pages/AppCallBack.vue').then(resolve)
        }
    },
    {
        // 分享人口
        path: '/shareAuth/shareCallBack',
        component: resolve => {
            import('@/pages/ShareCallBack.vue').then(resolve)
        }
    },
    {
        // 用户注册页面
        path: '/register',
        component: resolve => {
            import('@/pages/register/Index.vue').then(resolve)
        },
        beforeEnter: (to, from, next) => {
            if (from.fullPath !== '/about/rule' && from.fullPath !== '/about/secret') {
                window.sessionStorage.removeItem('lookUserInfo')
            }
            next()
        }
    },
    // 综合报告页面
    {
        path: '/report',
        component: resolve => {
            import('@/pages/report/Index').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    // PC报告页面
    {
        path: '/pc-report',
        component: resolve => {
            import('@/pages/pc-report/index').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    // 首页
    // tabType 为tab类型
    {
        path: '/main/:tabType?',
        name: 'main',
        component: resolve => {
            import('@/pages/Main').then(resolve)
        },
        meta: {
            requiresAuth: true
        },
        beforeEnter: (to, from, next) => {
            if (to.name === 'main' && (isVAPro3() || isVAPro5()) || isVAPro7()) {
                console.log(`进入报告主页${isVAPro3() || isVAPro5() || isVAPro7()}`)
                next({ name: 'new-report' })
            } else {
                next()
            }
        }
    },
    // tabType 为tab类型
    {
        path: '/new-report',
        name: 'new-report',
        component: resolve => {
            import('@/pages/new-report/index').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    // 添加个性数据
    {
        path: '/body/custom',
        component: resolve => {
            import('@/pages/body/Custom').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    // 体成分趋势页面
    {
        path: '/body/trend',
        component: resolve => {
            import('@/pages/trend/Body').then(resolve)
        },
        meta: {
            requiresAuth: true
        },
        beforeEnter: (to, from, next) => {
            console.log(`当前跳转页面${to.path}`)
            if (isVAPro3() || isVAPro5() || isVAPro7()) {
                next({ path: '/new-body/trend' })
            } else {
                next()
            }
        }
    },
    // 体成分趋势页面
    {
        path: '/new-body/trend',
        component: resolve => {
            import('@/pages/trend/new-report/Body').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    // 围度趋势页面
    {
        path: '/girth/trend',
        component: resolve => {
            import('@/pages/trend/Girth').then(resolve)
        },
        meta: {
            requiresAuth: true
        },
        beforeEnter: (to, from, next) => {
            console.log(`当前跳转页面${to.path}`)
            if (isVAPro3() || isVAPro5() || isVAPro7()) {
                next({ path: '/new-girth/trend' })
            } else {
                next()
            }
        }
    },
    // 围度趋势页面
    {
        path: '/new-girth/trend',
        component: resolve => {
            import('@/pages/trend/new-report/Girth').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    // 历史记录页
    {
        path: '/report/historyPage',
        meta: {
            auth: true
        },
        component: resolve => {
            import('@/pages/history/historyPage.vue').then(resolve)
        }
    },
    {
        // 模型生成过渡页面
        path: '/modeling',
        component: resolve => {
            import('@/pages/modelGenerate/Index.vue').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        // 问卷调查页面
        path: '/question',
        component: resolve => {
            import('@/pages/questionnaires/index.vue').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        // 问卷调查页面
        path: '/footDetail',
        component: resolve => {
            import('@/pages/footDetails/index.vue').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        // 枕头问卷调查页面
        path: '/pillow-questions',
        component: resolve => {
            import('@/pages/pillowQuestions/index.vue').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    // 个人信息
    {
        path: '/personal',
        component: resolve => {
            import('@/pages/sidebar/user/Index.vue').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        // 关于我们
        path: '/about',
        component: resolve => {
            import('@/pages/sidebar/about/Index.vue').then(resolve)
        }
    },
    {
        // 用户使用协议
        path: '/about/rule',
        name: 'UserRule',
        component: resolve => {
            import('@/pages/sidebar/about/NewUserRule.vue').then(resolve)
        }
    },
    {
        // 用户隐私协议
        path: '/about/secret',
        name: 'UserSecret',
        component: resolve => {
            import('@/pages/sidebar/about/NewUserSecret.vue').then(resolve)
        }
    },
    {
        // 公告列表
        path: '/notice/list',
        component: resolve => {
            import('@/pages/sidebar/notice/List.vue').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        // 公告详情
        path: '/notice/info',
        component: resolve => {
            import('@/pages/sidebar/notice/Info.vue').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        //  问题反馈
        path: '/feedback',
        component: resolve => {
            import('@/pages/sidebar/feedback/Index.vue').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    // 分享页
    // type为分享类型
    {
        path: '/share/:type',
        component: resolve => {
            import('@/pages/share/shareMain.vue').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        // 分享预览页面
        // type 为分享类型
        path: '/share/preview/:type',
        component: resolve => {
            import('@/pages/share/Preview.vue').then(resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    // 引导页及缺失页
    {
        path: '/exception/wx',
        name: 'exception',
        component: resolve => {
            import('@/pages/exception/ExceptionWx.vue').then(resolve)
        }
    },
    {
        // 模型加载失败
        path: '/exception/load',
        component: resolve => {
            import('@/pages/exception/LoadFailure.vue').then(resolve)
        }
    },
    {
        // 登录无效 token过期
        path: '/exception/login',
        component: resolve => {
            import('@/pages/exception/LoginFailure.vue').then(resolve)
        }
    },
    {
        // APP对接无权限
        path: '/exception/perm',
        component: resolve => {
            import('@/pages/exception/NoPerm.vue').then(resolve)
        }
    },
    {
        // 404
        path: '/exception/page',
        component: resolve => {
            import('@/pages/exception/PageFailure.vue').then(resolve)
        }
    },
    {
        // 无测量报告
        path: '/exception/report',
        component: resolve => {
            import('@/pages/exception/ReportEmpty.vue').then(resolve)
        }
    },
    {
        // 有历史记录的报告失败
        path: '/exception/result',
        component: resolve => {
            import('@/pages/exception/ResultFailure.vue').then(resolve)
        }
    },
    {
        // 无历史记录的报告失败
        path: '/exception/result-no/:type',
        component: resolve => {
            import('@/pages/exception/ResultFailureNo.vue').then(resolve)
        }
    },
    {
        // 扫码模型已被绑定
        path: '/exception/binding',
        component: resolve => {
            import('@/pages/exception/ModelBinding.vue').then(resolve)
        }
    },
    {
        // 虚拟用户
        path: '/exception/fake-user',
        name: 'exception',
        component: resolve => {
            import('@/pages/exception/FakeUser.vue').then(resolve)
        }
    },
    // 公众号迁移提醒页面
    {
        path: '/transfer',
        component: resolve => {
            require(['@/pages/wechat/Transfer.vue'], resolve)
        }
    },
    // 维塑公众号引导页面
    {
        path: '/defaultGuide',
        component: resolve => {
            require(['@/pages/wechat/DefaultGuide.vue'], resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    // 未注册公众号引导页面
    {
        path: '/guide',
        component: resolve => {
            require(['@/pages/wechat/Guide.vue'], resolve)
        },
        meta: {
            requiresAuth: true
        }
    },
    // wifih5输入密码页
    {
        path: '/wifi',
        component: resolve => {
            require(['@/pages/wifih5/index.vue'], resolve)
        }
    },
    // wifih5生成二维码
    {
        path: '/wifi/qrcode',
        component: resolve => {
            require(['@/pages/wifih5/qrcode.vue'], resolve)
        }
    },
    {
        // 微信回调登录
        path: '/gen-qrcode',
        component: resolve => {
            import('@/pages/WirelessQRCodeGenerator.vue').then(resolve)
        }
    },
    {
        // 体重页面
        path: '/weight',
        component: resolve => {
            import('@/pages/weight/index.vue').then(resolve)
        }
    },
    {
        // 体重页面
        path: '/FatherAndMotherHeight',
        component: resolve => {
            import('@/pages/FatherAndMotherHeight/index.vue').then(resolve)
        }
    },
    // 其他 404
    {
        path: '/*',
        component: resolve => {
            import('@/pages/exception/PageFailure.vue').then(resolve)
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'active',
    scrollBehavior: () => ({
        y: 0
    }),
    routes
})
export default router
