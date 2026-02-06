
import { paymentUrl } from '@/assets/js/config.js'

// 微服务注册
export const apps =
    {
        name: 'payment-system',
        entry: paymentUrl,
        container: '#subapp-container',
        activeRule: 'pay',
        props: { brand: 'qiankun' },
    }


/* qiankun全局声明周期钩子 */
export const microConfig = {
    beforeLoad: [
        (app) => {
            console.log('%c before load', 'background:#3a5ab0 ; padding: 1px; border-radius: 3px;  color: #fff', app)
        },
    ], // 挂载前回调
    beforeMount: [
        (app) => {
            console.log('%c before mount', 'background:#7d9553 ; padding: 1px; border-radius: 3px;  color: #fff', app)
        },
    ], // 挂载后回调
    afterUnmount: [
        (app) => {
            console.log('%c after unload', 'background:#d2525c ; padding: 1px; border-radius: 3px;  color: #fff', app)
        },
    ], // 卸载后回调
}
