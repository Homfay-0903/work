import { loadMicroApp, start, removeGlobalUncaughtErrorHandler } from 'qiankun'
import { apps } from './registerApp'

// 微应用注册
export const registerApps = () => {
    removeGlobalUncaughtErrorHandler(loadMicroApp)
    loadMicroApp(apps)
    start(
        {
            prefetch: 'All', // 是否开启预加载，默认为 true
            sandbox: true, // 开启沙箱
            singular: false,
        }
    )
}