import path from 'path'
import { AdVideoFileManager } from './AdFileManager'
import { AdVideoDownloader } from './AdDownloader'
import { getProjectEnable } from '@/http/status-server-api'

class AdVideoManager {
    private downloader = new AdVideoDownloader()
    videoPath: string = ''
    url: string = ''
    isDownloading: boolean = false

    async checkVideoIsReady(deviceId: string): Promise<boolean> {
        if (this.videoPath) return true

        if (this.isDownloading) {
            this.resume()
            return false
        }
        const url = await this.getVideoUrl(deviceId)
        if (!url) return false

        const path = this.getAdVideo()
        return !!path
    }

    async getVideoUrl(deviceId: string): Promise<string | null> {
        const res = await getProjectEnable({ device_id: deviceId })
        if (res.code !== 0 || !res.data) return null
        const url = res.data.video_url as string
        this.url = url
        return url
    }

    getAdVideo(): string | null {
        if (!this.url) return null
        try {
            // 生成文件名
            const fileName = AdVideoFileManager.generateFileNameFromUrl(this.url)

            // 使用项目目录下的temp文件夹
            const projectRoot = path.resolve('./')
            const adVideoDir = path.join(projectRoot, 'temp')
            const filePath = path.join(adVideoDir, fileName)

            // 检查并处理视频文件
            const result = AdVideoFileManager.checkAndHandleVideoFile(filePath, adVideoDir, fileName, (path) => {
                this.videoPath = path
            })
            if (result) {
                return result
            }
        } catch (error) {
            console.error('检查本地文件失败:', error)
        }

        // 如果已经在下载，则返回null，不重复启动下载
        if (this.isDownloading) {
            window.logger.info('视频已在下载中...')
            return null
        }

        window.logger.info('本地未找到视频文件，开始下载...')
        this.isDownloading = true

        // 保存下载Promise以便后续调用可以等待同一个下载任务
        this.downloader
            .downloadVideo(
                this.url,
                (loaded, total) => {
                    console.log(`视频下载进度: ${Math.round((loaded / total) * 100)}%`)
                },
                (blob) => {
                    window.logger.info('视频下载完成，已保存到临时目录')
                    this.isDownloading = false
                },
                (error) => {
                    console.error('视频下载失败:', error)
                    this.isDownloading = false
                }
            )
            .catch((error) => {
                console.error('视频下载失败:', error)
                this.isDownloading = false
            })

        return null
    }

    pause(): void {
        if (this.isDownloading) {
            this.downloader.pause();
            window.logger.info('视频下载已暂停')
        }
    }

    resume(): void {
        if (this.isDownloading && this.downloader.isPaused()) {
            this.downloader.resume();
            window.logger.info('视频下载已恢复')
        }
    }

    isPaused(): boolean {
        return this.downloader.isPaused();
    }
}

export default new AdVideoManager()
