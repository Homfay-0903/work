import path from 'path'
import fs from 'fs'
import { AdVideoFileManager } from './AdFileManager'
import ConcurrencyController from './ConcurrencyController'

export class AdVideoDownloader {
    private readonly FILE_SIZE_THRESHOLD = 50 * 1024 * 1024 // 50MB 阈值
    private readonly CHUNK_SIZE = 1024 * 1024 * 10 // 默认分片大小 10MB
    private readonly MAX_RETRIES = 3 // 最大重试次数
    responseLength: string | null // 请求体的长度用来判断文件大小
    downLoadController: ConcurrencyController
    constructor() {
        this.responseLength = null
        this.downLoadController = new ConcurrencyController(3)
    }

    // 获取请求头
    async getResponseLength(url: string): Promise<string | null> {
        if (this.responseLength) return this.responseLength
        const response = await fetch(url, { method: 'HEAD' })
        const contentLength = response.headers.get('Content-Length')
        this.responseLength = contentLength
        return contentLength
    }

    async downloadVideo(
        url: string,
        onProgress?: (loaded: number, total: number) => void,
        onComplete?: (blob: Blob) => void,
        onError?: (error: any) => void
    ): Promise<void> {
        try {
            const contentLength = await this.getResponseLength(url)

            if (!contentLength) {
                throw new Error('无法获取文件大小')
            }

            const fileSize = parseInt(contentLength, 10)

            // 根据文件大小决定下载方式
            if (fileSize < this.FILE_SIZE_THRESHOLD) {
                // 小于50MB直接下载
                await this.downloadDirectly(url, onProgress, onComplete)
            } else {
                // 大于等于50MB分片下载
                await this.downloadInChunks(url, this.CHUNK_SIZE, onProgress, onComplete)
            }
        } catch (error) {
            console.error('视频下载失败:', error)
            if (onError) {
                onError(error)
            }
            throw error
        }
    }

    private async downloadDirectly(
        url: string,
        onProgress?: (loaded: number, total: number) => void,
        onComplete?: (blob: Blob) => void
    ): Promise<void> {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const contentLength = response.headers.get('Content-Length')
        const total = contentLength ? parseInt(contentLength, 10) : 0
        const reader = response.body?.getReader()
        const chunks: Uint8Array[] = []
        let receivedLength = 0

        if (!reader) {
            // 如果无法获取reader，直接获取blob
            const blob = await response.blob()
            // 保存视频到项目目录
            await AdVideoFileManager.saveVideo(url, blob)

            if (onComplete) {
                onComplete(blob)
            }
            return
        }

        try {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const { done, value } = await reader.read()

                if (done) break
                if (!value) continue

                chunks.push(value)
                receivedLength += value.length
                onProgress && onProgress(receivedLength, total)
            }

            // 合并所有分片
            const blob = new Blob(chunks as BlobPart[], { type: 'video/mp4' })

            // 保存视频到项目目录
            await AdVideoFileManager.saveVideo(url, blob)

            // 调用完成回调
            onComplete && onComplete(blob)
        } finally {
            reader.releaseLock()
        }
    }

    /**
     * 分片下载文件
     * @param url 文件URL
     * @param chunkSize 分片大小
     * @param onProgress 进度回调
     * @param onComplete 完成回调
     */
    private async downloadInChunks(
        url: string,
        chunkSize: number,
        onProgress?: (loaded: number, total: number) => void,
        onComplete?: (blob: Blob) => void
    ): Promise<void> {
        const contentLength = await this.getResponseLength(url)

        if (!contentLength) {
            throw new Error('无法获取文件大小')
        }

        const totalSize = parseInt(contentLength, 10)
        const fileName = AdVideoFileManager.generateFileNameFromUrl(url)
        const tempDir = AdVideoFileManager.prepareTempDirectory()

        const downloadStateKey = `adDownloadState_${fileName}`
        let downloadedChunks: { [key: number]: boolean } = {}
        const failedChunks: number[] = []

        // 尝试加载之前的下载状态
        try {
            const stateData = localStorage.getItem(downloadStateKey)
            if (stateData) {
                const parsedState = JSON.parse(stateData)
                downloadedChunks = parsedState.downloadedChunks || {}
                window.logger.info('加载已有下载状态，继续下载')
            }
        } catch (e) {
            window.logger.warn('加载下载状态失败，重新开始下载')
        }

        const totalChunks = Math.ceil(totalSize / chunkSize)
        const chunks: (Uint8Array | null)[] = new Array(totalChunks).fill(null)

        // 初始化已下载的分片
        chunks.forEach((_, i) => {
            const chunkFileName = path.join(tempDir, `${fileName}.chunk${i}`)
            if (downloadedChunks[i] && fs.existsSync(chunkFileName)) {
                try {
                    const chunkData = fs.readFileSync(chunkFileName)
                    chunks[i] = new Uint8Array(chunkData)
                } catch (e) {
                    // 如果读取失败，则重新下载该分片
                    downloadedChunks[i] = false
                }
            }
        })

        // 准确计算已下载的字节数
        const calculateLoadedSize = () => {
            const down = chunks.filter((i) => i !== null)
            const size = down.length * chunkSize
            return Math.min(size, totalSize)
        }

        const downloadChunk = async (index: number, retries: number = 0): Promise<Uint8Array> => {
            const start = index * chunkSize
            const end = Math.min(start + chunkSize - 1, totalSize - 1)

            try {
                const response = await fetch(url, {
                    headers: {
                        Range: `bytes=${start}-${end}`
                    }
                })

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
                }

                const chunk = await response.arrayBuffer()
                const uint8Array = new Uint8Array(chunk)

                // 保存分片数据到临时文件
                const chunkFileName = path.join(tempDir, `${fileName}.chunk${index}`)
                fs.writeFileSync(chunkFileName, uint8Array)

                // 更新状态
                downloadedChunks[index] = true
                localStorage.setItem(downloadStateKey, JSON.stringify({ downloadedChunks }))
                return uint8Array
            } catch (error) {
                if (retries < this.MAX_RETRIES) {
                    // 失败重试
                    return downloadChunk(index, retries + 1)
                } else {
                    failedChunks.push(index)
                    throw error
                }
            }
        }

        // 跟踪总的已加载大小，避免进度回退
        let lastLoadedSize = calculateLoadedSize()
        if (onProgress && lastLoadedSize > 0) {
            onProgress(lastLoadedSize, totalSize)
        }

        // 清空之前的控制器任务队列
        for (let i = 0; i < totalChunks; i++) {
            if (downloadedChunks[i]) continue
            const promise = async () => {
                try {
                    const chunk = await downloadChunk(i)
                    chunks[i] = chunk

                    // 计算新的已加载大小并更新进度（仅当进度增加时）
                    const newLoadedSize = calculateLoadedSize()
                    if (newLoadedSize > lastLoadedSize) {
                        lastLoadedSize = newLoadedSize
                        onProgress && onProgress(newLoadedSize, totalSize)
                    }
                } catch (error) {
                    window.logger.error(`分片 ${i} 下载失败:`, error)
                    throw error
                }
            }

            this.downLoadController.add(promise)
        }

        // 等待所有下载任务完成
        await this.downLoadController.waitForAllDone()

        // 检查是否有失败的分片
        if (failedChunks.length > 0) {
            throw new Error(`以下分片下载失败: ${failedChunks.join(', ')}`)
        }

        // 合并所有分片
        const allChunks: Uint8Array[] = []
        for (let i = 0; i < chunks.length; i++) {
            try {
                if (chunks[i]) {
                    allChunks.push(chunks[i]!)
                }
            } catch (error) {
                throw new Error(`分片 ${i} 数据缺失`)
            }
        }

        // 删除临时状态文件和分片文件
        try {
            localStorage.removeItem(downloadStateKey)
            for (let i = 0; i < totalChunks; i++) {
                const chunkFileName = path.join(tempDir, `${fileName}.chunk${i}`)
                if (fs.existsSync(chunkFileName)) {
                    fs.unlinkSync(chunkFileName)
                }
            }
        } catch (e) {
            window.logger.warn('清理临时文件失败:', e)
        }

        // 合并所有分片
        const blob = new Blob(allChunks as BlobPart[])
        await AdVideoFileManager.saveVideo(url, blob)

        onComplete && onComplete(blob)
    }

    /**
     * 暂停下载
     * 触发暂停时，会先将正在下载的任务执行完，不再向下载队列中增加新下载任务
     */
    pause(): void {
        if (this.isPaused()) return
        this.downLoadController.pause()
    }

    // 恢复下载
    resume(): void {
        if (!this.isPaused()) return
        this.downLoadController.resume()
    }

    // 检查是否处于暂停状态
    isPaused(): boolean {
        return this.downLoadController.isPaused()
    }
}
