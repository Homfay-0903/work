import path from 'path'
import fs from 'fs'

export class AdVideoFileManager {
    static checkAndHandleVideoFile(
        filePath: string,
        adVideoDir: string,
        fileName: string,
        updateVideoPath?: (path: string) => void
    ): string | null {
        // 从localStorage获取之前保存的文件名
        const storedFileName = localStorage.getItem('adVideoFileName')

        // 如果存储的文件名与当前文件名不同，清理旧文件
        if (storedFileName && storedFileName !== fileName) {
            const oldFilePath = path.join(adVideoDir, storedFileName)
            if (fs.existsSync(oldFilePath)) {
                try {
                    fs.unlinkSync(oldFilePath)
                    window.logger.info('删除旧视频文件:', oldFilePath)
                } catch (deleteError) {
                    console.error('删除旧视频文件失败:', deleteError)
                }
            }
            // 需要下载新文件
            return null
        }

        // 检查当前请求的文件是否存在
        if (!fs.existsSync(filePath)) return null

        // 文件存在，使用现有文件
        const mediaFilePath = `media-file://temp/${fileName}`
        updateVideoPath && updateVideoPath(mediaFilePath)
        window.logger.info('使用本地视频文件:', mediaFilePath)
        return mediaFilePath
    }

    static async saveVideo(url: string, blob: Blob, updateVideoPath?: (path: string) => void): Promise<void> {
        try {
            // 使用项目目录下的temp文件夹
            const projectRoot = path.resolve('./')
            const adVideoDir = path.join(projectRoot, 'temp')

            // 检查并创建temp文件夹
            if (!fs.existsSync(adVideoDir)) {
                fs.mkdirSync(adVideoDir, { recursive: true })
            }

            // 从URL生成文件名
            const fileName = AdVideoFileManager.generateFileNameFromUrl(url)
            const filePath = path.join(adVideoDir, fileName)

            // 将Blob转换为Buffer并写入文件
            const arrayBuffer = await blob.arrayBuffer()
            fs.writeFileSync(filePath, new Uint8Array(arrayBuffer))

            // 更新videoPath为media-file协议路径
            const mediaFilePath = `media-file://temp/${fileName}`
            updateVideoPath && updateVideoPath(mediaFilePath)
            window.logger.info('视频已保存到临时目录:', filePath)

            // 将文件名保存到localStorage
            localStorage.setItem('adVideoFileName', fileName)
        } catch (error) {
            console.error('保存视频失败:', error)
        }
    }

    static generateFileNameFromUrl(url: string): string {
        // 使用URL的pathname部分作为文件名基础
        const urlObj = new URL(url)
        let fileName = path.basename(urlObj.pathname)

        // 确保文件名以.mp4结尾
        if (!fileName.endsWith('.mp4')) {
            const ext = path.extname(fileName)
            if (ext) {
                // 替换现有扩展名为.mp4
                fileName = fileName.replace(new RegExp(ext + '$'), '.mp4')
            } else {
                // 添加.mp4扩展名
                fileName += '.mp4'
            }
        }

        // 确保文件名是安全的
        fileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_')

        return fileName
    }

    static prepareTempDirectory(): string {
        const projectRoot = path.resolve('./')
        const tempDir = path.join(projectRoot, 'temp')

        // 创建临时目录
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true })
        }

        return tempDir
    }
}
