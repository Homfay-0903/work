<!--
 * @Description: 身体成分测量过程
 * @Author: gaoyuanyuan
 * @Date: 2020-03-07 19:48:06
 * @LastEditTime: 2024-07-05 10:33:19
 * @LastEditors: DonWang wangwenqiu@suanier.com
 -->
<template>
    <div class="mass-scan">
        <!-- <div style="position: absolute; left: 0; top: 0; z-index: 999; text-align: center; width: 100%">
            &ndash;&gt;
            <button @click="handleChangeStatus(-1)">测量准备</button>
            <button @click="handleChangeStatus(0)">测量中</button>
            <button @click="handleChangeStatus(1)">成功</button>
        </div> -->
        <!-- 无人样式 -->
        <!-- 开始测量 倒计时 -->
        <template v-if="scanStatus === -1">
            <div class="cut-down">{{ clockNum }}</div>
        </template>
        <!-- 非倒计时 -->
        <div v-else-if="scanStatus === 0" class="scan-process">
            <!-- 测量过程中 -->
            <!-- <video
                src="media-file://video/mass/scanProcess.mp4"
                class="scan-process-video"
                name="测量过程中动画"
                preload="auto"
                autoplay
                loop
                width="100%"
            >
                您的浏览器不支持 video 标签。
            </video> -->
            <img class="scan-process-video" src="@/assets/img/mass/scanProcess.png" alt="" />
        </div>
        <!-- 测量成功 -->
        <success-card v-else-if="scanStatus === 1" :successful="$t('mass.scan.down.successful')"></success-card>
        <!-- 底部提醒 -->
        <div class="info">
            <!-- 启动失败 -->
            <transition name="fade-move" mode="out-in" appear>
                <!-- 非倒计时 测量准备中状态 -->
                <template v-if="scanStatus !== -1">
                    <!-- 测量中 -->
                    <msg-card key="scanning" v-if="scanStatus === 0" class="msg-card" type="info">
                        <ul slot="info-content">
                            <li>{{ $t('mass.weight.scan.down.guide1') }}</li>
                            <li>{{ $t('mass.weight.scan.down.guide2') }}</li>
                        </ul>
                    </msg-card>
                    <!-- 测量失败 -->
                    <error-card
                        :class="this.sucItemNum && this.scanStatus !== 2 ? 'error-box' : ''"
                        key="scanErr"
                        ref="scanErrCard"
                        v-else-if="scanStatus === 2"
                        :scanType="1"
                        :scanErrors="scanErrors"
                        @eventType="isTouchScreen"
                        @scan-error-rescan="handleRescan"
                        @player-audio="playerAudio"
                        @restart-countdown-end="restartCountdownEnd"
                        style="height: 100%"
                        :select="select"
                    ></error-card>
                </template>
            </transition>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { CountUp } from '@/util/countUp.js'
import MsgCard from '@/components/MsgCard.vue'
import ErrorCard from './components/ErrorCard.vue'
import SuccessCard from './components/SuccessCard.vue'
import { massFault } from '@/config/error-reason'
import { EventBus } from '@/util/event-bus'

// eslint-disable-next-line max-params
const easingFn = function (t, b, c, d) {
    // eslint-disable-next-line no-param-reassign
    let ts = (t /= d) * t
    let tc = ts * t
    return b + c * (tc + -3 * ts + 3 * t)
}

const countUp = new CountUp(1020, {
    startVal: 1,
    duration: 30,
    easingFn
})

export default {
    name: 'MassScan',
    components: {
        MsgCard,
        ErrorCard,
        SuccessCard
    },
    data() {
        return {
            // 扫描状态 -1 倒计时准备测量 0 测量中 1 测量成功 2 测量失败
            scanStatus: -1,
            // 准备倒计时
            prepareTimer: null,
            clockNum: 3,
            // 测量超时
            scanTimeout: null,
            // 测量超时倒计时时间
            scanTimeNum: 0,
            // 体成分测量异常原因
            errorReason: massFault,
            // 测量异常
            scanErrors: [],
            progress: 0,
            // 是否可以重新测量
            ifRestart: false,
            // 测量选择项
            select: 0
        }
    },
    computed: {
        ...mapGetters([
            'standPeople',
            'measureInfo',
            'deviceUsable',
            'deviceErrors',
            'sucItemNum',
            'deviceInfo',
            'settingInfo'
        ]),
        // 国际化测量样式只通过style修改
        transformStyle() {
            return this.$i18n.locale === 'zh'
                ? ''
                : this.$i18n.locale === 'ja'
                ? ''
                : 'margin-right: 136px;text-align: left;width: 65%;'
        },
        // 手势是否可用
        gestureUsable() {
            return this.settingInfo.gestureState === 1 && this.deviceUsable.gesture
        }
    },
    watch: {
        // 测量状态改变
        scanStatus(val, oldVal) {
            if (oldVal === -1 && val === 0) {
                if (!countUp.error) {
                    countUp.start()
                } else {
                    console.error(countUp.error)
                }
            } else if (oldVal === 0 && [1, 2].indexOf(val) > -1) {
                countUp.pauseResume()
                this.$nextTick(() => {
                    this.progress = 0
                    countUp.reset()
                })
            }
        },
        // 站人状态改变
        standPeople(val) {
            this.standPeopleHandler(val)
        }
    },
    created() {
        this.initStartScan()
        this.removeItems()
        this.$store.commit('CHANGE_MEASURE_INFO', {
            mass: { isMeasurement: true }
        })
    },
    mounted() {
        this.scanErrors.push(this.errorReason[4])
        // countUp.start()
        EventBus.$on('EventAction', (type, data) => {
            // 体成分数据上报
            if (type === 'BodyMeasureResult') {
                this.scanResultHandler(data)
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
                    this.$controlClient.weightResult(weightData)
                    this.$hardwareClient.bodyMeasure()
                } else {
                    // 测量失败
                    let reason = data.reason === 1 && !this.standPeople ? 2 : data.reason
                    this.measureError(reason)
                }
            }
        })
        countUp.change((val) => {
            this.progress = val
        })
    },
    beforeDestroy() {
        EventBus.$off('EventAction')
        clearTimeout(this.prepareTimer)
        clearInterval(this.scanTimeout)
    },
    methods: {
        ...mapActions(['changeMeasureInfo']),
        removeItems() {
            const unScanItems = this.measureInfo.unScanItems.filter((item) => item !== 1)
            this.changeMeasureInfo({
                active: 1,
                unScanItems
            })
        },
        // 触屏
        isTouchScreen(active) {
            this.select = active
            const setTimer = setInterval(() => {
                this.$refs.scanErrCard.btnClick(3)
                window.clearInterval(setTimer)
            }, 300)
        },
        // 改变状态
        handleChangeStatus(status) {
            this.scanStatus = status
            if (status === -1) {
                this.clockNum = 3
                this.scanErrors = []
                // 开始测量
            } else if (status === 0) {
                // v1.6.1 产品认为体成分测量过快。增加5s延时
                const timer = setTimeout(() => {
                    clearTimeout(timer)
                    // 发起体成分测量
                    this.$hardwareClient.weightMeasure()
                }, 5000)

                // 播放测量中语音
                this.$emit('on-audio-event', 'playAudio', 'bodyScaning')
                // 12s后没有测量结果则为测量超时
                if (this.scanTimeout) {
                    clearInterval(this.scanTimeout)
                }
                this.scanTimeNum = 35
                this.scanTimeout = setInterval(() => {
                    this.scanTimeNum--
                    if (this.scanTimeNum === 0) {
                        if (this.scanStatus === 0) {
                            this.handleChangeStatus(2)
                            this.scanErrors.push(this.errorReason[6])
                        }
                        clearInterval(this.scanTimeout)
                    }
                }, 1000)
                // 测量成功
            } else if (status === 1) {
                // 播放测量成功语音
                this.$emit('on-audio-event', 'playAudio', 'weightSuccess')
            }
        },
        // 准备倒计时
        runPrepareClock() {
            if (this.prepareTimer) {
                clearInterval(this.prepareTimer)
            }
            this.prepareTimer = setInterval(() => {
                this.clockNum--
                if (this.clockNum === 0) {
                    clearInterval(this.prepareTimer)
                    if (!this.deviceUsable.mass) {
                        this.scanStatus = 2
                        const massErrors = this.deviceErrors.filter((item) => item.affectBm)
                        this.scanErrors.push(...massErrors)
                        return
                    }
                    // 倒计时结束开始测量
                    this.handleChangeStatus(0)
                }
            }, 1000)
        },
        // 初始化启动测量
        initStartScan() {
            this.handleChangeStatus(-1)
            this.prepareTimer = null
            // 播放倒计时语音
            const setTimer = setInterval(() => {
                this.$emit('on-audio-event', 'playAudio', 'countDown')
                window.clearInterval(setTimer)
            }, 100)
            this.runPrepareClock()
        },
        // 重新测量
        handleRescan() {
            if (this.scanStatus === 2) {
                this.initStartScan()
                this.$changeViewPage('MassConfirm')
            }
        },
        // 音频播放
        playerAudio(data, type) {
            this.$emit('on-audio-event', 'playAudio', data, type)
        },
        // 重新启动倒计时结束
        restartCountdownEnd() {
            this.ifRestart = true
        },
        // 语音结束
        audioEndCallback(audioId) {
            if (this.$refs.scanErrCard && this.$refs.scanErrCard.audioEndCallback) {
                this.$refs.scanErrCard.audioEndCallback(audioId)
            }
            if (audioId === 'weightSuccess') {
                // 身体成分测量成功
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    mass: {
                        status: true
                    }
                })
                // 添加测量成功项
                this.$store.commit('CHANGE_NUMBER', true)
                // 跳转到项目选择页面
                this.$changeViewPage(this.deviceInfo.operationMode === 1 ? 'TouchContinue' : 'GestureContinue')
            }
            if (audioId === 'bodyScaning') {
                // 播放体成分测量中背景音效
                this.$emit('on-audio-event', 'playAudio', 'massScanningBG')
            }
        },
        // 按键事件
        btnClick(btnType) {
            if (this.$refs.scanErrCard && this.$refs.scanErrCard.btnClick) {
                // if (btnType === 1) {
                //     this.select = 0
                // } else if (btnType === 2) {
                //     this.select = 1
                // } else if (btnType === 3) {
                //     this.$refs.scanErrCard.btnClick(btnType)
                // }
                this.$refs.scanErrCard.btnClick(btnType)
            }
        },
        // 站人处理
        standPeopleHandler(personStatus) {
            window.logger.info(`站人状态修改${personStatus}`)
            // 下人 反馈测量失败
            if (!personStatus && this.scanStatus === 0) {
                // 体成分人离开异常
                this.handleChangeStatus(2)
                this.scanErrors.push(this.errorReason[5])
                // 站人 测量失败页 重新测量
            } else if (personStatus && this.scanStatus === 2) {
                // 可以重新测量
                if (this.ifRestart) {
                    this.handleRescan()
                }
            }
        },
        // 测量结果处理
        scanResultHandler(data) {
            // 测量结果返回
            if (data.result) {
                // 测量成功
                clearInterval(this.scanTimeout)
                this.handleChangeStatus(1)
                // 向控制服务上传数据
                this.$controlClient.turnTableResistance({ scanId: this.measureInfo.scanId, ...data })
            } else {
                // 清除测量超时定时器
                clearInterval(this.scanTimeout)
                this.handleChangeStatus(2)
                if (data.reason === 1) {
                    // 体脂模块测量异常
                    this.scanErrors.push(this.errorReason[4])
                }
            }
        },
        hardwareStatusHandler(data) {
            // 测量过程中并且上报了硬件异常
            if (this.scanStatus !== 2 && !data.status && data.type !== 4) {
                this.$store.commit('CHANGE_STAND_PEOPLE', false)
                clearInterval(this.scanTimeout)
                this.handleChangeStatus(2)
                this.scanErrors.push(this.errorReason[data.type - 1])
            }
        },
        // 测量失败
        measureError(reason) {
            if (this.scanStatus !== 2 && reason) {
                this.clearAllTimeout()
                this.scanStatus = 2
                this.isShowDom = false
                const errorCode = [2, 5, 1, 0]
                this.scanErrors.push(this.errorReason[errorCode[reason - 1]])
            }
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.mass-scan {
    .cut-down {
        margin-top: 55%;
        font-size: 560px;
        font-family: 'Akrobat-ExtraLight';
        font-weight: 200;
        line-height: 700px;
        text-align: center;
        background: #000000;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        // background: -webkit-radial-gradient(center 900px, circle, #1c2133, #000, #000);
        text-shadow: 0 0 150px #155edb, 0 0 150px #155edb;
    }
    .clock-info {
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        margin: auto;
    }
    .scan-process {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        height: 100%;
        display: flex;
        justify-content: center;
        bottom: 100px;

        .scan-process-video {
            position: absolute;
            width: 580px;
            height: 580px;
            top: 523px;
        }

        .process-border {
            position: absolute;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            &.rotate {
                .circle-border {
                    animation-play-state: running;
                }
            }
            .circle-bg {
                z-index: 1;
                position: absolute;
            }

            .circle-border {
                animation: spin 4s linear infinite;
                animation-play-state: paused;
                position: absolute;
                z-index: 2;
                position: absolute;

                &.hide {
                    visibility: hidden;
                }
            }

            .center-circle-fix {
                position: absolute;
                z-index: 2;
                position: absolute;
            }
            .center-circle {
                width: 700px;
                position: absolute;
                z-index: 3;
            }

            .icon-bg {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 4px solid #fff;
                position: absolute;
                z-index: 5;
                margin-top: 45px;
                margin-left: 40px;
                visibility: hidden;

                &.success {
                    visibility: visible;
                    background-color: #289b2d;
                }

                &.error {
                    visibility: visible;
                    background-color: #ff2438;
                }

                i {
                    position: absolute;
                    font-size: 30px;
                }
            }
        }
    }
    .info {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 101;
        top: 406px;
        .msg-card {
            position: absolute;
            bottom: 144px;
            left: 0;
            right: 0;
            margin: auto;
        }

        .model-title {
            text-align: center;
            margin-bottom: 50px;
            margin-top: 0;
            font-size: 64px;
            color: #fff;
        }
        .error-box {
            margin-top: 16%;
        }
    }
    // 站人后的样式
    .stand-content {
        position: absolute;
        background: #000000;
        width: 1080px;
        height: 1920px;
        z-index: 102;
        top: 0px;
        .estimate {
            position: absolute;
            top: 14px;
            width: 1080px;
            text-align: right;
            span {
                color: #898f99;
                font-size: 36px;
                font-weight: 400;
                line-height: 50px;
                margin-right: 60px;
                i {
                    display: inline-block;
                    // width: 1.6em;
                    color: #ff791f;
                    font-size: 36px;
                    font-weight: 400;
                    font-style: normal;
                    text-align: center;
                }
            }
            .line {
                position: relative;
                width: 1024px;
                height: 8px;
                margin: 20px auto;
                background: #ff791f;
                .progress {
                    position: absolute;
                    height: 10px;
                    top: -1px;
                    right: 0;
                    background: #5e687b;
                    transition: width 0.2s linear;
                }
            }
        }
        .card {
            position: relative;
            width: 1024px;
            height: 288px;
            border-radius: 24px;
            margin: 144px auto 0;
            text-align: center;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            &.row {
                flex-direction: row;
            }
            &:after {
                content: '';
                position: absolute;
                width: 992px;
                height: 256px;
                top: 12px;
                left: 12px;
                border-radius: 16px;
                border: 4px dashed #ced7e0;
                z-index: 0;
            }
            &.normal {
                background: #e9f0f6;
                color: @color-light-blue;
                font-size: 48px;
                font-weight: normal;
                z-index: -2;
            }
            .short-tip-img {
                position: absolute;
                top: 12px;
                left: 738px;
                width: 258px;
                height: 258px;
                margin: 4px 48px 16px 16px;
                border-radius: 16px;
                vertical-align: middle;
                z-index: -1;
                // border: 1px solid rgba(255, 255, 255, 0.32);
            }
            &.success {
                color: #fff;
                background-image: linear-gradient(
                    -45deg,
                    @color-blue 44%,
                    @color-light-blue 25%,
                    @color-light-blue 50%,
                    @color-blue 50%,
                    @color-blue 95%,
                    @color-light-blue 75%,
                    @color-light-blue
                );
                background-size: 32px 32px;
                &:after {
                    display: none;
                }
            }
            .dot {
                display: inline-block;
                width: 64px;
                height: 64px;
                margin: 0 16px;
                line-height: 64px;
                background: #ffffff;
                border-radius: 50em;
                color: @color-blue;
            }
            .scanning-bar {
                position: absolute;
                overflow: hidden;
                top: 0;
                left: 0;
                width: 0;
                height: 100%;
                background-image: linear-gradient(
                    -45deg,
                    @color-blue 44%,
                    @color-light-blue 25%,
                    @color-light-blue 50%,
                    @color-blue 50%,
                    @color-blue 95%,
                    @color-light-blue 75%,
                    @color-light-blue
                );
                background-size: 32px 32px;
                animation: progress-bar 2s linear infinite;
                // transition: width 0.2s ease-in-out;
                z-index: 1;
                span {
                    position: absolute;
                    white-space: nowrap;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #fff;
                }
            }
            .es,
            .en,
            .de,
            .pt,
            .fr,
            .tr,
            .it {
                margin-right: 143px;
                text-align: left;
                width: 740px;
                span {
                    white-space: normal !important;
                }
            }
            .cn-scanning-bar {
                span {
                    left: 324px;
                }
            }
            .en-scanning-bar {
                span {
                    left: 156px;
                }
            }
            .es,
            .pt,
            .en,
            .de,
            .fr,
            .tr,
            .it {
                span {
                    left: 110px;
                }
            }
            .ja {
                span {
                    left: 348px;
                }
            }
            &.error {
                background: @color-red;
                color: #fff;
                font-size: 48px;
                font-weight: normal;
                border: 0px;
                border-radius: 32px;
                &:after {
                    content: '';
                    position: absolute;
                    width: 992px;
                    height: 256px;
                    top: 12px;
                    left: 12px;
                    border-radius: 16px;
                    border: 0px;
                }
            }
            .icon {
                display: block;
                width: 72px;
                height: 72px;
                margin: 0 auto 10px;
            }
        }
    }
}
@keyframes progress-bar {
    from {
        background-position: 0 0;
    }
    to {
        background-position: 32px 0;
    }
}
</style>
