<!--
 * @Description: 体态测量过程页
 * @Author: gaoyuanyuan
 * @Date: 2021-04-26 16:53:59
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2026-01-20 18:26:43
-->
<template>
    <div class="scan">
        <!-- <div>
            <button @click="leavePersonAction()">人离开</button>
        </div> -->
        <transition-group name="fade" mode="in-out" appear>
            <!-- 测量过程 -->
            <div key="scanPage" v-if="!fail && !success" class="scan-page">
                <transition-group name="fade" mode="in-out" appear>
                    <!-- 倒计时 -->
                    <div key="cutdown" v-if="step === 0" class="cut-down">{{ countdown }}</div>
                    <!-- 测量中 & 等待测量结果 -->
                    <div key="scanning" v-else-if="step === 1 || step === 2" class="scanning">
                        <!-- <video
                            src="media-file://video/shape/iposeScanning.mp4"
                            class="ipose-scanning"
                            name="ipose引导动画"
                            preload="auto"
                            autoplay
                            loop
                            width="100%"
                        >
                            您的浏览器不支持 video 标签。
                        </video> -->
                        <div class="scanning-img" v-if="lineStatus"></div>
                        <img
                            class="ipose-scanning"
                            width="100%"
                            :src="require(`@/assets/img/shape/Ipose@2x${deviceInfo.teenagerIsOpen ? '_t' : ''}.jpg`)"
                            alt=""
                        />
                        <!-- <img class="ipose-scanning" width="100%" src="@/assets/img/shape/Ipose@2x_t.jpg" alt="" /> -->
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
            <!-- 测量成功 -->
            <success-card key="successPage" v-else-if="success"></success-card>
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
import { mapGetters, mapActions } from 'vuex'
import { algError, shapeFault } from '@/config/error-reason'
import MsgCard from '@/components/MsgCard.vue'
import ShapeErrorCard from './components/ErrorCard.vue'
import SuccessCard from './components/SuccessCard.vue'
import { EventBus } from '@/util/event-bus'
import router from '@/router'
export default {
    name: 'ShapeScan',
    components: {
        MsgCard,
        ShapeErrorCard,
        SuccessCard
    },
    data() {
        return {
            // 0 倒计时 1 测量中 2 等待测量结果(转台停止)
            step: 0,
            timeoutTimer: null,
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
        this.initStep()
        // 异常测量项
        this.removeItems()
        this.$store.commit('CHANGE_MEASURE_INFO', {
            shape: { isMeasurement: true }
        })
    },
    mounted() {
        EventBus.$on('EventAction', (type, data) => {
            window.logger.info('体态监听事件', type, data)
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
            } else if (type === 'WeightMeasureResult') {
                if (data.result) {
                    // 测量成功
                    // 返回体重结果 开始电阻测量
                    const weightData = {
                        scanId: this.measureInfo.scanId,
                        weight: data.data.weight
                    }
                    // 修改体重测量信息
                    const measureInfo = {
                        weight: {
                            status: true,
                            weight: data.data?.weight
                        }
                    }
                    this.$store.dispatch('changeMeasureInfo', measureInfo)
                    // 向控制服务上传数据
                    this.$controlClient.evalWeightResult(weightData)
                } else {
                    window.logger.info('体态中===体重测量失败===')
                }
            }
        })
    },
    beforeDestroy() {
        EventBus.$off('EventAction')
        this.handleClearAllTimer()
    },
    methods: {
        ...mapActions(['changeMeasureInfo']),
        removeItems() {
            window.logger.info('移除测量项目')
            const unScanItems = this.measureInfo.unScanItems.filter((item) => item !== 2)
            this.changeMeasureInfo({
                active: 2,
                unScanItems
            })
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
        // 音频播放
        playerAudio(data, type) {
            this.$emit('on-audio-event', 'playAudio', data, type)
        },
        // 启动倒计时
        handleStartCutDown() {
            // 播放倒计时语音语音
            this.$emit('on-audio-event', 'playAudio', 'shapeCountDown')
            this.cutdownTimer = setInterval(() => {
                if (this.countdown == 3 && this.deviceInfo.deviceType === 5) {
                    // 启动体重测量
                    this.$hardwareClient.weightMeasure()
                }
                this.countdown--
                // 转台异常
                const tableErrors = this.deviceErrors.filter((err) => {
                    return ['0011', '0012'].indexOf(err.title) > -1
                })
                if (this.countdown === 1) {
                    // 没有转台异常则发起检测
                    if (tableErrors.length === 0) {
                        // 发起体态测量请求
                        const setTimer = setTimeout(() => {
                            // 发起体态测量请求
                            this.$algClient.startScan(this.measureInfo.scanId, 2)
                            clearTimeout(setTimer)
                        }, 1 * 1000)
                        clearTimeout(this.timeoutTimer)
                        // 测量超时定时器
                        this.timeoutTimer = setTimeout(() => {
                            window.logger.info('体态测量超时，主动关闭算法')
                            this.timeout = true
                            // 取消扫描任务
                            this.$algClient.cancelScan()
                            if (!tableErrors) {
                                // 测量超时
                                const error = shapeFault.find((err) => {
                                    return err.id === 3
                                })
                                this.shapeErrors.push(error)
                            }
                        }, 60 * 1000)
                    }
                } else if (this.countdown === 0) {
                    clearInterval(this.cutdownTimer)
                    if (tableErrors.length === 0) {
                        this.step = 1
                        this.countdown = 3
                        // 体态测量中语音
                        this.$emit('on-audio-event', 'playAudio', 'shapeScanningTip')
                        setTimeout(() => {
                            return (this.lineStatus = true)
                        }, 1 * 1000)
                    } else {
                        this.shapeErrors.push(tableErrors[0])
                        this.error = true
                    }
                }
                // 体态倒计时做延迟处理
            }, 1300)
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
            if (audioId === 'weightSuccess') {
                // 存储体态测量结果
                let meatureInfo = new Map()
                meatureInfo.set('shape', {
                    isMeasured: true,
                    status: true
                })
                meatureInfo.set('statusCode', 0)
                meatureInfo.set('scanid', this.measureInfo.scanid)
                if (this.measureInfo.scanTime) {
                    meatureInfo.set('scanTime', this.measureInfo.scanTime)
                }

                // 计算测量项目
                this.$store.commit('CHANGE_NUMBER', true)
                // // 跳转到继续测量体围页面
                // this.$changeViewPage('GirthSelect')

                // 跳转到选择页
                let continueItem = this.measureInfo.unScanItems.filter((ele) => ele != 2)
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    unScanItems: continueItem,
                    shape: true
                })
                window.logger.info('设备操作模式', this.deviceInfo.operationMode)
                this.$changeViewPage(this.deviceInfo.operationMode === 1 ? 'TouchContinue' : 'GestureContinue')
                // 引导语音
            } else if (audioId === 'shapeScanningTip' && !this.leaveReset) {
                // 体态测量中背景音效
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
                window.logger.info('体态转台停止，主动关闭算法')
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
            if (!this.measureInfo.weight.status && this.deviceInfo.deviceType === 5) {
                this.error = true
                window.logger.info('体重测量未完成，显示体态失败，忽略测量结果上报')
                return
            }
            if (data.detectResult && data.scanType === 2) {
                if (!this.fail) {
                    this.success = true
                    // 上报测量数据
                    this.$controlClient.scanResult(data)
                    // 体态完成语音
                    this.$emit('on-audio-event', 'playAudio', 'weightSuccess')
                } else {
                    window.logger.info('体态已测量失败，忽略测量结果上报')
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
        // 体态硬件异常处理 3 深度相机硬件异常 4 深度相机同步线异常
        onDeviceError(code) {
            if (this.error) {
                return
            }
            clearTimeout(this.timeoutTimer)
            this.$emit('on-audio-event', 'stopAudio')
            window.logger.info('体态测量异常，主动关闭算法')
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
            window.logger.info('体态重新测量')
            let unScanItems = this.measureInfo.unScanItems
            unScanItems = [2, ...unScanItems]
            // 测量信息复位，防止回到项目选择页出现问题
            this.$store.commit('CHANGE_MEASURE_INFO', {
                shape: { isMeasurement: false, status: false, composeStatus: -1 },
                active: 0,
                unScanItems
            }),
                // 防止重新测量时，在引导页返回到测量页
                // this.$changeViewPage('ShapeGuide', { isLeave: false })
                router.go(-1)
        },
        // 清除所有定时器
        handleClearAllTimer() {
            clearTimeout(this.timeoutTimer)
            clearInterval(this.cutdownTimer)
        },
        leavePersonAction() {
            // 触发全局事件
            EventBus.$emit('EventAction', 'SurveyorStatus', 3)
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

        .scanning-img {
            position: absolute;
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
                top: 456px;
            }

            to {
                top: 1560px;
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
