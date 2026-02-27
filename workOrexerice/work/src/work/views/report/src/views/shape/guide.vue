<!--
 * @Description: 体态测量引导页
 * @Author: gaoyuanyuan
 * @Date: 2021-04-21 14:05:06
 * @LastEditors: liutq
 * @LastEditTime: 2025-06-21 12:05:35
-->
<template>
    <div class="guide">
        <transition-group name="fade" mode="in-out" appear>
            <!-- 引导页 -->
            <div key="guidePage" v-if="!fail" class="guide-page">
                <!-- 多人干扰 -->
                <template v-if="interfere">
                    <transition-group name="fade" mode="in-out" appear>
                        <div key="content" class="content interfere">
                            <img src="@img/shape/prompt.png" alt="保持一米距离" />
                            <p class="tip">{{ $t('common.guide.interfere1') }}</p>
                            <!-- <p>{{ $t('common.guide.interfere2') }}</p> -->
                        </div>
                        <cut-down-load
                            key="interfereCutDown"
                            ref="interfereCutDown"
                            @cut-down-over="onInterfereCutDownOver"
                            :duration="30"
                            :suffixType="2"
                        ></cut-down-load>
                    </transition-group>
                </template>
                <template v-else>
                    <div class="content">
                        <transition name="fade" mode="in-out" appear>
                            <!-- <video
                                key="tipOne"
                                :src="`media-file://video/shape/${$i18n.locale}/guideTurntable.mp4`"
                                name="体态引导"
                                autoplay
                                loop
                            >
                                您的浏览器不支持 video 标签。
                            </video> -->
                            <img
                                v-if="deviceInfo.teenagerIsOpen"
                                class="fade-png"
                                src="@/assets/img/shape/guideTurntab_t.png"
                                alt=""
                            />
                            <img
                                v-else-if="
                                    this.deviceInfo.deviceType === 5 && this.deviceInfo.healthPackageEnable === 2
                                "
                                class="fade-png"
                                src="@/assets/img/shape/guideTurntablemm.png"
                                alt=""
                            />
                            <img
                                v-else-if="this.deviceInfo.deviceType === 5"
                                class="fade-png"
                                src="@/assets/img/shape/guideTurntablemm.png"
                                alt=""
                            />
                            <img v-else class="fade-png" src="@/assets/img/shape/guideTurntable.png" alt="" />
                        </transition>
                    </div>
                    <!-- 底部提醒 -->
                    <div class="bottom-msg">
                        <transition name="fade-move" mode="out-in" appear>
                            <msg-card class="tip">
                                <ul slot="info-content">
                                    <li>{{ $t('shape.guide.bottom-msg1') }}</li>
                                    <li>{{ $t('shape.guide.bottom-msg2') }}</li>
                                </ul>
                            </msg-card>
                        </transition>
                    </div>
                    <cut-down-load
                        ref="scanCutDown"
                        @cut-down-over="onScanCutDownOver"
                        :duration="30"
                        :suffixType="2"
                    ></cut-down-load>
                </template>
            </div>
            <!-- 启动失败 -->
            <div key="errorPage" v-else class="error-page">
                <shape-error-card
                    key="scanErr"
                    ref="shapeErrorCard"
                    :isTimeout="timeout"
                    :errType="timeout ? 2 : 1"
                    :shapeErrors="shapeErrors"
                    :isStartError="true"
                    :selectMode="gestureUsable ? 1 : 0"
                    @scan-error-rescan="handleScanErrRescan"
                    @player-audio="playerAudio"
                ></shape-error-card>
            </div>
        </transition-group>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { algError, shapeFault } from '@/config/error-reason'
import MsgCard from '@/components/MsgCard.vue'
import CutDownLoad from '@/components/CutDownLoad.vue'
import ShapeErrorCard from './components/ErrorCard.vue'
import { EventBus } from '@/util/event-bus'
import * as types from '@/store/mutation-types'
export default {
    name: 'ShapeGuide',
    components: {
        MsgCard,
        CutDownLoad,
        ShapeErrorCard
    },
    data() {
        return {
            // 检测成功
            success: false,
            // 检测倒计时结束及超时
            timeout: false,
            // 检测异常
            error: false,
            // 是否人离开
            leave: false,
            // 体态异常
            shapeErrors: [],
            // 干扰语音播放完毕
            infTipAudioEnded: true,
            // 从多人干扰恢复正常
            infReturnToNormal: true,
            // 是否有过多人异常
            isStandErr: false
        }
    },
    computed: {
        ...mapGetters(['measureInfo', 'settingInfo', 'deviceUsable', 'deviceErrors', 'deviceInfo']),
        // 手势是否可用
        gestureUsable() {
            return this.settingInfo.gestureState === 1 && this.deviceUsable.gesture
        },
        // 超时或启动异常即失败
        fail() {
            return this.timeout || this.error
        },
        // 多人干扰 干扰语音播放完毕 和 从干扰恢复正常 才算恢复 所以默认初始化为true
        interfere() {
            return !this.infTipAudioEnded || !this.infReturnToNormal
        }
    },
    watch: {
        // 监听设备异常
        // deviceErrors: {
        //     handler(val) {
        //         this.deviceErrorsHandler(val)
        //     },
        //     deep: true
        // },
        fail: {
            handler(val) {
                this.deviceErrorsHandler(val)
            },
            deep: true
        }
    },
    created() {
        // 修改扫描状态
        this.$emit('on-audio-event', 'stopAudio')
        this.$store.commit('CHANGE_SCAN_STATE', true)
        this.initStep()
        const devicePre = this.deviceInfo.deviceId.substring(0, 2)
        const isVE335 = ['38', '39'].includes(devicePre)
        this.$store.commit('CHANGE_MEASURE_INFO', {
            shape: { isMeasured: true },
            spine: { isMeasured: isVE335 || this.deviceInfo.spineReportEnabled }
        })
    },
    mounted() {
        EventBus.$on('EventAction', (type, data) => {
            // pose检测和异常上报
            if (type === 'ScanError') {
                this.scanErrorHandler(data.errorStatus)
            } else if (type === 'SurveyorStatus') {
                if (data !== 1) {
                    this.scanErrorHandler(data)
                } else if (data === 1) {
                    this.infReturnToNormal = true
                    if (this.isStandErr) {
                        this.intTittle()
                    }
                }
            } else if (type === 'IposeDetectResult') {
                this.poseDetectResultHandler(data)
            }
        })
    },
    beforeDestroy() {
        // 停止音频
        // this.$emit('on-audio-event', 'playAudio', 'btnEffect')
        EventBus.$off('EventAction')
    },
    methods: {
        ...mapMutations([types.METE_TITLE]),
        // 设备引起得异常标题文案更新
        deviceErrorsHandler(val) {
            if (val) {
                this.METE_TITLE({
                    prev: this.$t('navigation-bar.ti-tai-ping-gu'),
                    title: this.$t('navigation-bar.ti-tai-ce-liang'),
                    leave: false,
                    align: '',
                    icon: undefined
                })
            }
        },
        intTittle() {
            window.logger.info('设置表头')
            this.METE_TITLE({
                prev: this.$t('navigation-bar.xiang-mu-xuan-ze'),
                title: this.$t('navigation-bar.ti-tai-ce-liang'),
                leave: true,
                align: '',
                icon: true
            })
        },
        initStep() {
            // 初始化标题
            this.intTittle()
            this.success = false
            this.timeout = false
            this.error = false
            this.infTipAudioEnded = true
            this.infReturnToNormal = true
            this.shapeErrors = []
            this.$nextTick(() => {
                // 倒计时组件重置时间 解决重新测量后倒计时不重置
                this.$refs.scanCutDown.init(30)
            })
            // 播放静态文件
            this.$emit('on-audio-event', 'playAudio', 'guideTurntable')
            // 发起体态ipose姿势检测
            this.$algClient.startIposeDetect()
        },
        // 音频播放
        playerAudio(data, type) {
            this.$emit('on-audio-event', 'playAudio', data, type)
        },
        // 按键事件
        btnClick(btnType) {
            console.log(btnType, !!this.$refs.shapeErrorCard)
            if (this.$refs.shapeErrorCard && this.$refs.shapeErrorCard.btnClick) {
                this.$refs.shapeErrorCard.btnClick(btnType)
            }
        },
        // 语音结束
        audioEndCallback(audioId) {
            window.logger.info('语音结束===========', audioId)
            if (audioId === 'guideTurntable') {
                if (!this.fail && !this.interfere) {
                    this.$emit('on-audio-event', 'playAudio', 'guideTurntable')
                }
            }
            // 多提醒语音
            if (audioId === 'shapeAroundPeople') {
                this.infTipAudioEnded = true
            }
        },
        poseDetectResultHandler(data) {
            // ipose检测成功
            if (data.detectResult === 1) {
                if (this.interfere) {
                    this.infReturnToNormal = true
                    // 姿势合法 主动关闭算法
                } else {
                    this.success = true
                    // 停止测量
                    this.$algClient.stopIposeDetect()
                    // 转台异常单独处理
                    const tableErrors = this.deviceErrors.filter((err) => {
                        return ['0011', '0012'].indexOf(err.title) > -1
                    })
                    // 有转台异常则直接关闭算法反馈失败
                    if (tableErrors.length === 0) {
                        // 跳转到测量过程
                        this.$changeViewPage('ShapeScan')
                    } else {
                        window.logger.info('转台异常')
                        this.shapeErrors.push(tableErrors[0])
                        this.error = true
                    }
                }
            }
        },
        scanErrorHandler(status) {
            window.logger.info('算法异常===========', status)
            switch (status) {
                case 1:
                    window.logger.info('启动识别硬件异常')
                    this.deviceErrorsHandler(true)
                    this.onDeviceError(status)
                    break
                case 2:
                    this.deviceErrorsHandler(true)
                    this.infReturnToNormal = false
                    this.infTipAudioEnded = false
                    this.isStandErr = true
                    // 播放多人提醒语音
                    this.$emit('on-audio-event', 'playAudio', 'shapeAroundPeople')
                    break
                case 3:
                    // this.deviceErrorsHandler()
                    window.logger.info('人离开')
                    this.leave = true
                    break
                default:
                    break
            }
        },
        // 体态硬件异常处理 3 深度相机硬件异常 4 深度相机同步线异常
        onDeviceError(code) {
            window.logger.info('体态启动异常，主动关闭算法')
            // 取消扫描，扫描过程中其他异常后发起，不上报图像路径 - 异常停止
            this.$algClient.stopIposeDetect()
            const error = algError.find((err) => {
                return err.id === code + 2
            })
            this.$store.commit('CHANGE_DEVICE_ERRORS', error)
            this.shapeErrors.push(error)
            this.error = true
        },
        // 引导倒计时结束 主动关闭算法
        onScanCutDownOver() {
            window.logger.info('体态启动倒计时结束，主动关闭算法')
            this.timeout = true
            // 关闭算法
            this.$algClient.stopIposeDetect()
            if (this.leave) {
                this.$changeViewPage('getReport')
            } else {
                window.logger.info('体态启动超时')
                // 启动超时
                const error = shapeFault.find((err) => {
                    return err.id === 1
                })
                this.shapeErrors.push(error)
            }
        },
        // 多人干扰倒计时结束
        onInterfereCutDownOver() {
            // 关闭算法
            this.$algClient.stopIposeDetect()
            // 返回首页
            this.$changeViewPage('getReport')
        },
        // 重新测量
        handleScanErrRescan() {
            this.initStep()
        }
    }
}
</script>
<style lang="less" scoped>
.guide {
    width: 100%;
    height: 100%;
    .content {
        position: absolute;
        width: 100%;
        height: 100%;
        text-align: center;
        .fade-png {
            width: 348px;
            height: 970px;
            position: relative;
            left: 0;
            right: 0;
            top: 416px;
        }
        .fade-png1 {
            width: 100%;
            // height: 970px;
            position: relative;
            left: 0;
            right: 0;
            // top: 416px;
        }
        // 多人干扰
        &.interfere {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            img {
                width: 888px;
                height: 837px;
                margin-top: 128px;
            }
            p {
                // margin: 0;
                font-size: 48px;
                font-family: OPPOSansR;
                font-weight: normal;
                color: #cccccc;
                line-height: 72px;
                margin: 96px 0 0 0;
                width: 880px;
                text-align: center;
            }
            .tip {
                margin: 82px 100px 0 100px;
                // max-width: 658px;
                text-align: center;
            }
        }
        video {
            width: 1080px;
        }
    }
    .bottom-msg {
        position: absolute;
        left: 0;
        bottom: 144px;
        width: 100%;
        .tip {
            li {
                max-width: 730px;
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
    }
}
</style>
