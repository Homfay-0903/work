type AsyncTask<T> = () => Promise<T>

/**
 * 并发控制类
 */
export default class ConcurrencyController {
    private concurrency: number
    private runningCount = 0
    private queue: AsyncTask<any>[] = []
    private paused = false
    private resolveWhenAllDone?: () => void
    handleDone?: () => void

    constructor(concurrency = 3, handleDone?: () => void) {
        this.concurrency = concurrency
        this.handleDone = handleDone
    }

    // 添加任务
    add<T>(task: AsyncTask<T>) {
        // 如果是暂停状态，将任务加入队列但不执行
        if (this.paused) {
            this.queue.push(task)
            return
        }

        // 正常添加任务
        this.queue.push(task)
        this.tryRunNext()
    }

    // 尝试运行下一个任务
    private tryRunNext() {
        if (this.paused) return
        if (this.runningCount >= this.concurrency) return

        const task = this.queue.shift()
        if (!task) {
            if (this.runningCount === 0 && this.resolveWhenAllDone) {
                this.handleDone && this.handleDone()
                this.resolveWhenAllDone()
                this.resolveWhenAllDone = undefined
            }
            return
        }

        this.runningCount++
        task()
            .catch((err) => console.error('任务执行失败:', err))
            .finally(() => {
                this.runningCount--
                this.tryRunNext()
            })

        // 如果还能继续跑下一个，就递归触发
        this.tryRunNext()
    }

    // 暂停新任务启动（当前任务继续执行直到完成）
    pause() {
        this.paused = true
    }

    // 恢复任务启动
    resume() {
        if (!this.paused) return
        this.paused = false
        this.tryRunNext()
    }

    // 检查是否处于暂停状态
    isPaused(): boolean {
        return this.paused
    }

    // 等待所有任务完成
    waitForAllDone(): Promise<void> {
        if (this.runningCount === 0 && this.queue.length === 0) {
            return Promise.resolve()
        }
        return new Promise((resolve) => {
            this.resolveWhenAllDone = resolve
        })
    }
}
