<!--
 * @Description: 设备端查看报告页面
 * @Author: yangsheng
 * @Date: 2025-10-08 11:15:44
 * @LastEditors: liutq
 * @LastEditTime: 2026-01-10 01:25:00
-->
<template>
    <div class="view-report-box">
        <div v-if="isNewUser" class="content">
            <div class="operation-buttons">
                <div class="left" @touchend="goBackHome">
                    <img src="@img/view_report/arrow-left-line.svg" alt="" />
                    <p>首页</p>
                </div>
            </div>
            <div class="title">获取测量报告</div>
            <div :class="['result-content', $i18n.locale]">
                <div class="result-item">
                    <img src="@img/scan_result/result_suc.png" class="result-suc" alt />
                    <p class="animated fast fadeInUp">扫码成功</p>
                </div>
            </div>
            <div class="bottom-msg">
                <transition name="fade-move" mode="out-in" appear>
                    <msg-card key="printed">
                        <ul slot="info-content">
                            <!-- 未注册提醒 -->
                            <template>
                                <li>{{ $t('scan-result.result.msg-card.new-user') }}</li>
                            </template>
                        </ul>
                    </msg-card>
                </transition>
            </div>
        </div>
        <div v-else class="view-report">
            <div class="operation-buttons">
                <div class="left" @touchend="goBack">
                    <img :src="require(`@img/view_report/${initIcon}.svg`)" alt="" />
                    <p>{{ backText }}</p>
                </div>
                <div class="marker">
                    <img v-if="!visible" src="@img/view_report/icon_marker.svg" alt="" @touchend="visible = true" />
                    <template v-else>
                        <img
                            :src="require(`@img/view_report/${tool === 'pen' ? 'icon_pen_on.svg' : 'icon_pen.svg'}`)"
                            alt=""
                            @touchend="setTool('pen')"
                        />
                        <img
                            :src="
                                require(`@img/view_report/${
                                    tool === 'eraser' ? 'icon_eraser_on.svg' : 'icon_eraser.svg'
                                }`)
                            "
                            alt=""
                            @touchend="setTool('eraser')"
                        />
                        <img src="@img/view_report/icon_exit.svg" alt="" @touchend="exit" />
                    </template>
                </div>
            </div>
            <div class="report-iframe">
                <iframe
                    ref="reportView"
                    :src="iframeSrc"
                    @load="onIframeLoad"
                    frameborder="0"
                    class="iframe-content"
                    scrolling="auto"
                    name="myframe"
                ></iframe>
            </div>
            <div v-show="visible" class="doodle-overlay">
                <canvas ref="canvasEl"></canvas>
            </div>
            <msg-box v-model="openMsgBox" :is-auto-close="false" title="确认取消?">
                <div slot="content" class="reprint-content">
                    <p class="tip">取消后将不在设备端展示对应报告，扫码的设备上仍可查看相关报告</p>
                    <div class="operation">
                        <div :class="{ 'box-btn': true, active: true }" @touchstart="goHome">确定</div>
                        <div :class="{ 'box-btn': true, active: false }" @touchstart="openMsgBox = false">取消</div>
                    </div>
                </div>
            </msg-box>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getReportUrl } from '@/http/status-server-api'
import { fabric } from 'fabric-with-erasing'
import MsgBox from '@/components/MsgBox.vue'
import MsgCard from '@/components/MsgCard.vue'
import { EventBus } from '@/util/event-bus'
export default {
    components: {
        MsgBox,
        MsgCard
    },
    data() {
        return {
            initIcon: 'icon_cancel',
            visible: false,
            canvas: null,
            color: '#FF0000',
            size: 5,
            tool: 'pen',
            history: [],
            redoStack: [],
            drawingLine: null,
            isPointerMode: false,
            isAddingText: false,
            openMsgBox: false,
            backText: '取消查看',
            isNewUser: false,
            pollingTimer: null,
            redirectTimer: null, // 保存定时器引用
            redirectDelay: 5 * 60 * 1000, // 5分钟
            newUserStatus: false,
            iframeSrc:
                'http://192.168.0.28:8082/deviceAuth/deviceCallBack?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtSWQiOjExNjcsInNjYW5JZCI6Ik4yQzAxMjM0NTY3ODkxMDgtN2VhNWI1ODctYThjZS00ZTA2LWJiMjMtNGY1NzJlMmE1OTA0IiwiZGV2aWNlSWQiOiJOMkMwMTIzNDU2Nzg5MTA4IiwiZGV2aWNlVHlwZSI6MSwiaWF0IjoxNzY3Nzg4ODY5fQ.lLBawTIDxMzeE7V3Tj7uwDIOymlWTG4ELXvvDKbL1aw&device_id=N2C0123456789108&newUser=true'
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.$nextTick(() => this.initCanvas())
            } else {
                this.dispose()
            }
        }
    },
    computed: {
        ...mapGetters({
            qrcode: 'qrcode',
            measureInfo: 'measureInfo',
            deviceInfo: 'deviceInfo',
            standPeople: 'standPeople',
            external: 'external',
            settingInfo: 'settingInfo',
            scanQueue: 'scanQueue',
            sucItemNum: 'sucItemNum'
        })
    },
    created() {
        this.getReportUrl()
        this.initCanvas()
    },
    mounted() {
        EventBus.$on('EventAction', (type, data) => {
            if (type === 'NotifyTaskStatus') {
                // 本次测量结果
                if (data.scanInfo.scanId === this.measureInfo.scanId && data.streamType === 1) {
                    this.isNewOne = data.scanInfo.id !== '' ? false : true
                    // 根据手机号判断是否为新用户
                    const userInfo = {
                        isNewUser: this.isNewOne,
                        phoneNum: data.scanInfo.id
                    }
                    this.$store.commit('CHANGE_MEASURE_INFO', {
                        userInfo
                    })
                }
            }
        })
        if (this.visible) {
            this.initCanvas()
        }
        this.startRedirectTimer()
    },
    beforeUnmount() {
        // 组件销毁前清理定时器，防止内存泄漏
        if (this.redirectTimer) {
            clearTimeout(this.redirectTimer)
            this.redirectTimer = null
        }
        if (this.pollingTimer) {
            clearTimeout(this.pollingTimer)
            this.pollingTimer = null
        }
    },
    beforeDestroy() {
        EventBus.$off('EventAction')
    },
    methods: {
        startRedirectTimer() {
            // 先清理已有定时器，避免重复设置
            this.clearRedirectTimer()

            this.redirectTimer = setTimeout(() => {
                window.logger.info('5分钟到期返回首页')
                this.goBackHome()
            }, this.redirectDelay)
        },
        clearRedirectTimer() {
            if (this.redirectTimer) {
                window.logger.info('清空定时器redirectTimer')
                clearTimeout(this.redirectTimer)
                this.redirectTimer = null
            }
        },
        goBackHome() {
            this.$store.commit('PUSH_REPORT_LIST', true)
            this.$changeViewPage('Home')
        },
        initCanvas() {
            if (this.canvas) return
            const el = this.$refs.canvasEl
            if (!el) return
            const width = document.documentElement.clientWidth
            const height = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.documentElement.clientHeight
            )
            el.width = width
            el.height = height
            this.canvas = new fabric.Canvas(el, { isDrawingMode: true })
            this.canvas.setDimensions({ width, height })
            this.canvas.freeDrawingBrush.color = this.color
            this.canvas.freeDrawingBrush.width = this.size
            this.setTool('pen')
            this.bindEvents()
            this.pushHistory()
        },
        dispose() {
            if (!this.canvas) return
            this.canvas.dispose()
            this.canvas = null
            this.history = []
            this.redoStack = []
            this.drawingLine = null
            this.isPointerMode = false
            this.isAddingText = false
        },
        bindEvents() {
            if (!this.canvas) return
            this.canvas.on('mouse:down', (opt) => {
                if (!this.canvas) return
                if (this.tool === 'text') {
                    const pointer = this.canvas.getPointer(opt.e)
                    const fontSize = 2 * parseInt(this.size)
                    const itext = new fabric.IText('', {
                        fontFamily: 'arial',
                        fontSize,
                        fill: this.color,
                        left: pointer.x,
                        top: pointer.y - fontSize / 2
                    })
                    this.canvas.add(itext).setActiveObject(itext)
                    itext.enterEditing()
                    this.isAddingText = true
                } else if (this.tool === 'line') {
                    const pointer = this.canvas.getPointer(opt.e)
                    const line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
                        strokeWidth: parseInt(this.size),
                        fill: this.color,
                        stroke: this.color,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        hoverCursor: 'normal'
                    })
                    this.drawingLine = line
                    this.canvas.add(line)
                }
            })
            this.canvas.on('mouse:move', (opt) => {
                if (this.tool === 'line' && this.drawingLine) {
                    const pointer = this.canvas.getPointer(opt.e)
                    this.drawingLine.set({ x2: pointer.x, y2: pointer.y })
                    this.canvas.renderAll()
                }
            })
            this.canvas.on('mouse:up', () => {
                if (!this.canvas) return
                if (this.tool !== 'move' && this.tool !== 'pointer') {
                    this.pushHistory()
                }
                this.drawingLine = null
            })
            this.canvas.on('object:modified', () => this.pushHistory())
            this.canvas.on('text:editing:exited', () => {
                this.isAddingText = false
                this.useMove()
            })
        },
        pushHistory() {
            if (!this.canvas) return
            const json = JSON.stringify(this.canvas)
            this.history.push(json)
            this.redoStack = []
        },
        usePen() {
            if (!this.canvas) return
            this.canvas.isDrawingMode = true
            this.canvas.selection = true
            this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)
            this.canvas.freeDrawingBrush.color = this.color
            this.canvas.freeDrawingBrush.width = parseInt(this.size) || 5
            this.disableSelectOnObjects(false)
        },
        useEraser() {
            if (!this.canvas) return
            if (fabric.EraserBrush) {
                this.canvas.isDrawingMode = true
                this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas)
                this.canvas.freeDrawingBrush.width = 60
            } else {
                console.log('不支持橡皮擦功能')
            }
            this.disableSelectOnObjects(false)
        },
        useMove() {
            if (!this.canvas) return
            this.canvas.isDrawingMode = false
            this.canvas.selection = true
            this.disableSelectOnObjects(false)
        },
        setTool(name) {
            this.tool = name
            switch (name) {
                case 'pen':
                    this.usePen()
                    break
                case 'eraser':
                    this.useEraser()
                    break
                default:
                    this.usePen()
            }
        },
        exit() {
            // this.dispose()
            this.visible = false
        },
        goBack() {
            console.log('goBack')
            // 返回首页
            // this.$changeViewPage('Home')
            const iframe = this.$refs.reportView
            window.logger.info('iframeUrl', iframe.contentWindow.location.href)
            console.log('contentWindow pathname', iframe.contentWindow.location.pathname)
            // 未加载完是不允许跳转
            if (
                ['/appAuth/menuCallBack', '/deviceAuth/deviceCallBack'].includes(iframe.contentWindow.location.pathname)
            )
                return
            // 确保 iframe 已加载
            if (
                iframe.contentWindow &&
                iframe.contentWindow.history &&
                !['/modeling', '/report', '/main', '/exception/login', '', '/FatherAndMotherHeight'].includes(
                    iframe.contentWindow.location.pathname
                )
            ) {
                console.log(iframe.contentWindow, 8888, iframe.contentWindow.history.length)
                const modelInfo = JSON.parse(iframe.contentWindow.localStorage.getItem('modelInfo') || '{}')
                if (
                    iframe.contentWindow.location.pathname === '/new-report' &&
                    (modelInfo.evalStatus !== 1 ||
                        iframe.contentWindow.localStorage.getItem('healthPackageEnable') === '2')
                ) {
                    this.openMsgBox = true
                } else {
                    iframe.contentWindow.history.back()
                    // if (iframe.contentWindow.location.pathname === '/new-report')
                    // if (iframe.contentWindow.location.pathname === '/footDetail') {
                    //     iframe.contentWindow.history.go(-2)
                    // } else {
                    //     iframe.contentWindow.history.back()
                    // }
                    // iframe.contentWindow.history.go(-2)
                    // iframe.contentWindow.history.back()
                    return
                }
                //
            } else if (iframe.contentWindow.location.pathname === '/main') {
                const modelInfo = JSON.parse(iframe.contentWindow.localStorage.getItem('modelInfo') || '{}')
                window.logger.info('检查报告状态', modelInfo)
                if (modelInfo.biaStatus === 4 && modelInfo.evalStatus === 4 && modelInfo.bsShoulderScanResult === 1) {
                    this.openMsgBox = true
                } else {
                    iframe.contentWindow.history.back()
                }
            } else {
                this.openMsgBox = true
            }
        },
        onIframeLoad() {
            let that = this
            const iframe = this.$refs.reportView
            window.logger.info('iframe加载完成', iframe.contentWindow.location.href)
            const doc = iframe.contentWindow.document
            const style = doc.createElement('style')
            style.textContent = '::-webkit-scrollbar { display: none; }'
            doc.head.appendChild(style)

            // 获取iframe的窗口对象
            const iframeWindow = iframe.contentWindow

            // 备份原始的pushState方法
            const originalPushState = iframeWindow.history.pushState

            // 在 iframe 中设置历史记录监听
            iframeWindow.addEventListener('popstate', () => {
                console.log('iframe popstate 触发:', iframe.contentWindow.location.pathname)
                const modelInfo = JSON.parse(iframe.contentWindow.localStorage.getItem('modelInfo') || '{}')
                if (
                    ['/report', '/FatherAndMotherHeight'].includes(iframe.contentWindow.location.pathname) ||
                    (iframe.contentWindow.location.pathname === '/new-report' &&
                        (modelInfo.evalStatus !== 1 ||
                            iframe.contentWindow.localStorage.getItem('healthPackageEnable') === '2'))
                ) {
                    // 执行与特定URL相关的操作
                    that.backText = '取消查看'
                    that.initIcon = 'icon_cancel'
                    console.log('匹配到特定URL，执行相关操作')
                }
            })

            // 覆盖pushState方法，以监听URL的变化
            iframeWindow.history.pushState = function (...args) {
                // 调用原始的pushState方法，并传递所有参数
                originalPushState.apply(iframeWindow.history, args)
                // 打印pushState操作的参数和状态变化
                console.log('iframe pushState: ', args, args[2])
                // 检查特定的URL，如果有匹配，则执行相关操作
                const modelInfo = JSON.parse(iframe.contentWindow.localStorage.getItem('modelInfo') || '{}')
                if (['/main', '/girth/trend', '/body/trend', '/new-report'].includes(args[2])) {
                    if (
                        iframe.contentWindow.location.pathname === '/new-report' &&
                        (modelInfo.evalStatus !== 1 ||
                            iframe.contentWindow.localStorage.getItem('healthPackageEnable') === '2')
                    ) {
                        return
                    }
                    // 执行与特定URL相关的操作
                    that.initIcon = 'arrow-left-line'
                    that.backText = '返回'
                    console.log('匹配到特定URL，执行相关操作')
                }
            }
        },
        async getReportUrl() {
            const res = await getReportUrl({
                scan_id: this.measureInfo.scanId,
                device_id: this.deviceInfo.deviceId
            })
            window.logger.info('报告url信息', res)
            if (res.code === 0) {
                const data = res.data
                if (data.is_new_user) {
                    this.isNewUser = true
                    this.newUserStatus = true
                    if (this.pollingTimer) {
                        clearTimeout(this.pollingTimer)
                        this.pollingTimer = null
                    }
                    this.pollingTimer = setTimeout(() => {
                        this.getReportUrl()
                    }, 10000)
                } else {
                    this.clearRedirectTimer()
                    // 清除轮询
                    if (this.pollingTimer) {
                        clearTimeout(this.pollingTimer)
                        this.pollingTimer = null
                    }
                    let appUrl = data.app_url
                    if (this.newUserStatus) {
                        appUrl = appUrl + '&newUser=true'
                    }
                    this.iframeSrc = appUrl
                    this.isNewUser = false
                    this.initCanvas()
                }
            }
        },
        goHome() {
            this.$store.commit('PUSH_REPORT_LIST', true)
            this.$changeViewPage('Home')
        }
    }
}
</script>
<style lang="less" scoped>
.view-report-box {
    width: 100%;
    height: 100%;
}
.view-report {
    position: relative;
    width: 100%;
    height: 100%;
    .operation-buttons {
        height: 96px;
        margin-top: 120px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 54px;
        .left {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: @color-nav-back;

            img {
                width: 48px;
                margin-right: 8px;
            }

            p {
                margin: 0;
                font-size: 32px;
            }
        }
        .marker {
            z-index: 9999;
            img {
                width: 48px;
                margin-left: 40px;
            }
        }
    }
    .report-iframe {
        position: relative;
        height: 100%;
        // background: #ffffff;
        -webkit-flex: 1;
        -ms-flex: 1;
        -webkit-box-flex: 1;
        -moz-box-flex: 1;
        flex: 1;
        // overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        .iframe-content {
            width: 100%;
            height: calc(100% - 216px);
            background-color: #000000;
            text-align: center;
            -webkit-overflow-scrolling: touch;
            // border: none;
            // display: block;
            &::-webkit-scrollbar {
                display: none; /* Chrome, Safari and Opera */
            }
        }
    }
    // 重新打印弹窗
    .reprint-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #e7e9f0;
        .box-tip {
            display: inline-block;
            padding: 0 24px 0 16px;
            background: #666666;
            border-radius: 12px;
            font-size: 32px;
            font-family: OPPOSansR;
            line-height: 48px;
            color: #e7e9f0;
        }
        .tip {
            padding: 48px 25px 112px;
            font-size: 40px;
            font-family: OPPOSansR;
            color: #e7e9f0;
            line-height: 53px;
            text-align: center;
        }
        .operation {
            display: flex;
            justify-content: space-evenly;
            width: 100%;
            padding: 0 64px;
            .box-btn {
                width: 384px;
                height: 132px;
                background: #333333;
                border-radius: 12px;
                border: 2px solid @color-light-blue;
                box-sizing: border-box;
                font-size: 40px;
                font-family: OPPOSansR;
                line-height: 132px;
                color: @color-light-blue;
            }
            .active {
                background: @color-blue;
                color: #ffffff;
                border: none;
            }
        }
    }
}
.doodle-overlay {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9998;
    pointer-events: auto;
}
.doodle-overlay canvas {
    position: absolute;
    left: 0;
    top: 0;
}
.content {
    .title {
        margin-top: 87px;
        font-size: 48px;
        font-family: OPPOSansR;
        font-weight: normal;
        color: rgba(255, 255, 255, 1);
        line-height: 72px;
        text-align: center;
    }
    .operation-buttons {
        height: 96px;
        margin-top: 120px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 54px;
        .left {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: @color-nav-back;

            img {
                width: 48px;
                margin-right: 8px;
            }

            p {
                margin: 0;
                font-size: 32px;
            }
        }
        .marker {
            z-index: 9999;
            img {
                width: 48px;
                margin-left: 40px;
            }
        }
    }
    .result-content {
        position: relative;
        margin: 150px auto 0;
        width: 100%;

        .result-item {
            display: flex;
            flex-direction: column;
            align-items: center;

            img {
                width: 290px;
                height: 290px;
            }

            .result-suc {
                margin-top: 150px;
            }

            p {
                font-size: 48px;
                font-family: OPPOSansR;
                font-weight: normal;
                color: rgba(255, 255, 255, 1);
                line-height: 72px;
                margin: 96px auto 0;

                img {
                    width: 40px;
                    height: 40px;
                }

                &.result-msg {
                    font-size: 36px;
                    font-family: OPPOSansR;
                    font-weight: normal;
                    color: #ced7e0;
                    line-height: 48px;
                    margin: 24px auto 0;
                }
            }
        }
    }
    .bottom-msg {
        position: absolute;
        bottom: 160px;
        width: 100%;

        li {
            max-width: 720px;
            margin-right: 50px;
        }

        .model-title {
            text-align: center;
            margin-bottom: 50px;
            margin-top: 0;
            font-size: 64px;
        }

        .info-content {
            font-size: 36px;
            font-family: OPPOSansR;
            font-weight: normal;
            color: rgba(206, 215, 224, 1);
            line-height: 54px;
            text-align: center;
            margin: 0;

            i {
                font-size: 42px;
            }
        }

        .msg-duration {
            margin-bottom: 0;
        }
    }
}
</style>
