/*
 * @Description: do something
 * @Author: WendyGao
 * @Date: 2022-02-08 11:26:02
 * @LastEditors: liutq
 * @LastEditTime: 2025-12-15 16:43:51
 */
'use strict'
import fs from 'fs'
import os from 'os'
import path from 'path'
import log from 'electron-log'

import * as Sentry from '@sentry/electron'
import { app, protocol, BrowserWindow, globalShortcut, powerSaveBlocker, ipcMain } from 'electron'
import * as crypto from 'crypto'

import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

app.commandLine.appendSwitch('disable-web-security')
app.commandLine.appendSwitch('disable-site-isolation-trials')
app.commandLine.appendSwitch('use-gl', 'angle')
app.commandLine.appendSwitch('use-angle', 'gles-egl')
app.commandLine.appendSwitch('use-cmd-decoder', 'passthrough')
app.commandLine.appendSwitch('no-sandbox')
app.commandLine.appendSwitch('gpu-sandbox-start-early')
app.commandLine.appendSwitch('ignore-gpu-blocklist')
app.commandLine.appendSwitch('ignore-gpu-blocklist')
 
app.commandLine.appendSwitch('enable-chrome-browser-cloud-management')
app.commandLine.appendSwitch('enable-remote-extensions')
app.commandLine.appendSwitch('enable-webgpu-developer-features')
app.commandLine.appendSwitch('enable-unsafe-webgpu')
app.commandLine.appendSwitch('show-component-extension-options')
app.commandLine.appendSwitch('no-default-browser-check')
app.commandLine.appendSwitch('disable-pings')
app.commandLine.appendSwitch('media-router', '0')
 
app.commandLine.appendSwitch('enable-accelerated-video-decode')
app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder,VaapiVideoEncoder,CanvasOopRasterization')

// 启动阻止显示器休眠和应用挂起的保护
const blockerId = powerSaveBlocker.start('prevent-display-sleep')

// 应用根目录：开发环境：项目根目录，生产环境：应用根目录
const localPath = isDevelopment ? __dirname + '/../' : path.dirname(process.execPath)

// 模块级私有变量：存储 WellnessHub 密钥（不暴露给渲染进程）
let wellnessHubSecret: string | undefined

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

// 主进程日志存储文件路径
const logPath = path.join(localPath, '/logs')
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath)
}
console.log(logPath)
// 日志存储文件名称
log.transports.file.file = logPath + '/main.log'

log.info('blockerId', blockerId)

// -v 获取版本号
const argv = process.argv.slice(1)
if (argv[0] === '--version' || argv[0] === '-v') {
    const localPackageFile = path.join(__dirname + '/package.json')
    try {
        const dataStr = fs.readFileSync(localPackageFile).toString()
        const ver = JSON.parse(dataStr).version
        console.info(`vr3.0-${ver}`)
    } catch (error) {
        console.info(error)
    }
    process.exit(0)
}

function initSentry(config: any) {
    Sentry.init({
        dsn: config.SENTRY.ELECTRON_DSN || '',
        release: config.MASTER_VERSION || `${config.APP_NAME}@v${config.APP_VERSION}`,
        environment: config.SENTRY.ENVIRONMENT || process.env.NODE_ENV
    })

    // 添加应用版本号
    Sentry.setTag('version', config.APP_VERSION)

    // 添加上下文
    const content = config.SENTRY.CONTENT || {}
    if (Object.keys(content).length !== 0) {
        Sentry.setContext('device-info', config.SENTRY.CONTENT)
    }

    // 添加自定义标签
    const tags = config.SENTRY.TAG || {}
    for (const key in tags) {
        Sentry.setTag(key, tags[key])
    }

    // 添加设备ID作为唯一标识
    Sentry.setUser({ id: config.DEVICE_ID })
}

/**
 * 加载应用本地配置
 */
function loadLocalConfig() {
    try {
        const dataStr = fs.readFileSync(path.join(localPath, './config.json')).toString()
        const localConfig = JSON.parse(dataStr)
        let DEVICE_ID = 'DEV000000000002'
        let MASTER_VERSION = 'dev@1.0.0'
        let PRODUCT_VERSION = 'v1.0.0.product'
        // 线上环境读取配置的真实数据
        if (!isDevelopment) {
            DEVICE_ID = fs.readFileSync(path.join(localConfig.DEVICE_ID_PATH)).toString()
            // 格式为 v[版本号].产品名缩写 例如 v2.1.0.VR-PRO3
            const productVer = fs.readFileSync(path.join(localConfig.MASTER_VERSION_PATH)).toString()
            const idx = productVer.lastIndexOf('.')
            const version = productVer.substring(0, idx)
            const product = productVer.substring(idx + 1).toLocaleLowerCase()
            MASTER_VERSION = `${product}@${version}`
            const versionIdx = productVer.lastIndexOf('version:')
            PRODUCT_VERSION =
                versionIdx > -1
                    ? productVer.substring(versionIdx + 8).replace(/\n/g, '')
                    : productVer.replace(/\n/g, '')
            log.info('[App]: 产品版本:', productVer)
        }
        // 分离密钥，不传递给渲染进程
        const { WELLNESS_HUB_SECRET, ...configWithoutSecret } = localConfig
        wellnessHubSecret = WELLNESS_HUB_SECRET

        const config = {
            // 应用根目录
            LOCAL_PATH: localPath,
            DEVICE_ID,
            MASTER_VERSION,
            PRODUCT_VERSION,
            APP_VERSION: process.env.npm_package_version,
            APP_NAME: process.env.npm_package_name,
            ...configWithoutSecret  // 不包含密钥的配置
        }
        log.info('[App]: 应用配置加载成功:', config)
        
        // 不传递密钥给渲染进程
        process.env.APP_CONFIG = JSON.stringify(config)
        
        initSentry(config)
    } catch (error) {
        log.error(error)
    }
}

async function createWindow() {
    log.info('[App]: 应用启动')
    // Create the browser window.
    const win = new BrowserWindow({
        width: isDevelopment ? 540 : 1080,
        // 加上导航栏的高度 28
        height: isDevelopment ? 988 : 1920,
        fullscreen: !isDevelopment,
        titleBarStyle: isDevelopment ? 'default' : 'hiddenInset',
        backgroundColor: '#000000',
        show: false,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION as unknown as boolean,
            // 上下文隔离
            contextIsolation: false,
            webSecurity: false
        }
    })
    win.on('ready-to-show', () => {
        win.show()
    })
    // win.webContents.openDevTools()
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        // if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
    // win.webContents.openDevTools()
    // 注册快捷键打开控制台 - 用于生产调试
    globalShortcut.register('CommandOrControl+Shift+m', () => {
        win.webContents.openDevTools()
    })
}

/**
 * 本地媒体资源文件路径替换
 */
function replaceLocalFile() {
    const protocolName = 'media-file'
    protocol.registerFileProtocol(protocolName, (request, callback) => {
        const url = request.url.replace(`${protocolName}://`, '')
        // const filePath = isDevelopment ? `${path.resolve('./public')}/${url}` : `${__dirname}/${url}`
        let filePath = ''
        if (url.startsWith('temp/')) {
            // 处理adVideo目录的文件，从项目目录下的temp文件夹直接读取
            const fileName = url.replace('temp/', '')
            const projectRoot = isDevelopment ? path.resolve('./') : path.dirname(process.execPath)
            const adVideoDir = path.join(projectRoot, 'temp')
            filePath = path.join(adVideoDir, fileName)
        } else {
            // 处理其他媒体文件
            filePath = isDevelopment ? `${path.resolve('./public')}/${url}` : `${__dirname}/${url}`
        }
        try {
            return callback(decodeURIComponent(filePath))
        } catch (error) {
            log.error(error)
        }
    })
}
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
loadLocalConfig()
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
/**
 * 生成签名（用于Token验证）- 只在主进程执行
 */
function generateSignature(timestamp: number, randomNumber: number): string {
    if (!wellnessHubSecret) {
        throw new Error('WellnessHub密钥未初始化')
    }
    const baseString = `${timestamp}.${randomNumber}.${wellnessHubSecret}`
    const hash = crypto.createHash('md5').update(baseString).digest('hex')
    return hash
}

/**
 * 生成WellnessHub API Token（用于接口权限验证）- 只在主进程执行
 * Token格式："{Unix时间戳-1733961600}.{7位随机数}.{签名}"
 */
function generateWellnessHubToken(): string {
    const currentTime = Math.floor(Date.now() / 1000)
    const unixTimestamp = currentTime - 1733961600
    const randomNumber = Math.floor(1000000 + Math.random() * 9000000)
    const signature = generateSignature(unixTimestamp, randomNumber)
    const token = `${unixTimestamp}.${randomNumber}.${signature}`
    return token
}

app.on('ready', async () => {
    replaceLocalFile()
    createWindow()
    
    // 注册 IPC 处理器：生成 WellnessHub Token
    // 渲染进程通过 IPC 调用此方法生成 Token，密钥不会暴露给渲染进程
    ipcMain.handle('generate-wellness-token', () => {
        try {
            if (!wellnessHubSecret) {
                log.error('[WellnessHub]: 密钥未初始化')
                return { success: false, error: '密钥未初始化' }
            }
            const token = generateWellnessHubToken()
            log.debug('[WellnessHub]: 主进程生成Token成功')
            return { success: true, token }
        } catch (error: any) {
            log.error('[WellnessHub]: 生成Token失败', error)
            return { success: false, error: error.message || '生成Token失败' }
        }
    })
    
    log.info('[App]: IPC处理器注册完成')
})

app.on('gpu-process-crashed', (event, kill) => {
    log.error('app:gpu-process-crashed', event, kill)
})

app.on('renderer-process-crashed', (event, webContents, kill) => {
    log.error('app:renderer-process-crashed', event, webContents, kill)
})

app.on('render-process-gone', (event, webContents, details) => {
    log.error('app:render-process-gone', event, webContents, details)
})

app.on('child-process-gone', (event, details) => {
    log.error('app:child-process-gone', event, details)
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
