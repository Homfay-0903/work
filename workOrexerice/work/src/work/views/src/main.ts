import App from './App.vue'
import { createApp } from 'vue'
import { initStore } from './store' // Store
import { initRouter } from './router' // Router
import language from './locales' // 国际化
import '@styles/core/tailwind.css' // tailwind
import '@styles/index.scss' // 样式
import '@utils/sys/console' // 控制台输出内容
import { setupGlobDirectives } from './directives'
import { setupErrorHandle } from './utils/sys/error-handle'
import { isInDingTalk } from './utils/dingtalk'

document.addEventListener('touchstart', function () {}, { passive: false })

const app = createApp(App)
initStore(app)
initRouter(app)
setupGlobDirectives(app)
setupErrorHandle(app)

app.use(language)
app.mount('#app')

// 初始化钉钉 JSAPI（如果在钉钉环境中）
if (isInDingTalk()) {
    console.log('[DingTalk] 检测到钉钉环境，初始化钉钉 JSAPI')
    // 钉钉 JSAPI 的初始化会在路由守卫中进行
}
