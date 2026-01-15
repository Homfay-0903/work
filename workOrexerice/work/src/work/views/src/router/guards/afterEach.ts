import { nextTick } from 'vue'
import { useSettingStore } from '@/store/modules/setting'
import { Router } from 'vue-router'
import NProgress from 'nprogress'
import { useCommon } from '@/hooks/core/useCommon'
import { loadingService } from '@/utils/ui'
import { getPendingLoading, resetPendingLoading } from './beforeEach'

// 记录 loading 开始时间
let loadingStartTime = 0
// 最小显示时间（毫秒），避免闪烁
const MIN_LOADING_TIME = 300

/** 路由全局后置守卫 */
export function setupAfterEachGuard(router: Router) {
    const { scrollToTop } = useCommon()

    router.afterEach(() => {
        scrollToTop()

        // 关闭进度条
        const settingStore = useSettingStore()
        if (settingStore.showNprogress) {
            NProgress.done()
            // 确保进度条完全移除，避免残影
            setTimeout(() => {
                NProgress.remove()
            }, 600)
        }

        // 关闭 loading 效果
        if (getPendingLoading()) {
            const elapsedTime = Date.now() - loadingStartTime
            const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime)

            // 确保至少显示最小时间，避免闪烁
            setTimeout(() => {
                nextTick(() => {
                    loadingService.hideLoading()
                    resetPendingLoading()
                })
            }, remainingTime)
        }
    })
}

/** 记录 loading 开始时间 */
export function recordLoadingStartTime(): void {
    loadingStartTime = Date.now()
}
