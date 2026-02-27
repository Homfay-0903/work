import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/main'
import Print from '@/pages/print'
import AiAssistant from '@/pages/ai-assistant/index'
import aiPrint from '@/pages/ai-assistant/print'

Vue.use(Router)

export default new Router({
    routes: [
        // 打印服务访问跳转处理
        {
            path: '/',
            component: Print
        },
        {
            path: '/report',
            component: Main
        },
        {
            path: '/ai-assistant',
            component: AiAssistant
        },
        {
            path: '/ai-print',
            component: aiPrint
        },
    ]
})
