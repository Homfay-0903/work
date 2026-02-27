<!--
 * @Description: 体围测量过程页
 * @Author: gaoyuanyuan
 * @Date: 2021-04-28 11:32:21
 * @LastEditors: liutq
 * @LastEditTime: 2026-01-06 23:37:53
-->
<template>
    <div class="scan">
        <!-- <button @click="isShutDown" style="position: absolute; z-index: 1000">APOSI检测</button> -->
        <transition-group name="fade" mode="in-out" appear>
            <!-- 测量过程 -->
            <div key="scanPage" v-if="!fail" class="scan-page">
                <transition-group name="fade" mode="in-out" appear>
                    <!-- 倒计时 -->
                    <div key="cutdown" v-if="step === 0" class="cut-down">{{ countdown }}</div>
                    <!-- 测量中 & 等待测量结果 -->
                    <div key="scanning" v-else-if="step === 1 || step === 2" class="scanning">
                        <!-- <video
                            src="media-file://video/girth/aposeScanning.mp4"
                            class="apose-scanning"
                            name="apose引导动画"
                            preload="auto"
                            autoplay
                            loop
                            width="100%"
                        >
                            您的浏览器不支持 video 标签。
                        </video> -->
                        <!-- <img width="100%" class="scanning-img" src="@/assets/img/shape/Scanning@2x.png" alt="" /> -->
                        <div class="scanning-img" v-if="lineStatus"></div>
                        <img class="ipose-scanning-bg" width="100%" src="@/assets/img/girth/apose_bg.png" alt="" />
                        <img
                            class="ipose-scanning-model"
                            width="100%"
                            :src="require(`@/assets/img/girth/apose_model${deviceInfo.teenagerIsOpen ? '_t' : ''}.png`)"
                            alt=""
                        />
                        <img
                            class="ipose-scanning-ring"
                            width="100%"
                            src="@/assets/img/girth/apose_model_ring.png"
                            alt=""
                        />
                    </div>
                </transition-group>
                <!-- 底部提醒 -->
                <div class="bottom-msg">
                    <transition name="fade-move" mode="out-in" appear>
                        <msg-card class="tip">
                            <ul slot="info-content">
                                <li v-if="step === 0">{{ $t('shape.scan.bottom-msg1') }}</li>
                                <li v-else-if="step === 1">{{ $t('shape.scan.bottom-msg2') }}</li>
                                <li v-else-if="step === 2">{{ $t('shape.scan.bottom-msg3') }}</li>
                            </ul>
                        </msg-card>
                    </transition>
                </div>
            </div>
            <!-- 测量失败 -->
            <div key="errorPage" v-else class="error-page">
                <div v-if="leaveReset" class="people-leave">
                    <img src="@img/people_leave_fail.svg" class="leave-icon" alt="人离开" />
                    <div class="tip-card">
                        <h3>
                            <img src="@img/tips.svg" alt="警告图标" /><span>{{ $t('shape.scan.leaveReset1') }}</span>
                        </h3>
                        <p>{{ $t('shape.scan.leaveReset2') }}</p>
                    </div>
                </div>
                <shape-error-card
                    key="scanErr"
                    ref="shapeErrorCard"
                    v-else
                    :scanType="1"
                    :errType="errType"
                    :shapeErrors="shapeErrors"
                    :selectMode="gestureUsable ? 1 : 0"
                    @scan-error-rescan="handleScanErrRescan"
                    @player-audio="playerAudio"
                ></shape-error-card>
            </div>
        </transition-group>
    </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { algError, shapeFault } from '@/config/error-reason'
import MsgCard from '@/components/MsgCard.vue'
import ShapeErrorCard from '../shape/components/ErrorCard.vue'
import { EventBus } from '@/util/event-bus'
import * as types from '@/store/mutation-types'
import router from '@/router'
export default {
    name: 'GirthScan',
    // beforeRouteEnter(to, from, next) {
    // next((vm) => {
    //     if (to.query?.typeSort) {
    //         const type = to.query?.typeSort
    //         if (type == 3) {
    //             to.meta.nav.prev = 'navigation-bar.wu-dian-liu'
    //         } else if (type == 1) {
    //             to.meta.nav.prev =
    //                 vm.settingInfo?.combineMeasureEnable && vm.settingInfo.triMode
    //                     ? '身体评估'
    //                     : 'item-select.shen-ti-cheng-fen-ce-liang-wei-du'
    //         }
    //     }
    // })
    // },
    components: {
        MsgCard,
        ShapeErrorCard
    },
    data() {
        return {
            // 0 倒计时 1 测量中 2 等待测量结果(转台停止)
            step: 0,
            // 启动3秒倒计时
            countdown: 0,
            // 是否测量失败
            error: false,
            // 是否测量成功
            success: false,
            // 人离开转台复位
            leaveReset: false,
            // 启动倒计时计时器
            cutdownTimer: null,
            // 测量超时
            timeout: false,
            // 测量超时定时器
            timeoutTimer: null,
            // 体态异常
            shapeErrors: [],
            // 引导语音是否已重复播放
            isRepeatPlay: false,
            // 测量失败类型 用于失败组件 1 不可重测 2 可重测
            errType: 1,
            lineStatus: false
        }
    },
    computed: {
        ...mapGetters(['measureInfo', 'settingInfo', 'deviceUsable', 'deviceErrors', 'deviceInfo']),
        // 手势是否可用
        gestureUsable() {
            // 按键启动的后续选择全部使用按键
            return this.settingInfo.gestureState === 1 && this.deviceUsable.gesture
        },
        // 失败
        fail() {
            return this.timeout || this.error || this.leaveReset
        }
    },
    watch: {
        shapeErrors: {
            handler(val) {
                if (val.length !== 0) {
                    this.errType = val[0].canRescan ? 2 : 1
                } else {
                    this.errType = 1
                }
            },
            deep: true
        }
    },
    created() {
        this.setMeteTitle(this.$route.query?.typeSort)
        this.initStep()
        this.$store.commit('CHANGE_MEASURE_INFO', {
            girth: { isMeasurement: true }
        }),
            this.removeItems()
    },
    mounted() {
        EventBus.$on('EventAction', (type, data) => {
            // pose检测和异常上报
            if (type === 'ScanError') {
                this.scanErrorHandler(data.errorStatus)
            } else if (type === 'SurveyorStatus') {
                if (data !== 1) this.scanErrorHandler(data)
            } else if (type === 'ScanResult') {
                this.scanResultHandler(data)
            } else if (type === 'StartTable') {
                this.$hardwareClient.tableRun()
            } else if (type === 'TableStop') {
                this.tableStopHandler(data)
            } else if (type === 'HardwareStatusEvent') {
                this.hardwareStatusHandler(data)
            }
        })
    },
    beforeDestroy() {
        EventBus.$off('EventAction')
        this.handleClearAllTimer()
    },
    methods: {
        ...mapActions(['changeMeasureInfo']),
        ...mapMutations([types.METE_TITLE]),
        setMeteTitle(type) {
            // 条件判断：是否需要删除 icon
            const conditionMet = this.$route.meta.nav && this.$route.meta.nav.icon && type

            // 构建基础参数
            const baseProps = {
                prev: 'navigation-bar.ti-wei-ce-liang',
                title:
                    this.settingInfo.combineMeasureEnable && this.settingInfo.triMode && [1, '1'].includes(type)
                        ? '体态体围测量'
                        : 'navigation-bar.ti-wei-ce-liang',
                align: '',
                icon: undefined,
                isBackPre: false
            }

            // 根据条件决定是否包含 icon 属性
            const conditionalProps = conditionMet
                ? { icon: undefined } // 条件满足时，不添加 icon（实现删除效果）
                : {} // 条件不满足时，添加 icon

            // 根据 type 设置不同的 prev 值
            if ([3, '3'].includes(type)) {
                baseProps.prev = 'navigation-bar.wu-dian-liu'
            } else if ([1, '1'].includes(type)) {
                baseProps.prev =
                    this.settingInfo.combineMeasureEnable && this.settingInfo.triMode
                        ? '身体评估'
                        : 'item-select.shen-ti-cheng-fen-ce-liang-wei-du'
            }

            const meteTitleParams = { ...baseProps, ...conditionalProps }

            this.METE_TITLE(meteTitleParams)
        },
        removeItems() {
            const unScanItems = this.measureInfo.unScanItems.filter((item) => item !== 3)
            this.changeMeasureInfo({
                active: 3,
                unScanItems
            })
        },
        isShutDown() {
            EventBus.$emit('EventAction', 'SurveyorStatus', 3)
            // EventBus.$emit('EventAction', 'ScanError', { errorStatus: 1 })
            // this.onDeviceError(1)
            // this.$store.commit('ADD_DEVICE_ERROR', 8)
        },
        // 初始化
        initStep() {
            this.handleClearAllTimer()
            this.step = 0
            this.countdown = 3
            this.error = false
            this.success = false
            this.timeout = false
            this.leaveReset = false
            this.isRepeatPlay = false
            this.shapeErrors = []
            this.handleStartCutDown()
            this.lineStatus = false
        },
        // 启动倒计时
        handleStartCutDown() {
            // 播放倒计时语音语音
            this.$emit('on-audio-event', 'playAudio', 'shapeCountDown')
            this.cutdownTimer = setInterval(() => {
                this.countdown--
                // 转台异常
                const tableErrors = this.deviceErrors.filter((err) => {
                    return ['0011', '0012'].indexOf(err.title) > -1
                })
                if (this.countdown === 1) {
                    // 没有转台异常则发起检测
                    if (tableErrors.length === 0) {
                        const setTimer = setTimeout(() => {
                            // 发起体态测量请求
                            this.$algClient.startScan(this.measureInfo.scanId, 1)
                            clearTimeout(setTimer)
                        }, 1 * 1000)
                        clearTimeout(this.timeoutTimer)
                        // 测量超时定时器
                        this.timeoutTimer = setTimeout(() => {
                            window.logger.info('体围测量超时，主动关闭算法')
                            this.timeout = true
                            // 取消扫描任务
                            this.$algClient.cancelScan()
                            if (!tableErrors) {
                                // 测量超时
                                const error = shapeFault.find((err) => {
                                    return err.id === 3
                                })
                                this.shapeErrors.push(error)
                            } else {
                                window.logger.info('测量超时, 关闭人离开页面')
                                this.leaveReset = false
                            }
                        }, 60 * 1000)
                    }
                } else if (this.countdown === 0) {
                    clearInterval(this.cutdownTimer)
                    if (tableErrors.length === 0) {
                        this.step = 1
                        this.countdown = 3
                        // 体围测量中语音
                        if (this.shapeErrors.length < 1) {
                            let audioName = 'girthScanningTip'
                            if (
                                this.settingInfo.combineMeasureEnable &&
                                this.settingInfo.triMode &&
                                this.$route.query?.typeSort === 1
                            ) {
                                audioName = 'girthScanningTipSum'
                            }
                            this.$emit('on-audio-event', 'playAudio', audioName)
                            setTimeout(() => {
                                return (this.lineStatus = true)
                            }, 1 * 1000)
                        }
                    } else {
                        this.shapeErrors.push(tableErrors[0])
                        this.error = true
                    }
                }
                // 体围倒计时做延迟处理
            }, 1300)
        },
        // 音频播放
        playerAudio(data, type) {
            this.$emit('on-audio-event', 'playAudio', data, type)
        },
        // 按键事件
        btnClick(btnType) {
            if (this.$refs.shapeErrorCard && this.$refs.shapeErrorCard.btnClick) {
                this.$refs.shapeErrorCard.btnClick(btnType)
            }
        },
        // 语音结束
        audioEndCallback(audioId) {
            // 测量完成语音
            if (audioId === 'shapeFinish') {
                // 体围测量成功
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    girth: true
                })
                // 存储体围测量结果
                let meatureInfo = new Map()
                meatureInfo.set('girth', {
                    isMeasured: true,
                    status: true
                })
                meatureInfo.set('statusCode', 0)
                meatureInfo.set('scanid', this.measureInfo.scanid)
                if (this.measureInfo.scanTime) {
                    meatureInfo.set('scanTime', this.measureInfo.scanTime)
                }
                //  计算测量项总数
                this.$store.commit('CHANGE_NUMBER', true)
                if (this.settingInfo.combineMeasureEnable && this.settingInfo.triMode) {
                    // 手动修改为体态测量成功
                    // 存储体态测量结果
                    // let meatureInfo = new Map()
                    // meatureInfo.set('shape', {
                    //     isMeasured: true,
                    //     status: true
                    // })
                    const devicePre = this.deviceInfo.deviceId.substring(0, 2)
                    const isVE335 = ['38', '39'].includes(devicePre)
                    this.$store.commit('CHANGE_MEASURE_INFO', {
                        shape: { isMeasurement: true },
                        spine: { isMeasurement: isVE335 || this.deviceInfo.spineReportEnabled }
                    })
                    // 计算测量项目
                    this.$store.commit('CHANGE_NUMBER', true)
                }
                // 跳转到体围测量结果
                this.$changeViewPage('GirthResult', { typeSort: this.$route.query.typeSort })
                // 引导语音
            } else if ((audioId === 'girthScanningTip' || audioId === 'girthScanningTipSum') && !this.leaveReset) {
                // 背景音效
                this.$emit('on-audio-event', 'playAudio', 'shapeScanningBG')
                // 背景音效 一遍播放完成后再次播放引导语音
            } else if (audioId === 'shapeScanningBG') {
                if (!this.isRepeatPlay) {
                    this.isRepeatPlay = true
                    // 播放
                    this.$emit('on-audio-event', 'playAudio', 'shapeScanningHalfTip')
                }
            } else if (audioId === 'shapeScanningHalfTip' && !this.leaveReset) {
                // 体态测量中背景音效
                this.$emit('on-audio-event', 'playAudio', 'shapeScanningBG')
            }
        },
        tableStopHandler() {
            if (!this.leaveReset) {
                this.step = 2
                window.logger.info('体围转台停止，主动关闭算法')
                // 主动关闭算法 关闭后算法才会上报测量结果
                this.$algClient.stopScan()
            } else {
                this.leaveReset = false
                this.error = true
            }
        },
        scanErrorHandler(status) {
            switch (status) {
                case 1:
                    window.logger.info('启动识别硬件异常')
                    this.onDeviceError(status)
                    break
                case 2:
                    break
                case 3:
                    if (!this.leaveReset) {
                        // 停止音频
                        this.$emit('on-audio-event', 'stopAudio')
                        window.logger.info('测量过程中人离开')
                        // 取消扫描任务
                        this.$algClient.cancelScan()
                        // 测量过程中人离开
                        const error = shapeFault.find((err) => {
                            return err.id === 2
                        })
                        this.shapeErrors.push(error)
                        if (this.step < 2) {
                            this.leaveReset = true
                        } else {
                            this.error = true
                        }
                    }
                    break
                default:
                    break
            }
        },
        scanResultHandler(data) {
            clearTimeout(this.timeoutTimer)
            if (data.detectResult && data.scanType === 1) {
                if (!this.fail) {
                    const typeSort = parseInt(this.$route.query?.typeSort)
                    if (typeSort === 1) {
                        window.logger.info('身材成分围度测量')
                        // 修改身材成分围度测量的信息  如果是麦澜德模式不修改身体成分
                        // if (this.deviceInfo.healthPackageEnable === 2) {
                        //     this.$store.commit('CHANGE_MEASURE_INFO', {
                        //         isMeasureWd: true
                        //     })
                        // } else {
                        //     this.$store.commit('CHANGE_MEASURE_INFO', {
                        //         isMeasureWd: true,
                        //         mass: { isMeasurement: true, status: true, isMeasured: true }
                        //     })
                        // }
                        this.$store.commit('CHANGE_MEASURE_INFO', {
                            isMeasureWd: true,
                            mass: { isMeasurement: true, status: true, isMeasured: true }
                        })
                    } else if (typeSort === 3) {
                        // 测了无电流营养费分析
                        this.$store.commit('CHANGE_MEASURE_INFO', {
                            isMeasureWu: true,
                            nutrition: 1
                        })
                    }
                    this.success = true

                    if (this.deviceInfo.deviceType === 5) {
                        // 存储数据
                        this.$store.commit('CHANGE_MEASURE_INFO', {
                            recordReport: data
                        })
                    } else {
                        // 上报测量数据
                        this.$controlClient.scanResult(data)
                    }
                    // 体态完成语音
                    this.$emit('on-audio-event', 'playAudio', 'shapeFinish')
                } else {
                    window.logger.info('体围已测量失败，忽略测量结果上报')
                }
            }
        },
        hardwareStatusHandler(data) {
            // 测量过程中并且上报了转台异常
            if (!data.status && [4, 6].includes(data.type)) {
                // 测量中且没有失败时反馈硬件异常
                if (!this.fail && this.step === 1) {
                    clearTimeout(this.timeoutTimer)
                    // 取消扫描任务
                    this.$algClient.cancelScan()
                    const tableErrors = this.deviceErrors.filter((err) => {
                        return ['0011', '0012'].indexOf(err.title) > -1
                    })
                    this.shapeErrors.push(tableErrors[0])
                    this.error = true
                    // 人离开-转台复位页
                } else if (this.leaveReset) {
                    this.leaveReset = false
                    const tableErrors = this.deviceErrors.filter((err) => {
                        return ['0011', '0012'].indexOf(err.title) > -1
                    })
                    this.shapeErrors = []
                    this.shapeErrors.push(tableErrors[0])
                    this.error = true
                }
            }
        },
        // 体围硬件异常处理 3 深度相机硬件异常 4 深度相机同步线异常
        onDeviceError(code) {
            clearTimeout(this.timeoutTimer)
            this.$emit('on-audio-event', 'stopAudio')
            window.logger.info('体围测量异常，主动关闭算法')
            // 取消扫描任务
            this.$algClient.cancelScan()
            const error = algError.find((err) => {
                return err.id === code + 2
            })
            this.$store.commit('CHANGE_DEVICE_ERRORS', error)
            this.shapeErrors.push({
                canRescan: false,
                ...error
            })
            this.error = true
        },
        // 重新测量
        handleScanErrRescan() {
            window.logger.info('体围重新测量')
            let unScanItems = this.measureInfo.unScanItems
            if (unScanItems[0] !== 2) {
                unScanItems = [3, ...unScanItems]
            } else {
                unScanItems = this.measureInfo.unScanItems.filter((item) => item !== 2)
                unScanItems = [2, 3, ...unScanItems]
            }
            // 测量信息复位，防止回到项目选择页出现问题
            this.$store.commit('CHANGE_MEASURE_INFO', {
                girth: { isMeasurement: false, status: false, composeStatus: -1 },
                active: 0,
                unScanItems
            }),
                // 防止重新测量时，在引导页返回到测量页
                // this.$changeViewPage('GirthGuide')

                router.go(-1)
        },
        // 清除所有定时器
        handleClearAllTimer() {
            clearTimeout(this.timeoutTimer)
            clearInterval(this.cutdownTimer)
        }
    }
}
</script>
<style lang="less" scoped>
.scan {
    width: 100%;
    height: 100%;

    .scan-page {
        width: 100%;
        height: 100%;

        .cut-down {
            font-size: 560px;
            font-family: 'Akrobat-ExtraLight';
            font-weight: 200;
            line-height: 700px;
            text-align: center;
            color: #ffffff;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 101;
            text-shadow: 0 0 150px #155edb, 0 0 150px #155edb;
        }

        .scanning {
            position: relative;
        }

        .ipose-scanning-model {
            position: absolute;
            z-index: 1;
            width: 625px;
            height: auto;
            top: 455px;
            left: calc(50% - 312px);
            // left: calc(50% - 312px);
        }

        .ipose-scanning-ring {
            position: absolute;
            z-index: 2;
            width: 315px;
            height: auto;
            top: 805px;
            left: calc(50% - 157px);
        }

        .scanning-img {
            position: absolute;
            z-index: 5;
            top: 455px;
            width: 960px;
            height: 8px;
            left: 61px;
            background: linear-gradient(90deg, rgba(0, 159, 232, 0) 0%, #02fbfbf8 50%, rgba(0, 159, 232, 0) 100%);
            animation: scanning-img linear 8s;
            animation-iteration-count: infinite;
        }

        @keyframes scanning-img {
            from {
                top: 455px;
            }

            to {
                top: 1396px;
            }
        }
    }

    .content {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .bottom-msg {
        position: absolute;
        left: 0;
        bottom: 144px;
        width: 100%;

        .tip {
            li {
                max-width: 720px;
                margin-right: 50px;
            }
        }

        .info {
            .msg {
                text-align: center;
                font-size: 48px;
                font-family: OPPOSansR;
                font-weight: normal;
                color: #ffffff;
                line-height: 54px;
                margin: 36px auto 24px;
            }
        }
    }

    .error-page {
        position: absolute;
        width: 100%;
        height: 100%;

        .people-leave {
            height: 100%;
            text-align: center;

            .leave-icon {
                margin: 492px auto 0;
                width: 792px;
                height: 792px;
            }

            .tip-card {
                position: absolute;
                width: 960px;
                bottom: 144px;
                padding: 72px 0 96px;
                margin: 0 60px;
                background: #333333;
                border-radius: 32px;

                h3 {
                    margin: 0;
                    text-align: center;

                    img {
                        width: 66px;
                        height: 66px;
                        margin-right: 24px;
                        vertical-align: middle;
                    }

                    span {
                        font-size: 48px;
                        font-weight: normal;
                        vertical-align: middle;
                    }
                }

                p {
                    font-size: 32px;
                    margin: 24px 20px 0;
                    text-align: center;
                    font-weight: normal;
                }
            }
        }
    }
}
</style>
