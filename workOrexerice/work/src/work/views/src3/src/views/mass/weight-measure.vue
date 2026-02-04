<!--
 * @Description: 体重测量过程
 * @Author: wangmingdong
 * @Date: 2019-09-06 16:24:26
 * @LastEditTime: 2025-12-26 18:32:07
 * @LastEditors: liutq
 -->
<template>
    <div :class="['content', $i18n.locale]">
        <!-- <button style="position: relative; z-index: 999" @click="mode3">触发按钮事件</button> -->
        <!-- 站人样式 -->
        <!-- <div v-show="standPeople" class="stand-content"> -->
        <div v-if="false" class="stand-content">
            <div v-if="scanStatus === -1" class="card normal">
                <i18n path="mass.weight.scan.stand.guide1" tag="span" class="title">
                    <br place="item" />
                </i18n>
            </div>
            <div v-else-if="scanStatus === 0" class="card normal">
                <div :style="{ width: `${progress}px` }" class="scanning-bar">
                    <span>{{ $t('mass.weight.scan.stand.guide2') }}</span>
                </div>
                <span>{{ $t('mass.weight.scan.stand.guide2') }}</span>
            </div>
            <div v-else-if="scanStatus === 1" class="card normal success">
                <img src="@img/mass/success.svg" class="icon" />
                <span>{{ $t('mass.weight.scan.stand.guide3') }}</span>
            </div>
            <div v-else class="card error">
                <img src="@img/mass/failure.svg" class="icon" />
                <span>{{ $t('mass.weight.scan.stand.guide4') }}</span>
            </div>
        </div>
        <!-- 无人样式 -->
        <div
            v-if="scanStatus !== 1 && scanStatus !== 2 && isShowDom"
            :class="{ 'weight-container': true, rotate: dialStatus }"
        >
            <img v-if="isAnimation" src="@img/weight/weight_90turn.png" class="weight-turn" alt />
            <img src="@img/weight/weight_circle.png" class="weight-circle" alt />
            <!-- <div class="weight-circle-hide"></div> -->
            <img src="@img/weight/weight_ruler_small.png" class="weight-ruler-small" alt />
            <img src="@img/weight/weight_ruler_big.png" class="weight-ruler-big" alt />
            <img src="@img/weight/weight_arrow.png" class="weight-arrow" alt />
            <div class="weight-model"></div>
        </div>
        <!-- 测量成功 -->
        <success-card v-if="scanStatus === 1"></success-card>
        <!-- 底部提醒 -->
        <div class="msg-container">
            <transition name="fade-move" mode="out-in" appear>
                <template>
                    <!-- 测量中 -->
                    <msg-card key="scanning" v-if="[-1, 0].indexOf(scanStatus) > -1" class="model-msg" type="info">
                        <ul slot="info-content">
                            <li>{{ $t('mass.weight.scan.down.guide1') }}</li>
                            <li>{{ $t('mass.weight.scan.down.guide2') }}</li>
                        </ul>
                    </msg-card>
                    <!-- 测量失败 -->
                    <error-card
                        :class="this.sucItemNum ? 'error-box' : ''"
                        key="scanErr"
                        ref="scanErrCard"
                        v-if="scanStatus === 2"
                        :scanErrors="scanErrors"
                        @scan-error-rescan="handleRescan"
                        @eventType="isTouchScreen"
                        @player-audio="playerAudio"
                        :isMassError="true"
                        :select="select"
                        :canSkip="canSkip"
                        :isPro5Error="isPro5Error"
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
    duration: 15,
    easingFn
})

export default {
    name: 'WeightMeasure',
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            if (to.query?.typeSort) {
                vm.updateNavMeta(Number(to.query.typeSort))
            }
            // if (to.query?.typeSort) {
            //     const type = to.query?.typeSort
            //     if (type == 3) {
            //         to.meta.nav.prev = 'navigation-bar.wu-dian-liu'
            //     } else if (type == 1) {
            //         to.meta.nav.prev =
            //             vm.deviceInfo.deviceType === 3
            //                 ? 'common.ti-zhong-ce-liang'
            //                 : 'item-select.shen-ti-cheng-fen-ce-liang-wei-du'
            //     }
            // }
        })
    },
    components: {
        MsgCard,
        ErrorCard,
        SuccessCard
    },
    data() {
        return {
            // 扫描状态  -1 测量前 0 测量中 1 测量成功 2 测量失败
            scanStatus: -1,
            // 跳转时间
            goPageTimer: null,
            clockNum: 0,
            clockTimer: null,
            // 测量超时
            scanTimeout: null,
            // 体成分测量异常原因
            errorReason: massFault,
            // 测量异常
            scanErrors: [],
            // 日志启动时间戳
            logTimestap: 0,
            progress: 0,
            // 隐藏动画
            isAnimation: true,
            // 测量选择项
            select: 0,
            // 是否显示上面的dom,用来解决m30板子性能差，动画延迟严重的问题
            isShowDom: true,
            // 是否可跳过此测量
            canSkip: false,
            // pro5转台异常
            isPro5Error: false
        }
    },
    computed: {
        ...mapGetters([
            'standPeople',
            'settingInfo',
            'deviceUsable',
            'deviceErrors',
            'measureInfo',
            'sucItemNum',
            'deviceInfo'
        ]),
        // 表盘状态
        dialStatus() {
            return [-1, 0].indexOf(this.scanStatus) > -1 ? true : false
        },
        isStandardMode() {
            return this.settingInfo.deviceMode === 2
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
        standPeople(val) {
            // 测量失败并且重新站人时发起重新测量
            if (val && this.scanStatus === 2) {
                // this.handleRescan()
            }
        }
    },
    created() {
        this.isShowDom = true
        if (this.deviceInfo.deviceType !== 5) {
            this.canSkip = this.$route.query.canSkip === true
        }
        this.initStartScan()
        this.showAnimation()
        this.$store.commit('CHANGE_MEASURE_INFO', {
            weight: { isMeasurement: true }
        })
        // 移除测量项
        this.removeItems()
    },
    mounted() {
        EventBus.$on('EventAction', (type, data) => {
            // 体重测量结果
            if (type === 'WeightMeasureResult') {
                if (data.result) {
                    // 测量成功
                    if (this.scanStatus !== 2) {
                        const measureInfo = {
                            weight: {
                                status: true,
                                weight: data.data?.weight
                            }
                        }
                        this.$store.dispatch('changeMeasureInfo', measureInfo)
                        this.measureSuccess(data.data)
                    }
                } else {
                    // 测量失败
                    let reason = data.reason === 1 && !this.standPeople ? 2 : data.reason
                    this.measureError(reason)
                }
            } else if (type === 'HardwareStatusEvent') {
                this.hardwareStatusHandler(data)
            }
        })
        countUp.change((val) => {
            this.progress = val
        })
        this.$emit('on-audio-event', 'playAudio', 'weightGuide')
    },
    beforeDestroy() {
        EventBus.$off('EventAction')
        this.clearAllTimeout()
    },
    methods: {
        updateNavMeta(type) {
            if (type === 3) {
                this.$route.meta.nav.prev = 'navigation-bar.wu-dian-liu'
            } else if (type === 1) {
                this.$route.meta.nav.prev =
                    this.deviceInfo.deviceType === 3
                        ? 'common.ti-zhong-ce-liang'
                        : this.settingInfo.combineMeasureEnable && this.settingInfo.triMode
                        ? '身体评估'
                        : 'item-select.shen-ti-cheng-fen-ce-liang-wei-du'
            }
        },
        mode3() {
            this.$store.commit('ADD_DEVICE_ERROR', 5)
        },
        ...mapActions(['changeMeasureInfo']),
        removeItems() {
            // if (this.deviceInfo.deviceType === 5) {
            //     // vapro5的体重测量不删除体成分测量
            //     return
            // }

            const unScanItems = this.measureInfo.unScanItems.filter((item) => item !== 1)
            window.logger.info('移除测量项:', JSON.stringify(unScanItems))
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
        // 初始化启动测量
        initStartScan() {
            this.scanStatus = -1
            this.scanErrors = []
        },
        // 清除定时器
        clearAllTimeout() {
            clearTimeout(this.scanTimeout)
            clearTimeout(this.goPageTimer)
            this.clearClockTimer()
        },
        // 重新测量
        handleRescan() {
            if (this.scanStatus === 2) {
                this.logTimestap = 0
                this.initStartScan()
                this.$emit('on-audio-event', 'playAudio', 'weightGuide')
                setTimeout(() => {
                    this.isShowDom = true
                }, 500)
            }
            // 防止重新测量页面的按键提示继续显示
            this.$store.commit('CHANGE_PAGE_INFO', {
                btnList: []
            })
        },
        // 音频播放
        playerAudio(data, type) {
            this.$emit('on-audio-event', 'playAudio', data, type)
        },
        // 体重测量成功进入体围测量
        goMassConfirm() {
            this.goPageTimer = setTimeout(() => {
                // 体重测量成功
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    weight: {
                        status: true,
                        composeStatus: 1
                    }
                })
                //  计算测量项总数
                this.$store.commit('CHANGE_NUMBER', true)
                // 体重测量成功 开始测量体
                if (this.isStandardMode && this.deviceInfo.deviceType !== 5) {
                    this.$changeViewPage(this.deviceInfo.operationMode === 1 ? 'TouchContinue' : 'GestureContinue')
                } else {
                    // 进入体围测量
                    this.$changeViewPage('GirthGuide', { typeSort: this.$route.query.typeSort })
                }
            }, 1500)
        },
        // 定时检测
        runSecondClock(second, fn) {
            this.clearClockTimer()
            this.clockTimer = setInterval(() => {
                this.clockNum++
                if (this.clockNum === second && fn) {
                    fn()
                }
            }, 1000)
        },
        clearClockTimer() {
            if (this.clockTimer) {
                this.clockNum = 0
                clearInterval(this.clockTimer)
            }
        },
        // 语音结束
        audioEndCallback(audioId) {
            if (this.$refs.scanErrCard && this.$refs.scanErrCard.audioEndCallback) {
                this.$refs.scanErrCard.audioEndCallback(audioId)
            }
            if (audioId === 'weightGuide') {
                // if (!this.deviceUsable.mass) {
                //     this.scanStatus = 2
                //     const massErrors = this.deviceErrors.filter((item) => item.affectBm)
                //     this.scanErrors.push(...massErrors)
                //     return
                // }
                // 体重测量语音引导
                this.logTimestap = new Date().getTime()
                // 启动体重测量
                this.$hardwareClient.weightMeasure()
                this.scanStatus = 0
                // 15s后没有测量结果则为测量超时
                this.scanTimeout = setTimeout(() => {
                    if (this.scanStatus === 0) {
                        this.scanStatus = 2
                        this.isShowDom = false
                        this.scanErrors.push(this.errorReason[6])
                    }
                }, 18000)
                this.runSecondClock(5, () => {
                    if (this.scanStatus === 0) {
                        // 播放保持静止语音
                        this.$emit('on-audio-event', 'playAudio', 'weightStatic')
                    }
                })
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
        // 测量成功
        measureSuccess(data) {
            const weightData = {
                scanId: this.measureInfo.scanId,
                weight: data.weight
            }
            // 向控制服务上传数据
            this.$controlClient.weightResult(weightData)
            this.scanStatus = 1
            // 测量成功语音
            this.$emit('on-audio-event', 'playAudio', 'weightSuccess')
            this.goMassConfirm()
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
        },
        hardwareStatusHandler(data) {
            // 测量过程中并且上报了硬件异常
            if (this.scanStatus !== 1 && !data.status && data.type !== 4) {
                // 非转盘异常
                this.$store.commit('CHANGE_STAND_PEOPLE', false)
                this.clearAllTimeout()
                this.scanStatus = 2
                this.isShowDom = false
                this.scanErrors.push(this.errorReason[data.type])
            } else if (this.scanStatus !== 1 && !data.status && data.type === 4) {
                // 转盘异常
                this.clearAllTimeout()
                this.scanStatus = 2
                this.isShowDom = false
                this.scanErrors.push(this.errorReason[1])
                if (this.deviceInfo.deviceType === 5) {
                    this.isPro5Error = true
                    this.canSkip = false
                }
            }
        },
        //  动画消失
        showAnimation() {
            setTimeout(() => {
                this.$nextTick(() => {
                    this.isAnimation = false
                })
            }, 2500)
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.content {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    .weight-container {
        width: 100%;
        margin: 350px auto;
        height: 100%;
        position: relative;
        margin-top: 448px;

        &.rotate {
            .weight-circle {
                animation-play-state: running;
            }

            .weight-ruler-big {
                animation-play-state: running;
            }

            .weight-turn {
                animation-play-state: running;
            }
        }

        .weight-circle {
            position: absolute;
            top: 200px;
            z-index: 1;
            margin: auto;
            left: 0;
            right: 0;
            transition: all 0.3s;
            animation: spin 10s linear infinite;
            animation-direction: reverse;
            animation-play-state: paused;
            width: 1080px;
        }

        .weight-circle-hide {
            position: absolute;
            z-index: 2;
            width: 50%;
            height: 1300px;
            right: 0;
            background-color: #000;
        }

        .weight-turn {
            position: absolute;
            top: 200px;
            z-index: 3;
            margin: auto;
            left: 0;
            right: 0;
            width: 1080px;
            transition: all 0.3s;
            animation: spin 10s linear infinite;
            animation-direction: reverse;
            animation-play-state: paused;
        }

        .weight-ruler-small {
            position: absolute;
            top: 200px;
            z-index: 4;
            right: 10px;
            width: 520px;
        }

        .weight-ruler-bg {
            position: absolute;
            z-index: 4;
            width: 50%;
            height: 1300px;
            background-color: #000;
            transition: all 0.3s;
        }

        .weight-ruler-big {
            position: absolute;
            top: 200px;
            z-index: 5;
            margin: auto;
            left: 0;
            right: 0;
            animation: spin 10s linear infinite;
            animation-direction: reverse;
            animation-play-state: paused;
            width: 1080px;
        }

        .weight-arrow {
            position: absolute;
            top: -2px;
            z-index: 6;
            margin: auto;
            left: -50px;
            right: -50px;
            width: 1160px;
        }

        .weight-model {
            position: absolute;
            top: 0;
            z-index: 7;
            margin: auto;
            width: 100%;
            height: 1300px;
            background: linear-gradient(
                180deg,
                rgba(249, 249, 249, 0) 0%,
                rgba(249, 249, 249, 0) 30%,
                rgb(0, 0, 0) 50%,
                rgb(0, 0, 0) 100%
            );
        }
    }

    .msg-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: absolute;
        height: 100%;
        width: 100%;
        bottom: 0;

        .model-msg {
            position: relative;
            width: 100%;
            z-index: 101;
            margin-bottom: 144px;

            &.visibility:after {
                opacity: 1;
            }

            .model-title {
                text-align: center;
                margin-bottom: 50px;
                margin-top: 0;
                font-size: 64px;
                color: #fff;
            }

            .model-content {
                margin: 0;
                text-align: center;
                color: #ffffff;
                font-size: 36px;
            }
        }

        .error-box {
            position: relative;
            top: 0;
        }
    }

    // 站人后的样式
    .stand-content {
        position: absolute;
        background: #000000;
        width: 1080px;
        height: 1920px;
        z-index: 102;

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
                    left: 372px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #fff;
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

        .title {
            width: 912px;
        }
    }
}

.de {
    .scanning-bar {
        span {
            left: 212px !important;
        }
    }
}

.fr {
    .scanning-bar {
        span {
            left: 330px !important;
        }
    }
}

.tr,
.it {
    .scanning-bar {
        span {
            left: 212px !important;
        }
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
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
