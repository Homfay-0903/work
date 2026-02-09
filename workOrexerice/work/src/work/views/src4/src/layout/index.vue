<template>
    <div id="layout">
        <!-- <button @click="isShutDown" style="position: absolute; z-index: 1000; width: 100px; height: 100px;"></button> -->
        <!-- 顶部状态栏 -->
        <status-bar></status-bar>
        <!-- 导航栏 -->
        <navigation-bar
            v-if="$route.meta.nav"
            :info="$route.meta.nav.id === 3 ? meteTitle : $route.meta.nav"
            @goBack="goBack"
        ></navigation-bar>
        <!-- 按钮操作说明 -->
        <btn
            v-show="showBtn"
            ref="btn"
            :btnList="pageInfo.btnList"
            :openNotOperated="pageInfo.openNotOperated"
            @on-not-operated="handleNotOperated"
        ></btn>

        <!-- 关机页面动画 -->
        <shut-down
            ref="shutdown"
            v-model="openShutDownView"
            @on-audio-event="onAudioEvent"
            @on-close-shut-down="onCloseShutDownView"
            :value="isChange"
        ></shut-down>
        <!-- 不可关机全局弹窗提醒 -->
        <msg-box
            v-model="openShutDownBox"
            :duration="5"
            @on-close="onCloseShutDownBox"
            :title="!touchConnected ? $t('touch-disabled') : $t('shut-down.msg-box')"
        >
            <img slot="icon" class="img-style" :src="require('@img/shutdown/is_use.svg')" alt="关机" />
        </msg-box>
        <!-- 语音 -->
        <audios keep-alive ref="audio" @on-audio-end="onAudioEnd"></audios>
        <!-- <button @click="test">test</button> -->
        <!-- 承载子路由的容器 -->
        <router-view ref="currentView" @on-audio-event="onAudioEvent"></router-view>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import schedule from 'node-schedule'
import { StatusBar, Btn, Audios, NavigationBar } from './components'
import { EventBus } from '@/util/event-bus'
import router from '@/router'
import ShutDown from './components/ShutDown.vue'
import MsgBox from '@/components/MsgBox.vue'
const moment = require('moment')
import CONFIG from '@/config/index'
import { themes } from '@/theme/modal'
import SocketService from '@/socket/socket-service'
import { getQRCode, sendMeasureMode } from '@/http/status-server-api'
export default {
    components: {
        StatusBar,
        Btn,
        Audios,
        NavigationBar,
        ShutDown,
        MsgBox
    },
    data() {
        return {
            lastKey: { code: -1, isPress: false },
            // 长按计时器
            longKeypressTimer: null,
            // 是否可强制返回状态
            isBack: true,
            // 显示不可关机弹窗
            openShutDownBox: false,
            isChange: false,
            // 按键点击时间
            btnUpTime: 0,
            btnUpTimer: null,
            doubleClickTime: 300, // ms
            isLongClick: false,
            // 播放音频延时
            audioTimer: null
        }
    },
    computed: {
        ...mapGetters([
            'pageInfo',
            'printQueue',
            'meteTitle',
            'deviceInfo',
            'settingInfo',
            'openShutDownView',
            'deviceUsable',
            'deviceErrors',
            'external'
        ]),
        showBtn() {
            // console.log(
            //     `参数 ${this.pageInfo.display} ${this.deviceInfo.operationMode} ${this.pageInfo.btnList.length}`
            // )
            return (this.pageInfo.display || this.deviceInfo.operationMode === 2) && this.pageInfo.btnList.length
        },
        themeName() {
            return this.deviceInfo.operationMode === 1 ? 'touch' : 'btn'
        },
        touchConnected() {
            console.log('this.external.touch :', this.external.touch)
            return this.external.touch
        }
    },
    watch: {
        // 监听设备状态
        deviceUsable: {
            handler(val, oldVal) {
                if (val !== oldVal) {
                    this.checkDeviceState(val)
                }
            },
            deep: true
        },
        // 打印队列改变
        printQueue(printQueue) {
            window.logger.debug('打印队列改变:', JSON.stringify(printQueue))
            if (printQueue.length) {
                printQueue.forEach((v) => {
                    // 如果成功、异常 失败，重置打印状态
                    if ([0, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(v.statusCode) > -1) {
                        v.isPrinting = false
                    }
                })
                // 过滤出状态为打印中或排队中的
                let filterQueue = printQueue.filter((item) => {
                    return item.statusCode === 1 && item.phoneNum
                })
                // 根据printWait排序
                filterQueue.sort((a, b) => {
                    return b.printWait - a.printWait
                })
                // 是否有打印机异常状态数据
                // const printErrData = printQueue.find(function (value) {
                //     return value.statusCode === 7
                // })
                for (let i = 0; i < filterQueue.length; i++) {
                    // 已经有正在打印的
                    if (filterQueue[i].isPrinting) {
                        break
                    }
                    if (i === filterQueue.length - 1 && !filterQueue[i].isPrinting) {
                        // 只打印状态为打印中，并且未打印的
                        // if (!printErrData) {
                        // 发起打印
                        let printInfo = filterQueue[filterQueue.length - 1]
                        printInfo.isPrinting = true
                        // 切换状态打印中
                        printInfo.statusCode = 1
                        this.$store.commit('CHANGE_REPORT_LIST', printInfo)
                        window.logger.info('正在打印 scanid====:', printInfo.scanId, this.select(this.settingInfo.i18n))

                        // 发起打印请求 暂时没有用到
                        this.$controlClient.printReport(
                            printInfo.scanId,
                            this.select(this.settingInfo.i18n),
                            this.settingInfo.pageSize
                        )
                        // }
                    }
                }
            }
        },
        //
        $route: {
            handler(newRouter) {
                if (newRouter.meta.isBack && newRouter.meta.isBack !== undefined) {
                    this.isBack = false
                }
                // 恢复长按返回状态
                if (newRouter.name === 'Home') {
                    this.isBack = true
                }
            },
            immediate: true
        },
        themeName: {
            handler() {
                this.applyTheme()
            },
            deep: true,
            immediate: true
        },
        touchConnected: {
            handler() {
                this.touchDisabled()
            },
            deep: true,
            immediate: true
        }
    },
    beforeRouteEnter(to, from, next) {
        // 页面切换重置page info 暂未用到
        // this.clearPageInfo()
        next()
    },
    created() {
        EventBus.$on('GenScanId', (data) => {
            window.logger.debug('监听生成扫描ID事件:', data)
            // 获取二维码
            window.logger.info('发起二维码请求', data.deviceId)
            // this.$statusClient.getQRCode(data.deviceId, data.scanId)
            getQRCode({
                scan_id: data.scanId,
                device_id: data.deviceId
            })
            // 是否开启三项合一测量
            this.sendThirdMode(data)
        })
        // 设备到期查询
        this.scheduleRenewal()
        this.monitorKeyEvent()
        // 监听网络状态
        this.networkStatus()
        if (this.deviceInfo.deviceType > 0) {
            window.logger.debug('设备超时提醒触发')
            this.timeoutReminder()
        }
    },
    mounted() {
        // 关机软开关事件
        EventBus.$on('ShutDownAction', (data, type, longClick) => {
            window.logger.debug('关机软开关事件', data, type, longClick)
            if (data === 'ButtonEvent') {
                if (type === 1) {
                    // 软开关关机
                    if (longClick) {
                        this.isShutDown()
                    } else {
                        this.keypressBindEvent(3)
                    }
                } else if (type > 2) {
                    // 长按
                    if (longClick) {
                        if (this.isLongClick) {
                            let setTime = setTimeout(() => {
                                window.clearInterval(setTime)
                                this.isLongClick = false
                            }, 2 * 1000)
                            return
                        }
                        this.isLongClick = true
                        switch (type) {
                            case 3:
                                this.keypressBindEvent(4)
                                break
                            case 4:
                                this.keypressBindEvent(5)
                                break
                            default:
                                break
                        }
                    } else {
                        switch (type) {
                            case 3:
                                this.keypressBindEvent(1)
                                break
                            case 4:
                                this.keypressBindEvent(2)
                                break
                            default:
                                break
                        }
                    }
                } else {
                    switch (type) {
                        case 3:
                            this.keypressBindEvent(1)
                            break
                        case 4:
                            this.keypressBindEvent(2)
                            break
                        default:
                            break
                    }
                }
            }
        })
    },
    methods: {
        sendThirdMode(data) {
            if (this.settingInfo.combineMeasureEnable && this.settingInfo.triMode) {
                const isGirthEvalCombo = this.settingInfo.combineMeasureEnable && this.settingInfo.triMode ? 1 : 0
                const scanMode =
                    this.settingInfo.deviceMode === 1 ? (this.deviceInfo.healthPackageEnable === 2 ? 2 : 1) : 0
                sendMeasureMode({
                    scan_id: data.scanId,
                    is_girth_eval_combo: isGirthEvalCombo,
                    scan_mode: scanMode,
                    create_time: Math.floor(Date.now() / 1000)
                })

                // this.$statusClient
                // .createScanMeasureMode(data.scanId, isGirthEvalCombo, scanMode, Math.floor(Date.now() / 1000))
                // .then((res) => {
                //     window.logger.info('三合一测量上报成功', res)
                // })
            }
        },
        applyTheme() {
            const themeData = themes[this.themeName]
            // window.logger.log('Applying Theme:', this.themeName, themeData)
            this.changeTheme(themeData)
        },
        // 检查设备状态
        async checkDeviceState() {
            if (this.deviceInfo.deviceType === 5 && !this.deviceUsable.shape) {
                if (this.deviceErrors.length === 1 && this.deviceErrors[0].id === 8) {
                    // 转台掉线可以恢复
                    this.$changeViewPage('TurntableError')
                } else {
                    this.$changeViewPage('DeviceError')
                }
            }
        },
        //
        select(i18n) {
            const langMap = {
                zh: 'zh-CN',
                ja: 'ja-JP',
                en: 'en-US',
                es: 'es-ES',
                pt: 'pt-PT',
                de: 'de-DE',
                fr: 'fr-FR',
                tr: 'tr-TR',
                ru: 'ru-RU',
                el: 'el-GR',
                hu: 'hu-HU',
                zhcht: 'zh-TW'
            }
            return langMap[i18n] || langMap.en
        },
        // 定时提醒
        timeoutReminder() {
            const timerOut = setTimeout(() => {
                this.$store.commit('CHANGE_DEVICE_INFO', {
                    reminderStatus: true
                })
                window.clearTimeout(timerOut)
            }, CONFIG.IDLE_TIMEOUT * 1000 * 60 * 60)
        },
        // 切换颜色主题
        changeTheme(obj) {
            for (let key in obj) {
                document.getElementsByTagName('body')[0].style.setProperty(`--${key}`, obj[key])
            }
            if (this.deviceInfo.deviceType === 5 || this.deviceInfo.deviceType === 3) {
                if (this.deviceInfo.operationMode === 1) {
                    // 触
                    document.getElementsByTagName('body')[0].style.setProperty('--colorBackground', '#565656')
                } else {
                    document.getElementsByTagName('body')[0].style.setProperty('--colorClick', '#1D66E6')
                }
            }
        },
        // TODO
        test() {
            EventBus.$emit('EventAction', 'ButtonEvent', 1)
        },
        ...mapMutations(['METE_TITLE', 'CHANGE_UPLOAD_TASK_SUM', 'CHANGE_OPEN_SHUT_DOEN_VIEW']),
        // 定时获取设备续费状态
        scheduleRenewal() {
            window.logger.info('首次查询续费信息')
            if ([3, 5].includes(this.deviceInfo.deviceType)) {
                // 首次查询ai续费提醒
                this.updatedAiExp(this.deviceInfo.deviceId)
            } else {
                // 首次续费提醒
                this.updatedExp(this.deviceInfo.deviceId)
            }
            const second = Math.round(Math.random() * 10)
            window.logger.info('开启定时查询设备续费状态任务', `second: ${second}`)
            const Time = new Date()
            schedule.scheduleJob({ hour: 0, minute: 1, second }, () => {
                window.logger.info('定时查询设备续费状态: ' + Time.toLocaleString())
                if (this.deviceInfo.deviceId !== '') {
                    if ([3].includes(this.deviceInfo.deviceType)) {
                        this.updatedAiExp(this.deviceInfo.deviceId)
                    } else {
                        this.updatedExp(this.deviceInfo.deviceId)
                    }
                }
            })
        },
        // 自动取消关机
        onCloseShutDownView() {
            this.CHANGE_OPEN_SHUT_DOEN_VIEW(false)
            window.logger.info('关机弹框倒计时结束')
            if (!this.deviceInfo.isNetConnect) {
                window.logger.info('网络异常时跳转到网络异常常驻页面')
                this.$changeViewPage('NetworkAnomaly')
            }
        },
        // 不可关机提醒弹窗消失
        onCloseShutDownBox() {
            this.openShutDownBox = false
        },
        // 关机
        async isShutDown() {
            // 获取是否存在任务
            const { taskNum } = await this.$controlClient.taskNum()
            this.CHANGE_UPLOAD_TASK_SUM(taskNum)
            // if (!taskNum && this.openShutDownView) {
            //     this.$changeViewPage('DeviceSwitch', {
            //         type: 'off'
            //     })
            // }
            if (
                this.$route.name != 'Home' &&
                this.$route.name != 'DeviceError' &&
                this.$route.name != 'NetworkAnomaly' &&
                this.$route.name != 'CheckSelf' &&
                this.$route.name != 'SettingIndex' &&
                this.$route.name != 'AiRenewal' &&
                this.$route.name != 'TurntableError'
            ) {
                this.isChange = !this.isChange
                this.onAudioEvent('playAudio', 'shutDownInUse')
                this.openShutDownBox = true
            } else {
                this.CHANGE_OPEN_SHUT_DOEN_VIEW(true)
                window.logger.info('显示关机弹框')
            }
        },
        async updatedExp(deviceId) {
            const expInfo = await this.$statusClient.getDeviceExpire(deviceId)
            this.$store.commit('CHANGE_DEVICE_INFO', {
                renewalStatus: expInfo.status,
                expirationTime: moment(expInfo.expirationTime * 1000)
                    .add(7, 'd')
                    .format('YYYY-MM-DD')
                    // eslint-disable-next-line no-control-regex
                    .replace(/([^\u0000-\u00FF])/g, ' $1 ')
                    .trim()
            })
            EventBus.$emit('EventAction', 'ExpStatus', {})
        },
        async updatedAiExp(deviceId) {
            const expInfo = await this.$statusClient.getAIDeviceExpire(deviceId)
            this.$store.commit('CHANGE_DEVICE_INFO', {
                aiRenewalStatus: expInfo.status,
                aiExpirationTime: moment(expInfo.expirationTime * 1000)
                    .add(expInfo.status === 3 ? 0 : 7, 'd')
                    .format(this.$i18n.locale === 'zh' ? 'YYYY-MM-DD' : 'MM-DD-YYYY')
                    // eslint-disable-next-line no-control-regex
                    .replace(/([^\u0000-\u00FF])/g, ' $1 ')
                    .trim()
            })
            EventBus.$emit('EventAction', 'AiExpStatus', {})
        },
        clearPageInfo() {
            this.$store.commit('CHANGE_PAGE_INFO', {
                btnList: [],
                openNotOperated: false
            })
        },
        /**
         * 页面触发音频播放事件
         *
         * @param {string} event 事件名 playAudio/stopAudio
         * @param {number} audioName 音频文件名
         * @param {string} type 类型 1 音频 2 音效
         * @return {*}
         */
        onAudioEvent(event, audioName = '', type = 1) {
            window.logger.info('[layout]: 音频相关', event, audioName)
            if (event === 'playAudio') {
                // XXX: 播放延时，用来解决进入页面过快，play被pause截断
                clearTimeout(this.audioTimer)
                this.audioTimer = setTimeout(() => {
                    this.$refs.audio.onPlayEvent(audioName, type)
                }, 50)
            } else {
                clearTimeout(this.audioTimer)
                this.$refs.audio.onStopEvent()
            }
        },
        onAudioEnd(file) {
            if (this.$refs.currentView.audioEndCallback) {
                this.$refs.currentView.audioEndCallback(file)
            }
        },
        // 页面1分钟超时未操作
        handleNotOperated() {
            if (this.$refs.currentView.handleNotOperated) {
                this.$refs.currentView.handleNotOperated()
            }
        },
        // 监听物理按钮事件
        monitorKeyEvent() {
            // 按键事件
            // if (CONFIG.SENTRY.ENVIRONMENT !== 'development') {
            //     return
            // }
            document.onkeydown = (event) => {
                window.logger.info('monitorKeyEvent', e)
                // eslint-disable-next-line no-caller
                let e = event || window.event || arguments.callee.caller.arguments[0]
                if (!e) {
                    return
                }
                // 长按
                if (this.lastKey.code === e.keyCode) {
                    this.lastKey.isPress = true
                    switch (e.keyCode) {
                        // 长按返回 强制退出
                        case 8:
                            // backspace
                            // 返回
                            if (this.longKeypressTimer) {
                                return
                            }
                            this.longKeypressTimer = setTimeout(() => {
                                this.keypressBindEvent(9)
                                this.clearLongKeypress()
                                // 开关机（包含自检）、待机页面、设置页面、更新页面、鱼眼相机复位页、体成分、体态、体围、肩部测量过程不可执行强制退出操作
                                if (this.isBack) {
                                    this.$changeViewPage('Home')
                                }
                            }, 2000)
                            break
                        // case 13:
                        //     // enter
                        //     // 电源
                        //     this.isShutDown()
                        //     break
                        case 13:
                            // ↑
                            // +（left）
                            this.keypressBindEvent(4)
                            break
                        case 38:
                            // ↓
                            // -（right）
                            this.keypressBindEvent(5)
                            break
                        default:
                            break
                    }
                } else {
                    this.lastKey.isPress = false
                    this.clearLongKeypress()
                }
                this.lastKey.code = e.keyCode
            }

            document.onkeyup = (event) => {
                window.logger.info('monitorKeyEvent, onkeyup', event.key, event.keyCode)
                // eslint-disable-next-line no-caller
                let e = event || window.event || arguments.callee.caller.arguments[0]
                if (!e) {
                    return
                }
                // events.emit('playAudio', 53, 2)
                this.clearLongKeypress()
                if (!this.lastKey.isPress) {
                    switch (e.keyCode) {
                        // case 13:
                        //     // enter
                        //     // d电源
                        //     this.keypressBindEvent(3)
                        //     break
                        case 13:
                            // ↑
                            // +（left）
                            this.keypressBindEvent(1)
                            break
                        case 38:
                            // ↓
                            // -（right）
                            this.keypressBindEvent(2)
                            break
                        default:
                            break
                    }
                }
                window.logger.info('按下按键', e.keyCode)
                this.lastKey = { code: -1, isPress: false }
            }
        },
        // 按键双击事件
        keyDoubleEvent(type, cb) {
            if (type === 3) {
                // 双击
                if (this.btnUpTime && new Date().getTime() - this.btnUpTime < this.doubleClickTime) {
                    clearTimeout(this.btnUpTimer)
                    this.btnUpTime = 0
                    cb(7)
                } else {
                    this.btnUpTime = new Date().getTime()
                    this.btnUpTimer = setTimeout(() => {
                        this.btnUpTime = 0
                        cb(type)
                    }, this.doubleClickTime)
                }
            } else {
                this.btnUpTime = 0
                cb(type)
            }
        },
        // 按键事件绑定
        keypressBindEvent(type) {
            // const keycodePatten = {
            //     1: '上',
            //     2: '下',
            //     3: '确定',
            //     4: '返回',
            //     5: '打印',
            //     6: '设置',
            //     7: '长按上',
            //     8: '长按下',
            //     9: '长按返回'
            // }
            const keycodePatten = {
                1: '加',
                2: '减',
                3: '电源',
                4: '长按加',
                5: '长按减',
                6: '长按电源',
                7: '双击电源'
            }
            this.keyDoubleEvent(type, (t) => {
                window.logger.info(`按下按键: ${keycodePatten[t]}`)
                // 不在待机页按下按键时显示按键组件
                if (this.$route.name !== 'Home' && !this.pageInfo.display) {
                    this.$store.commit('CHANGE_PAGE_INFO', {
                        display: true
                    })
                }
                if (this.$refs.currentView.btnClick && !this.openShutDownView) {
                    this.$refs.currentView.btnClick(t)
                }
                if (this.openShutDownView) {
                    this.$refs.shutdown.btnClick(t)
                }
                if (this.showBtn) {
                    this.$refs.btn.btnClick(t)
                }
                // shutdown 返回事件 只支持在设置页和报告列表页
                if (t === 7) {
                    const isBackPre = this.$route.meta.nav ? this.$route.meta.nav.isBackPre : false
                    window.logger.info(
                        `是否可离开当前页面: ${this.$route.query.isLeave} ${isBackPre} ${this.$route.query.standUp}`
                    )
                    if (isBackPre && this.$route.query.isLeave !== false) {
                        if (this.$route.query.standUp && this.$route.name != 'ButtonSelect') {
                            router.go(-2)
                        } else {
                            // 在按钮进入当前页面点击动态实验室进入 返回上一页处理是否可离开当前页面
                            if (this.$route.name === 'ButtonSelect') {
                                if (this.meteTitle.leave) {
                                    router.go(-1)
                                } else {
                                    this.METE_TITLE(this.meteTitle)
                                }
                            } else {
                                router.go(-1)
                            }
                        }
                    }
                }
            })
        },
        // 清空重置长按计时
        clearLongKeypress() {
            clearTimeout(this.longKeypressTimer)
            this.longKeypressTimer = null
        },
        networkStatus() {
            window.addEventListener('online', () => {
                // EventBus.$emit('EventAction', 'netWorktStatus', { online: true })
                // 网络恢复后重连状态通知服务
                // this.$statusClient.reconnect()
                window.logger.info('监听到网络已连接，准备重连服务')
                if (SocketService.Instance.url === '' || SocketService.Instance.url === undefined) {
                    SocketService.Instance.url = `ws://${CONFIG.SERVICE.STATUS_HTTP_ADDR}/ws?device_id=${this.deviceInfo.deviceId}`
                }
                SocketService.Instance.reconnectWebSocket()
            })
            window.addEventListener('offline', () => {
                this.$store.commit('CHANGE_DEVICE_INFO', {
                    isNetConnect: false
                })
                EventBus.$emit('EventAction', 'netWorktStatus', { online: false })
            })
            // 第一次开机时手动查一次网络状态
            this.$store.commit('CHANGE_DEVICE_INFO', {
                isNetConnect: navigator.onLine
            })
        },
        // 触屏不可用提示
        touchDisabled() {
            if (this.touchConnected) return
            this.openShutDownBox = true
        },
        goBack() {
            window.logger.info('goBack')
            this.keypressBindEvent(7)
            this.clearLongKeypress()
        }
    },
    beforeDestroy() {
        document.onkeydown = null
        document.onkeyup = null

        // 清除网络状态监听
        window.removeEventListener('online')
        window.removeEventListener('offline')

        // 清除EventBus监听
        EventBus.$off('EventAction')
        EventBus.$off('GenScanId')
        EventBus.$off('ShutDownAction')

        // 清除定时器
        if (this.longKeypressTimer) {
            clearTimeout(this.longKeypressTimer)
            this.longKeypressTimer = null
        }

        window.logger.info('转盘，按键，算法等服务已关闭')
    }
}
</script>

<style lang="less" scoped>
#layout {
    height: 100%;

    .img-style {
        width: 266px;
    }
}
</style>
<style>
.msg-box-main p {
    margin: 0 40px !important;
}
html,
body {
    cursor: none !important;
}
</style>
