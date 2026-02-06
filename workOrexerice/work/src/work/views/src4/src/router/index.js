import Vue from 'vue'
import Router from 'vue-router'

import LoginLayout from '@/components/layout/Login'
import HomeLayout from '@/components/layout/Home'
import ScanList from '@/pages/home/ScanList'
import BindList from '@/pages/bind-list/index'
import Question from '@/pages/question/index'
import page404 from '@/pages/error/404'

Router.prototype.goBack = function() {
    this.isBack = true
    window.history.go(-1)
}

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Login',
            component: LoginLayout,
            children: [
                {
                    // 登录页
                    path: '/login',
                    name: 'Login',
                    component: resolve => {
                        import('@/pages/login/Index.vue').then(resolve)
                    }
                },
                {
                    // 忘记密码
                    path: '/forget',
                    name: 'ForgetPwd',
                    component: resolve => {
                        import('@/pages/login/ForgetPwd.vue').then(resolve)
                    }
                },
                {
                    // 联系我们
                    path: '/contact',
                    name: 'NoLoginContact',
                    component: resolve => {
                        import('@/pages/login/Contact.vue').then(resolve)
                    }
                }
            ]
        },
        {
            // 首页
            path: '/home',
            meta: {
                requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            },
            component: HomeLayout,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: ScanList
                }
            ]
        },
        {
            // 用户信息绑定
            path: '/custom',
            meta: {
                requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            },
            component: HomeLayout,
            children: [
                {
                    path: '',
                    name: 'Custom',
                    component: BindList
                },
                {
                    // 用户使用协议
                    path: 'rule',
                    name: 'UserRule',
                    component: resolve => {
                        import('@/pages/bind-list/new-user-rule.vue').then(resolve)
                    }
                },
                {
                    // 用户隐私协议
                    path: 'secret',
                    name: 'UserSecret',
                    component: resolve => {
                        import('@/pages/bind-list/new-user-secret.vue').then(resolve)
                    }
                }
            ]
        },
        {
            // 解读列表
            path: '/interpret-list',
            meta: {
                requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            },
            component: HomeLayout,
            children: [
                {
                    path: '',
                    name: 'interpret',
                    component: resolve => {
                        import('@/pages/home/InterpretList.vue').then(resolve)
                    }
                }
            ]
        },
        {
            // 用户设置
            path: '/user',
            component: HomeLayout,
            children: [
                {
                    path: '',
                    redirect: { name: 'UserAccount' }
                },
                {
                    // 修改密码
                    path: 'password',
                    name: 'UserPassword',
                    meta: {
                        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
                    },
                    component: resolve => {
                        import('@/pages/user/Password.vue').then(resolve)
                    }
                },
                {
                    // 帐号设置
                    path: 'account',
                    name: 'UserAccount',
                    meta: {
                        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
                    },
                    component: resolve => {
                        import('@/pages/user/Account.vue').then(resolve)
                    }
                },
                {
                    // 关于我们
                    path: 'about',
                    name: 'LoginAbout',
                    component: resolve => {
                        import('@/pages/home/About.vue').then(resolve)
                    }
                }
            ]
        },
        // 体成份标准设置
        {
            path: '/ingredient',
            meta: {
                requireAuth: true
            },
            component: HomeLayout,
            children: [
                {
                    path: '/',
                    name: 'ingredient',
                    component: resolve => {
                        import('@/pages/ingredient/Index.vue').then(resolve)
                    }
                },
                {
                    path: 'record',
                    name: 'record',
                    component: resolve => {
                        import('@/pages/ingredient/Record.vue').then(resolve)
                    }
                }
            ]
        },
        // 设备信息页
        {
            path: '/device',
            meta: {
                requireAuth: true
            },
            component: HomeLayout,
            children: [
                {
                    path: '',
                    name: 'DeviceInfo',
                    component: resolve => {
                        import('@/pages/device/Index.vue').then(resolve)
                    }
                }
            ]
        },
        {
            // 消息列表
            path: '/news',
            meta: {
                requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            },
            component: HomeLayout,
            children: [
                {
                    path: '',
                    name: 'News',
                    component: resolve => {
                        import('@/pages/news/List.vue').then(resolve)
                    }
                }
            ]
        },
        // 查看报告
        {
            path: '/report',
            meta: {
                requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            },
            component: HomeLayout,
            beforeEnter(to, from, next) {
                /*
                  to 目标路由
                  from 源路由
                  next 跳转到下一个路由
                */
                const users = JSON.parse(window.localStorage.getItem('userTokens')).token
                if (users) {
                    next()
                } else {
                    next({
                        path: '/'
                    })
                }
            },
            children: [
                {
                    path: '',
                    name: 'Report',
                    component: resolve => {
                        import('@/pages/report/Index.vue').then(resolve)
                    }
                }
            ]
        },
        // 填写问卷
        {
            path: '/question',
            meta: {
                requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            },
            component: HomeLayout,
            beforeEnter(to, from, next) {
                /*
                  to 目标路由
                  from 源路由
                  next 跳转到下一个路由
                */
                const users = JSON.parse(window.localStorage.getItem('userTokens')).token
                if (users) {
                    next()
                } else {
                    next({
                        path: '/'
                    })
                }
            },
            children: [
                {
                    path: '',
                    name: 'question',
                    component: Question
                }
            ]
        },
        // 设备对接设置
        {
            path: '/access',
            meta: {
                requireAuth: true
            },
            component: HomeLayout,
            children: [
                {
                    path: '/access',
                    name: 'AccessPage',
                    component: resolve => {
                        import('@/pages/access/IndexPage.vue').then(resolve)
                    }
                },
                {
                    path: 'single',
                    name: 'SingleAccessPage',
                    component: resolve => {
                        import('@/pages/access/SinglePage.vue').then(resolve)
                    }
                },
                {
                    path: 'wechat',
                    name: 'AccessWechat',
                    component: resolve => {
                        import('@/pages/access/Wechat.vue').then(resolve)
                    }
                },
                {
                    path: 'api',
                    name: 'AccessApi',
                    component: resolve => {
                        import('@/pages/access/Api.vue').then(resolve)
                    }
                },
                {
                    path: 'app',
                    name: 'AccessApp',
                    component: resolve => {
                        import('@/pages/access/App.vue').then(resolve)
                    }
                }
            ]
        },
        // Api文档
        {
            path: '/doc',
            meta: {
                requireAuth: true
            },
            component: HomeLayout,
            children: [
                {
                    path: '',
                    name: 'doc',
                    component: resolve => {
                        import('@/pages/home/ApiDoc.vue').then(resolve)
                    }
                },
                {
                    path: '/doc/:id',
                    name: 'docId',
                    component: resolve => {
                        import('@/pages/home/ApiDoc.vue').then(resolve)
                    }
                }
            ]
        },
        // 支付系统
        {
            path: '/pay',
            name: 'pay',
            component: HomeLayout
        },
        // 缴费记录
        {
            path: '/pay/renewal',
            name: 'renewal',
            component: HomeLayout
        },
        // 开票
        {
            path: '/pay/CreateInvoice',
            name: 'CreateInvoice',
            component: HomeLayout
        },
        {
            path: '/*',
            name: 'error_404',
            component: page404
        }
    ]
})
