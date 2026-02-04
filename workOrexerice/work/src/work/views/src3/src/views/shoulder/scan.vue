<!--
 * @Description: 肩关节灵活度测量过程
 * @Author: fanzongru
 * @Date: 2021-01-27 10:38:46
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2025-08-15 13:55:59
-->
<template>
    <div class="main-container">
        <!-- <div style="position: absolute; top: 200px; z-index: 500">
            <button @click="goStep(1)">1</button>
            <button @click="posturalLeg(1, 0)">=2</button>
            <button @click="posturalLeg(1, 1)">3</button>
            <button @click="goStep(4)">4</button>
            <button @click="change(4)">5du</button>
            <button @click="change1(4)">25du</button>
            <button @click="nextScan()">另一项</button>
            <button @click="testStand(1)">合法性检测1</button>

            <button @click="nextItem()">下一项</button> -->
        <!-- <button @click="testAngle(0)">测试角度0</button>
            <button @click="testAngle(1, 160)">测试角度10</button>
            <button @click="testAngle(1, 30)">测试角度30</button>
            <button @click="testAngle(2, 150)">测试角度150</button>
            <button @click="testAngle(20, true)">测试右角度20</button>
            <button @click="testAngle(2, 60)">测试右角度60</button>
            <button @click="testAngle(4, 160)">测试右角度40</button>
            <button @click="scanOver()">结束</button> -->
        <!-- <button @click="personLeave()">人离开</button>
            <button @click="addError(2)">扫描</button>
            <button @click="addError(3)">启动超时</button>
            <button @click="addError(4)">测量超时</button>
            <button @click="addError(5)">导轨异常</button>
            <button @click="addError(6)">可重试</button>
            <button @click="addError(9)">核心控制</button> -->
        <!-- <button @click="handleTest(1)">left</button>
            <button @click="handleTest(2)">right</button>
        </div> -->

        <div v-if="!scanSuc && !scanFailed" class="shd-process">
            <!-- 视频演示 -->
            <div v-if="step < 3" class="scan-video">
                <!-- <video
                    :src="`media-file://video/shoulder/${$i18n.locale}/abductionUp.mp4`"
                    v-if="measureInfo.shoulder.active === 0"
                    name="外展上举左 / 右"
                    preload="auto"
                    autoplay
                    width="100%"
                >
                    您的浏览器不支持 video 标签。
                </video>
                <video
                    :src="`media-file://video/shoulder/${$i18n.locale}/antexionUp.mp4`"
                    v-if="measureInfo.shoulder.active === 1"
                    name="前屈上举左 / 右"
                    preload="auto"
                    autoplay
                    width="100%"
                >
                    您的浏览器不支持 video 标签。
                </video> -->
            </div>
            <!-- 启动测量默认图 -->
            <div v-if="step === 3" class="scan-image">
                <img v-if="!aroundPeople" src="@img/shoulder/abduction_default.png" alt="默认图" />
                <div v-else class="process-prompt">
                    <img src="@img/shoulder/prompt.png" alt="保持一米距离" />
                    <p class="tip">{{ $t('common.guide.interfere1') }}</p>
                    <!-- <p>{{ $t('common.guide.interfere2') }}</p> -->
                </div>
            </div>
            <!-- 测量过程 -->
            <div v-if="step === 4" class="scan-process">
                <!-- 导航 -->
                <div v-for="(item, key) in scanProcessRes" :key="key">
                    <div v-if="measureInfo.shoulder.active === key && isShowText" class="nav-container-out">
                        <!-- 颈椎前屈、后伸 -->
                        <div class="nav-container">
                            <div class="nav-main">
                                <div>
                                    <div class="nav-list">
                                        <p :class="{ 'nav-text': true, active: currentIndex >= 0 }">
                                            {{ item.first.title }}
                                        </p>
                                        <i class="iconfont icon-next"></i>
                                        <p :class="{ 'nav-text': true, active: currentIndex === 1 }">
                                            {{ item.second.title }}
                                        </p>
                                    </div>
                                    <div class="nav-edg">
                                        <p :class="{ 'edg-text': true, active: currentIndex >= 0 }">
                                            {{ angle1Show }}°
                                        </p>
                                        <p :class="{ 'edg-text': true, active: currentIndex === 1 }">
                                            {{ angle2Show }}°
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 测量动画 -->
                    <div v-if="measureInfo.shoulder.active === key" class="scan-animate">
                        <div v-if="transformStatus">
                            <img
                                :class="['positionDome1', item.first.type ? 'positionDome2' : '']"
                                v-if="currentIndex === 0"
                                :src="item.first.domeImage"
                                alt=""
                            />
                            <img
                                :class="['positionDome1', item.second.type ? 'positionDome2' : '']"
                                v-if="currentIndex === 1"
                                :src="item.second.domeImage"
                                alt=""
                            />
                        </div>
                        <!-- <div v-else> -->
                        <img v-if="currentIndex === 0" :src="item.first.mainImage" class="man-bg" alt="大图" />
                        <img
                            v-else-if="currentIndex === 1 && !scanStatus2"
                            :src="item.second.mainImage"
                            class="man-bg"
                            alt="大图"
                        />
                        <img v-else src="@img/shoulder/abduction_default.png" class="man-bg" alt="默认图" />
                        <!-- </div> -->
                        <div class="angle-container">
                            <div class="canvas-bg" v-if="angle1 > 20">
                                <canvas id="leftGuideLine" ref="leftGuideLine" width="1000" height="1000"></canvas>
                            </div>
                            <div
                                :style="{ transform: `rotate(${angle1}deg)` }"
                                class="guide-line left"
                                v-if="angle1 > 20"
                            >
                                <!-- <img v-if="showSuccess1" src="@img/shoulder/success.svg" :style="{'transform': `rotate(-${angle1}deg)`}" alt="测量成功提醒" /> -->
                                <!-- <span v-if="angle1 > 15" :style="{'transform': `rotate(-${angle1}deg)`}">{{angle1}}°</span> -->
                            </div>
                            <!-- <span v-if="angle1 > 0" class="left-val">{{angle1}}°</span> -->
                            <img
                                v-if="showSuccess1"
                                src="@img/shoulder/success.svg"
                                alt="测量成功提醒"
                                class="left-success"
                            />
                            <div class="guide-line center-left" v-if="angle1 > 20"></div>
                            <div v-if="currentIndex === 1 && angle2 > 20" class="guide-line center-right"></div>
                            <div
                                v-if="currentIndex === 1 && angle2 > 20"
                                :style="{ transform: `rotate(-${angle2}deg)` }"
                                class="guide-line right"
                            >
                                <!-- <img v-if="showSuccess2" :src="@img/shoulder/success.svg')" :style="{'transform': `rotate(${angle2}deg)`}" alt="测量成功提醒" /> -->
                                <!-- <span v-if="angle2 > 15" :style="{'transform': `rotate(${angle2}deg)`}">{{angle2}}°</span> -->
                            </div>
                            <!-- <span v-if="angle2 > 0 && currentIndex === 1" class="right-val">{{angle2}}°</span> -->
                            <img
                                v-if="showSuccess2"
                                src="@img/shoulder/success.svg"
                                alt="测量成功提醒"
                                class="right-success"
                            />
                            <div class="canvas-bg" v-if="angle2 > 20">
                                <canvas id="rightGuideLine" ref="rightGuideLine" width="1000" height="1000"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 倒计时 -->
            <div v-if="step === 5" class="scan-time-out">
                <p>{{ startNum }}</p>
            </div>
        </div>
        <div v-if="scanFailed" class="shd-process">
            <img src="@img/shoulder/scan_failed.svg" class="status-image-failed" alt="失败" />
        </div>
        <div v-else-if="scanSuc" class="shd-process">
            <img src="@img/shoulder/scan_success.svg" class="status-image-suc" alt="成功" />
        </div>

        <!-- 测量异常情况 -->
        <div v-if="scanFailed" class="info">
            <error-card
                key="scanErr"
                ref="shdErrorCard"
                :shdErrors="shdErrors"
                :errType="errType"
                :scanStep="step"
                :selectMode="gestureUsable ? 1 : 0"
                :title="title"
                @shoulder-end="shoulderType"
                @eventType="isTouchScreen"
                @scan-error-rescan="scanErrRescan"
                @scan-error-result="scanErrResult"
                @player-audio="playerAudio"
                @on-status="onStatus"
                :select="select"
            ></error-card>
        </div>
        <!-- 底部提醒 -->
        <div v-else class="info">
            <!-- 倒计时底部提醒 -->
            <msg-card v-if="step === 5">
                <ul slot="info-content" class="info-content">
                    <li>{{ $t('shoulder.countdown.bottom-msg') }}</li>
                </ul>
            </msg-card>
            <msg-card v-if="!scanSuc && step !== 5 && !aroundPeople" :class="{ 'guide-tip': tips.length > 1 }">
                <ul slot="info-content" v-for="(item, key) in tips" :key="key" class="info-content">
                    <li>{{ item }}</li>
                </ul>
            </msg-card>
            <!-- 成功tip -->
            <msg-card v-if="scanSuc" type="success">
                <div slot="success-content">
                    <p class="scan-card-title">{{ $t('shoulder.success.title') }}</p>
                    <div class="scan-item-list">
                        <div class="scan-item">
                            <img
                                v-if="measureInfo.shoulder.active < 1"
                                src="@img/shoulder/checkbox_default.svg"
                                alt="默认"
                            />
                            <img v-else src="@img/shoulder/checkbox_check.svg" alt="勾选" />
                            <p class="item-title">{{ $t('shoulder.success.item1') }}</p>
                        </div>
                        <div class="scan-item">
                            <img
                                v-if="measureInfo.shoulder.active < 2"
                                src="@img/shoulder/checkbox_default.svg"
                                alt="默认"
                            />
                            <img v-else src="@img/shoulder/checkbox_check.svg" alt="勾选" />
                            <p class="item-title">{{ $t('shoulder.success.item2') }}</p>
                        </div>
                    </div>
                </div>
            </msg-card>
        </div>
        <!-- 底部倒计时进度条 -->
        <cut-down-load
            ref="cutDown"
            v-if="!aroundPeople && step === 3 && cutdownStatus"
            :duration="30"
            @cut-down-over="goIndexPage"
            :suffixType="2"
            :type="1"
        ></cut-down-load>
        <cut-down-load
            ref="aroundPeopleCutDown"
            v-else-if="aroundPeople"
            @cut-down-over="goIndexPage"
            :duration="60"
            :suffixType="2"
        ></cut-down-load>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { shdFault, algError } from '@/config/error-reason'

import MsgCard from '@/components/MsgCard.vue'
import CutDownLoad from '@/components/CutDownLoad.vue'
import ErrorCard from './components/ErrorCard.vue'

import ImageAbductionLeft from '@img/shoulder/abduction_left.png'
import ImageAbductionRight from '@img/shoulder/abduction_right.png'
import ImageAntexionLeft from '@img/shoulder/antexion_left.png'
import ImageAntexionRight from '@img/shoulder/antexion_right.png'

import DomeAbductionLeft from '@img/shoulder/abductionUpleft.png'
import DomeAbductionRight from '@img/shoulder/abductionUpright.png'
import DomeAntexionUpleft from '@img/shoulder/antexionUpleft.png'
import DomeAntexionUpright from '@img/shoulder/antexionUpright.png'

import * as types from '@/store/mutation-types'
import { EventBus } from '@/util/event-bus'

export default {
    name: 'ShoulderScan',
    components: {
        MsgCard,
        ErrorCard,
        CutDownLoad
    },
    data() {
        return {
            clockTimer: null,
            clockNum: 0,
            // 步骤
            step: 0,
            // tip信息
            tips: [],
            // 当前测量项 如：颈椎前屈/颈椎后伸
            currentIndex: 0,
            // 正在测量项目
            scanIndex: 0,
            // 测量状态
            scanStatus1: false,
            scanStatus2: false,
            showSuccess1: false,
            showSuccess2: false,
            // 偏转角度 前 左
            angle1: 0,
            // 偏转角度 后 右
            angle2: 0,
            // 存储角度值
            angleList: [],
            // 定时检测
            secondTimer: null,
            secondNum: 0,

            stepTimer: null,
            stepNum: 0,
            // 测量成功
            scanSuc: false,
            // 测量失败
            scanFailed: false,
            // 测量失败类型 0无 1 启动测量超时 2 测量超时
            errType: 0,
            // 测量中图片及文案
            scanProcessRes: [
                {
                    first: {
                        title: this.$t('shoulder.nav-container1.first-title'),
                        mainImage: ImageAbductionLeft,
                        domeImage: DomeAbductionLeft,
                        value: 0,
                        type: 0
                    },
                    second: {
                        title: this.$t('shoulder.nav-container1.second-title'),
                        mainImage: ImageAbductionRight,
                        domeImage: DomeAbductionRight,
                        value: 0,
                        type: 0
                    }
                },
                {
                    first: {
                        title: this.$t('shoulder.nav-container2.first-title'),
                        mainImage: ImageAntexionLeft,
                        domeImage: DomeAntexionUpleft,
                        value: 0,
                        type: 1
                    },
                    second: {
                        title: this.$t('shoulder.nav-container2.second-title'),
                        mainImage: ImageAntexionRight,
                        domeImage: DomeAntexionUpright,
                        value: 0,
                        type: 1
                    }
                }
            ],
            // 启动倒计时
            startNum: 0,
            startTimer: null,
            // 周围是否站人
            aroundPeople: false,
            // 音频播放倒计时
            playerSettime: null,
            // 肩部异常
            shdErrors: [],
            select: 0,
            detectType: 0,
            cutdownStatus: true,
            // 是否显示文字
            isShowText: false
        }
    },
    computed: {
        ...mapGetters(['measureInfo', 'settingInfo', 'scanQueue', 'deviceUsable', 'deviceInfo']),
        title() {
            const MODE = {
                0: this.$t('navigation-bar.title4'),
                1: this.$t('navigation-bar.title5')
            }
            return MODE[this.measureInfo.shoulder.active]
            // if (this.step === 3) {
            //     return this.$t('navigation-bar.title6')
            // } else {
            //     return MODE[this.measureInfo.shoulder.active]
            // }
        },
        gestureUsable() {
            return this.settingInfo.gestureState === 1 && this.deviceUsable.gesture
        },
        transformStatus() {
            return (this.angle1 < 20 && this.currentIndex === 0) || (this.angle2 < 20 && this.currentIndex === 1)
        },
        // 偏转角度 前 左
        angle1Show() {
            return this.angle1 < 20 ? 0 : this.angle1
        },
        // 偏转角度 后 右
        angle2Show() {
            return this.angle2 < 20 ? 0 : this.angle2
        }
    },
    watch: {
        shdErrors(err) {
            if (err.length) {
                window.logger.info(`捕捉到肩部异常 ${JSON.stringify(err)}`)
                this.scanFailed = true
                // 停止播放
                this.$emit('on-audio-event', 'stopAudio')
                this.clearClockTimer()
                this.clearSecondTimer()
                this.clearStepTimer()
            }
        }
    },
    created() {
        this.$emit('player-audio', 'stopAudio')
        window.logger.info(`进入${this.title}测量`)
        window.logger.info(this.deviceUsable)
        // this.$store.commit(CHANGE_SETTING_INFO, {
        //     gestureState: 0
        // })
        this.$store.commit('CHANGE_MEASURE_INFO', {
            shoulder: { isMeasurement: true }
        })

        this.runClock()
        // 修改测量数组
        this.removeItems()
    },
    mounted() {
        // this.startNum = 3
        // // 开始倒计时
        // this.playerAudio('countDown')
        // this.aroundPeople = false
        // const ACTIVE = this.measureInfo.shoulder.active
        // //姿势合法性检测
        // this.posturalLeg(1, ACTIVE)

        EventBus.$on('EventAction', (type, data) => {
            window.logger.info('============', type, data)
            const ACTIVE = this.measureInfo.shoulder.active
            if (type === 'ShoulderLegalityResult') {
                //姿势合法性检测
                this.posturalLeg(data, ACTIVE)
            } else if (type === 'SurveyorStatus') {
                if (data === 1 && this.aroundPeople) {
                    this.aroundPeople = false
                    this.tips.push(this.$t('shoulder.countdown.bottom-msg1'))
                    this.METE_TITLE({ title: this.$t('navigation-bar.title6') })
                    this.playerAudio('shoulderStartEnter')
                } else if (data === 2) {
                    // 多人检测响应
                    this.isMutiPerson()
                } else if (data === 3) {
                    //人是否离开
                    this.isPersonLeave()
                }
            } else if (type === 'ScanError') {
                this.scanErrorHandler(data.errorStatus)
            } else if (type === 'shoulderDetectResult') {
                // 获取测量结果
                this.isMeasResult(data)
            }
        })
    },
    beforeDestroy() {
        EventBus.$off('EventAction')
        this.clearClockTimer()
        this.clearSecondTimer()
        this.clearStepTimer()
    },
    methods: {
        ...mapActions(['changeMeasureInfo']),
        change() {
            this.angle1 = 5
        },
        change1() {
            this.angle1 = 25
            console.log(this.angle1 < 10 && this.currentIndex === 0)
        },
        removeItems() {
            const unScanItems = this.measureInfo.unScanItems.filter((item) => item !== 4)
            this.changeMeasureInfo({
                active: 4,
                unScanItems
            })
        },
        onStatus(data) {
            this.cutdownStatus = data
        },
        // 触屏
        isTouchScreen(active) {
            this.select = active
            const setTimer = setInterval(() => {
                this.$refs.shdErrorCard.btnClick(3)
                window.clearInterval(setTimer)
            }, 300)
        },
        // 数据模拟
        testStand() {
            const resData = {
                detectType: 5,
                angle: 0,
                isReady: true,
                isMutiperson: false,
                isPersonLeave: false,
                status: true
            }
            // 触发全局事件
            EventBus.$emit('EventAction', 'ServiceStatus', {
                name: 'shoulder',
                data: resData
            })
        },
        testAngle(type, angle) {
            const resData = {
                detectType: type,
                angle: angle,
                isReady: true,
                isMutiperson: false,
                isPersonLeave: false,
                status: true
            }
            // 触发全局事件
            EventBus.$emit('EventAction', 'ServiceStatus', {
                name: 'shoulder',
                data: resData
            })
            if (type === 2 || type === 4) {
                this.paintGuideLine('rightGuideLine', angle, true)
            }
        },
        addError() {
            this.clearClockTimer()
            this.clearSecondTimer()
            this.clearStepTimer()
            this.$emit('on-audio-event', 'stopAudio')
            this.scanFailed = true
            // 添加进异常队列
            this.shdErrors.push(algError[1 + 1])
            this.$store.commit('ADD_DEVICE_ERROR', 3)
        },
        ...mapMutations([types.METE_TITLE]),
        posturalLeg(detectResult, ACTIVE) {
            window.logger.info('============posturalLeg', this.step)
            // 姿势合法性检测结果
            if (detectResult === 1) {
                if (this.step === 3) {
                    // 检测成功
                    this.step = 5
                    // 关闭姿势合法性检测
                    this.$algClient.stopShoulderLegalityDetect()
                    this.clearStepTimer()
                    this.clearSecondTimer()
                    this.scanProcessTips(6)
                    if (this.measureInfo.shoulder.active === 1) {
                        this.METE_TITLE({ title: this.$t('navigation-bar.title5') })
                    } else {
                        this.METE_TITLE({ title: this.$t('navigation-bar.title4') })
                    }
                    // this.METE_TITLE({ title: this.$t('navigation-bar.title6') })
                    this.startNum = 3
                    // 开始倒计时
                    this.playerAudio('countDown')
                    this.aroundPeople = false
                    switch (ACTIVE) {
                        case 0:
                            this.$algClient.startShoulderDetect(1)
                            this.runStartTimer(
                                () => {
                                    this.isShowText = false
                                    this.step = 4
                                    this.METE_TITLE({ title: '' })

                                    // 外展左启动测量引导
                                    this.playerAudio('shoulderAbductionLeftStart')
                                    setTimeout(() => {
                                        this.isShowText = true
                                    }, 10)
                                },
                                () => {
                                    // 外展左启动测量
                                    this.detectType = 1
                                    window.logger.info('启动外展左启动测量')
                                }
                            )
                            break
                        case 1:
                            setTimeout(() => {
                                this.$algClient.startShoulderDetect(3)
                            }, 2000)
                            this.runStartTimer(
                                () => {
                                    this.isShowText = false
                                    this.step = 4
                                    this.METE_TITLE({ title: '' })

                                    this.playerAudio('shoulderAntexionLeftStart')
                                    setTimeout(() => {
                                        this.isShowText = true
                                    }, 10)
                                },
                                () => {
                                    // 前屈左启动测量
                                    this.detectType = 3
                                    window.logger.info('启动前屈左启动测量')
                                }
                            )
                            break
                        default:
                            break
                    }
                }
            }
        },
        isPersonLeave() {
            // 针对在第一项测量成功过程中人离开处理
            if (this.scanProcessRes[0].second.value > 20) {
                if (this.scanStatus1 && this.scanStatus2) {
                    // this.clearSecondTimer()
                    this.clearStepTimer()
                    // 停止检测
                    this.$algClient.stopShoulderDetect(this.detectType)
                    this.isRightLegMeasure()
                }
            }
            window.logger.info('测量过程中人离开', shdFault[0])
            // 隐藏多人检测的倒计时
            this.aroundPeople = false
            // 测量过程中人离开
            this.clearClockTimer()
            this.clearSecondTimer()
            this.clearStepTimer()

            this.scanFailed = true
            // 处理
            this.shdErrors.push(shdFault[0])
        },
        isMutiPerson() {
            if (this.step !== 3) return
            window.logger.info('多人检测响应')
            this.clearStepTimer()

            this.tips = []
            this.aroundPeople = true
            // 重置倒计时组件
            this.$refs.cutDown.init(30)
            // 播放周围有人提醒
            this.playerAudio('shapeAroundPeople')
            const MODE = {
                0: this.$t('navigation-bar.title4'),
                1: this.$t('navigation-bar.title5')
            }
            this.METE_TITLE({ title: MODE[this.measureInfo.shoulder.active] })
        },
        scanErrorHandler(status) {
            // 硬件异常处理
            if (status === 1) {
                // 防止出现多个异常
                if (this.scanFailed || this.shdErrors.find((item) => item.title === '0007')) {
                    return
                }
                this.clearClockTimer()
                this.clearSecondTimer()
                this.clearStepTimer()
                this.scanFailed = true
                this.shdErrors.push(algError[1 + status])
                this.shoulderEnd()
            }
        },
        isRightLegMeasure() {
            if (this.step !== 5 && this.step !== 3) {
                if (this.measureInfo.shoulder.active < 1) {
                    if (this.currentIndex === 1 && !this.scanStatus2) {
                        // 外展右启动测量
                        this.detectType = 2
                        this.$algClient.startShoulderDetect(2)
                        window.logger.info('启动外展右启动测量')
                    } else {
                        // 下一项
                        this.nextItem()
                    }
                } else {
                    if (this.currentIndex === 1 && !this.scanStatus2) {
                        // 前屈右启动测量
                        this.detectType = 4
                        this.$algClient.startShoulderDetect(4)
                        window.logger.info('启动前屈右启动测量')
                    } else {
                        this.scanOver()
                    }
                }
            }
        },
        //   测量完成响应处理
        onSentRes() {
            // 两项都测量完成跳转继续测量项目页面
            if (this.measureInfo.shoulder.active === 2) {
                this.$changeViewPage(this.deviceInfo.operationMode === 1 ? 'TouchContinue' : 'GestureContinue')
            } else {
                // 只有一项测量成功时跳转到扫码页面
                this.$changeViewPage('getReport')
            }
        },
        isMeasResult(data) {
            if (data.detectType) {
                this.scanIndex = data.detectType
            }
            // 当前测量失败，不处理检测结果
            if (this.scanFailed) {
                window.logger.info('当前测量失败或超时，不处理肩部检测返回')
                return
            }
            // 偏转角度
            if (!this.scanStatus1 || !this.scanStatus2) {
                if (!this.scanStatus1 && data.angle > 0 && [1, 3].includes(data.detectType)) {
                    this.angle1 = data.angle.toFixed(1)
                    this.paintGuideLine('leftGuideLine', this.angle1, false)

                    // 判断是否成功
                    this.chargeScanSuc(data.detectResult)
                }
                if (this.currentIndex === 0) {
                    // 开启测量第一项，用户测量第二项，数据废弃
                    return
                }
                // 偏转角度
                if (!this.scanStatus2 && data.angle > 0 && [2, 4].includes(data.detectType)) {
                    this.angle2 = data.angle.toFixed(1)
                    this.paintGuideLine('rightGuideLine', this.angle2, true)

                    // 判断是否成功
                    this.chargeScanSuc(data.detectResult)
                }
            }
        },
        goIndexPage() {
            //  取消肩部检测
            this.$algClient.stopShoulderLegalityDetect()
            this.$algClient.stopShoulderDetect(this.detectType)
            this.$changeViewPage('getReport')
        },
        // 测试方法
        goStep(step) {
            this.clearClockTimer()
            this.step = step
        },
        // 另一个测量
        nextScan() {
            this.currentIndex = 1
        },
        // 下一个测量项
        nextItem() {
            // 停止音频
            this.$emit('on-audio-event', 'stopAudio')
            this.clearClockTimer()
            this.resetData()
            this.runClock()
            this.$store.commit('CHANGE_NUMBER', true)
        },
        // 测量结束
        scanOver() {
            this.resetData()
            this.clearClockTimer()
            this.clearSecondTimer()
            this.clearStepTimer()
            this.scanSuc = true
            this.METE_TITLE({ title: this.$t('navigation-bar.title6') })
            this.playerAudio('shoulderScanResult')
        },
        // 角度需要转化成弧度公式
        angleToRadian(angle) {
            return (Math.PI / 180) * angle
        },
        // 绘制虚线弧度
        // way true第一个 false第二个
        paintGuideLine(id, angle, way, color = '#fff') {
            let cvs = this.$refs[id]
            if (!cvs || !cvs.length) {
                return
            }
            let ctx = cvs[0].getContext('2d')
            let tansAngle = 0
            // 清空画布
            cvs[0].height = parseFloat(cvs[0].height)
            //      画弧
            //  ctx.arc( 圆心x轴坐标，圆心y轴坐标，半径, 起点弧度，结束点弧度，是否逆时针画(可选) )
            //    顺时针画一半圆弧
            if (way) {
                tansAngle = 90 - parseFloat(angle)
                // console.log('AAAAAAAAAAAAAAAAA 绘制角度 angle: ', tansAngle)
                ctx.moveTo(577, 350)
                ctx.arc(577, 350, 300, this.angleToRadian(90), this.angleToRadian(tansAngle), way)
            } else {
                tansAngle = 90 + parseFloat(angle)
                // console.log('AAAAAAAAAAAAAAAAA 绘制角度 angle: ', tansAngle)
                ctx.moveTo(423, 350)
                ctx.arc(423, 350, 300, this.angleToRadian(90), this.angleToRadian(tansAngle), way)
            }
            ctx.lineWidth = 3
            ctx.strokeStyle = '#fff'
            ctx.setLineDash([18, 18])
            ctx.stroke()

            ctx.fill()
            // 添加圆形背景 及遮罩处理
            ctx.globalCompositeOperation = 'source-in'
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(500, 350, 258, 180, 0, true)
            ctx.lineWidth = 6
            ctx.setLineDash([18, 18])
            ctx.strokeStyle = '#fff'
            ctx.stroke()
            ctx.fill()
            ctx.closePath()
        },
        // 初始化标题 tip
        initData() {
            const ACTIVE = this.measureInfo.shoulder.active
            this.showBottomTip(ACTIVE, 0)
            this.METE_TITLE({ title: this.title })
        },
        // 清除定时器
        clearClockTimer() {
            if (this.clockTimer) {
                clearInterval(this.clockTimer)
            }
        },
        // 清除5s定时器
        clearSecondTimer() {
            if (this.secondTimer) {
                clearInterval(this.secondTimer)
            }
        },
        clearStepTimer() {
            if (this.stepTimer) {
                clearInterval(this.stepTimer)
            }
        },
        // 清楚321倒计时
        clearStartTimer() {
            if (this.startTimer) {
                clearInterval(this.startTimer)
            }
        },
        // fn 倒计时0执行； fun 倒计时1执行
        runStartTimer(fn, fun) {
            this.clearStartTimer()
            window.logger.info('开始321倒计时')
            this.startTimer = setInterval(() => {
                this.startNum--
                if (this.startNum === 0) {
                    fn()
                } else if (this.startNum === 1) {
                    fun()
                }
            }, 1000)
        },
        // 启动计时器
        runClock() {
            this.clearClockTimer()
            const ACTIVE = this.measureInfo.shoulder.active
            this.initData()
            this.clockTimer = setInterval(() => {
                this.clockNum++

                const SECONDS = [0, 2, 8, 14]
                if (this.$i18n.locale === 'en' && ACTIVE === 1) {
                    SECONDS[3] = 17
                }
                if (this.$i18n.locale === 'tr' && ACTIVE === 1) {
                    SECONDS[3] = 21
                }
                if (SECONDS.indexOf(this.clockNum) > -1) {
                    this.showBottomTip(ACTIVE, ...SECONDS)
                }
            }, 1000)
        },
        // 测量超时 type 1 启动测量超时 2测量超时
        scanTimeoutError(type) {
            this.clearClockTimer()
            this.clearSecondTimer()
            this.clearStepTimer()
            this.scanFailed = true
            // 添加进异常队列
            this.shdErrors.push(shdFault[type])
            this.errType = type
        },
        // 启动5s定时
        runStepClock(second, fn) {
            this.clearStepTimer()
            this.stepNum = 0

            this.stepTimer = setInterval(() => {
                this.stepNum++
                if (this.stepNum === second && fn) {
                    fn()
                }
            }, 1000)
        },
        runSecondClock() {
            this.secondNum = 0
            this.clearSecondTimer()

            this.secondTimer = setInterval(() => {
                this.secondNum++
                // 5s
                if (this.secondNum === 5) {
                    // 测量中
                    // if (this.step === 4) {
                    //     this.getScanStandard()
                    // }
                } else if (this.secondNum === 20) {
                    if (this.step === 4) {
                        if (
                            this.currentIndex === 0 &&
                            !this.scanProcessRes[this.measureInfo.shoulder.active].first.value
                        ) {
                            // 异常
                            this.scanTimeoutError(2)
                        }
                        if (
                            this.currentIndex === 1 &&
                            !this.scanProcessRes[this.measureInfo.shoulder.active].second.value
                        ) {
                            // 异常
                            this.scanTimeoutError(2)
                        }
                    }
                } else if (this.secondNum > 20) {
                    this.clearSecondTimer()
                }
            }, 1000)
        },
        // 判断测量过程超时
        scanProcessTimeout() {
            if (this.step === 4) {
                if (this.currentIndex === 0 && !this.scanProcessRes[this.measureInfo.shoulder.active].first.value) {
                    // 异常
                    this.scanTimeoutError(2)
                }
                if (this.currentIndex === 1 && !this.scanProcessRes[this.measureInfo.shoulder.active].second.value) {
                    // 异常
                    this.scanTimeoutError(2)
                }
            }
        },
        // 根据step显示tips
        showBottomTip(type, ...seconds) {
            this.tips = []
            // 外展上举
            if (this.measureInfo.shoulder.active === 0) {
                if (seconds.length > 1) {
                    // if (this.clockNum === seconds[1]) {
                    //     // this.tips.push(this.$t('shoulder.bottom-tips1'))
                    //     this.tips.push(this.$t('shoulder.bottom-tips2'))
                    //     this.step = 1
                    // } else if (this.clockNum === seconds[2]) {
                    //     // this.tips.push(this.$t('shoulder.bottom-tips1'))
                    //     this.tips.push(this.$t('shoulder.bottom-tips3'))
                    //     this.step = 2
                    // } else if (this.clockNum === seconds[3]) {
                    //     this.tips.push(this.$t('shoulder.countdown.bottom-msg1'))
                    //     this.step = 3
                    //     // 动作演示结束后取消按钮显示
                    //     const pageInfo = {
                    //         btnList: []
                    //     }
                    //     this.$store.commit('CHANGE_PAGE_INFO', pageInfo)
                    //     // window.logger.info('>>>>>>>>>>>>>>开始执行 runSecondClock')
                    //     // this.runSecondClock()
                    // }
                    this.tips.push(this.$t('shoulder.countdown.bottom-msg1'))
                } else {
                    // step 0
                    if (this.clockNum === seconds[0]) {
                        this.tips.push(this.$t('shoulder.countdown.bottom-msg1'))
                        // this.tips.push(this.$t('shoulder.bottom-tips1'))
                        // this.tips.push(this.$t('shoulder.bottom-tips2'))
                        // this.step = 0
                        this.step = 3
                    }
                }
            } else if (this.measureInfo.shoulder.active === 1) {
                // 前屈上举
                if (seconds.length > 1) {
                    // if (this.clockNum === seconds[1]) {
                    //     // this.tips.push(this.$t('shoulder.bottom-tips1'))
                    //     this.tips.push(this.$t('shoulder.bottom-tips4'))
                    //     this.step = 1
                    // } else if (this.clockNum === seconds[2]) {
                    //     // this.tips.push(this.$t('shoulder.bottom-tips1'))
                    //     this.tips.push(this.$t('shoulder.bottom-tips5'))
                    //     this.step = 2
                    // } else if (this.clockNum === seconds[3]) {
                    //     this.tips.push(this.$t('shoulder.countdown.bottom-msg1'))
                    //     this.step = 3
                    //     // this.runSecondClock()
                    // }
                    this.tips.push(this.$t('shoulder.countdown.bottom-msg1'))
                } else {
                    // step 0
                    if (this.clockNum === seconds[0]) {
                        this.tips.push(this.$t('shoulder.bottom-tips1'))
                        // this.tips.push(this.$t('shoulder.bottom-tips4'))
                        // this.step = 0
                        this.step = 3
                    }
                }
            }

            // 即将启动测量
            if (this.step === 3) {
                if (this.measureInfo.shoulder.active === 1) {
                    this.METE_TITLE({ title: this.$t('navigation-bar.title5') })
                } else {
                    this.METE_TITLE({ title: this.$t('navigation-bar.title4') })
                }
                // this.METE_TITLE({ title: this.$t('navigation-bar.title6') })
                this.playerAudio('shoulderStartEnter')
                // 姿势合法性检测
                // handleStartDetectJFReq(4)
                this.clearClockTimer()
            }
        },
        // 测量中底部tip
        scanProcessTips(time = 6, type) {
            this.tips = []
            const ACTIVE = this.measureInfo.shoulder.active
            if (type) {
                console.log(type)
            } else {
                this.tips.push(this.$t('shoulder.bottom-tips1'))
            }

            console.log(ACTIVE)
            let centent = setTimeout(() => {
                this.tips = []
                window.clearTimeout(centent)
                if (ACTIVE === 0) {
                    if (this.currentIndex === 0) {
                        this.tips.push(this.$t('shoulder.bottom-tips2'))
                    } else {
                        this.tips.push(this.$t('shoulder.bottom-tips3'))
                    }
                } else if (ACTIVE === 1) {
                    if (this.currentIndex === 0) {
                        this.tips.push(this.$t('shoulder.bottom-tips4'))
                    } else {
                        this.tips.push(this.$t('shoulder.bottom-tips5'))
                    }
                }
            }, time * 1000)
        },
        // 清空重置数据
        // type 0默认开启  1异常重试
        resetData(type = 0) {
            this.currentIndex = 0
            this.step = 3
            this.clockNum = 0
            this.scanFailed = false
            this.scanStatus1 = false
            this.scanStatus2 = false
            this.angleList.length = 0
            this.resetProcessData()

            let shoulderActive = type ? this.measureInfo.shoulder.active : this.measureInfo.shoulder.active + 1
            // 判断测量队列是否有
            this.$store.commit('CHANGE_MEASURE_INFO', {
                shoulder: {
                    active: shoulderActive
                }
            })
            // this.$store.commit('CHANGE_SCAN_QUEUE', this.measureInfo)
        },
        // 判断测量中5s语音
        playProcessAudio() {
            this.clearStepTimer()
            if (this.measureInfo.shoulder.active === 0) {
                if (this.currentIndex === 0) {
                    this.playerAudio('getQrcodeFail')
                } else {
                    this.playerAudio('printByQrcode')
                }
            } else if (this.measureInfo.shoulder.active === 1) {
                if (this.currentIndex === 0) {
                    // 暂无语音 后续补充
                    // events.emit('playAudio', 77)
                } else {
                    // 暂无语音 后续补充
                    // events.emit('playAudio', 78)
                }
            } else if (this.measureInfo.shoulder.active === 2) {
                if (this.currentIndex === 0) {
                    // 暂无语音 后续补充
                    // events.emit('playAudio', 82)
                } else {
                    // 暂无语音 后续补充
                    // events.emit('playAudio', 83)
                }
            }
            this.resetProcessData(1)
        },
        // 测量数据归零
        // type 0  全部清，  1 当前测量
        resetProcessData(type = 0) {
            window.logger.info('数据重置！！', type)
            if (type === 0) {
                this.angle1 = 0
                this.angle2 = 0
            } else {
                if (this.currentIndex === 0) {
                    this.angle1 = 0
                } else {
                    this.angle2 = 0
                }
            }

            this.aroundPeople = false
            this.paintGuideLine('leftGuideLine', 0, true)
            this.paintGuideLine('rightGuideLine', 0, false)
        },
        // 记录测量结果
        saveShdData() {
            const ACTIVE = this.measureInfo.shoulder.active
            this.clearStepTimer()
            this.clearSecondTimer()
            if (this.scanStatus1 && this.scanStatus2) {
                this.scanProcessRes[ACTIVE].second.value = parseFloat(this.angle2)
            } else {
                this.scanProcessRes[ACTIVE].first.value = parseFloat(this.angle1)
            }
        },
        // 判断测量成功
        chargeScanSuc(detectResult) {
            // 判断方向反
            if (this.scanStatus1 && this.currentIndex === 0 && this.angle1 > 15) {
                // 提示
                // this.playProcessAudio()
                // this.resetProcessData()
                return
            }
            if (this.scanStatus2 && this.currentIndex === 1 && this.angle2 > 20) {
                // 提示
                // this.playProcessAudio()
                // this.resetProcessData()
                return
            }
            // 有最大值
            if (this.angle1 > 0 && !this.scanStatus1 && this.currentIndex === 0 && detectResult) {
                this.currentIndex = 1
                this.scanStatus1 = true
                this.showSuccess1 = true
                const showSuccess1Timer = setTimeout(() => {
                    this.showSuccess1 = false
                    clearTimeout(showSuccess1Timer)
                }, 3000)
                // 最大角度改由算法判断，detectResult为true时就是最大值
                // 取倒数第三条数据为最大值
                // this.angle1 = this.angleList.slice(-3)[0]
                this.saveShdData()

                this.playFirstAudio()
                this.scanProcessTips(4)
                // 停止算法
                this.$algClient.stopShoulderDetect(this.detectType)
                this.isRightLegMeasure()
                window.logger.info('获取到第一项最大值', this.scanIndex)
                this.paintGuideLine('leftGuideLine', this.angle1, false, 'grey')
                // this.runSecondClock()
            }
            if (this.angle2 > 0 && !this.scanStatus2 && this.currentIndex === 1 && detectResult) {
                this.scanStatus2 = true
                this.showSuccess2 = true
                const showSuccess2Timer = setTimeout(() => {
                    this.showSuccess2 = false
                    clearTimeout(showSuccess2Timer)
                }, 3000)
                // 最大角度改由算法判断，detectResult为true时就是最大值
                // this.angle2 = this.angleList.slice(-3)[0]
                this.saveShdData()
                // events.emit('playAudio', 73)
                this.playSecondAudio()
                window.logger.info('获取到第二项最大值', this.scanIndex)
                //  修改肩部测量状态
                const measureInfo = {
                    shoulder: {
                        status: true
                    }
                }
                this.changeMeasureInfo(measureInfo)
            }
        },
        // 播放第一个测量项语音
        playFirstAudio() {
            const ACTIVE = this.measureInfo.shoulder.active
            switch (ACTIVE) {
                case 0:
                    this.playerAudio('shoulderAbductionRightStart')
                    break
                case 1:
                    this.playerAudio('shoulderAntexionRightStart')
                    break
                default:
                    break
            }
        },
        // 播放第二个测量项语音
        playSecondAudio() {
            const ACTIVE = this.measureInfo.shoulder.active
            switch (ACTIVE) {
                case 0:
                    this.playerAudio('shoulderAbductionSuccess')
                    break
                case 1:
                    this.playerAudio('shapeFinish')
                    break
                default:
                    break
            }
        },
        // 判断角度合法性 及最大值
        getTopAngle(angle, isFirst) {
            let topAngle = 0
            // 取后5位
            const angleLength = 5
            // 如果已经有值 不push
            if (isFirst && this.scanStatus1) {
                return topAngle
            }
            if (!isFirst && this.scanStatus2) {
                return topAngle
            }

            this.angleList.push(angle)

            if (this.angleList.length >= angleLength) {
                // 后5个
                let lastList = this.angleList.slice(-angleLength)
                let sortList = [...lastList]
                // 由大到小
                sortList.sort((a, b) => {
                    return b - a
                })
                // 递减
                if (lastList.toString() === sortList.toString()) {
                    // 差值8度内
                    if (lastList[0] - lastList[lastList.length - 1] < 8) {
                        topAngle = lastList[0]
                    }
                }
            }
            return topAngle
        },
        // 重新测量
        scanErrRescan() {
            this.cutdownStatus = true
            // 清空异常
            this.shdErrors = []
            this.$store.commit('CHANGE_PAGE_INFO', {
                btnList: []
            })
            this.$emit('on-audio-event', 'stopAudio')
            this.clearClockTimer()
            this.resetData(1)
            this.runClock()
            // 重置倒计时组件
            this.$refs.cutDown.init(18)
        },
        // 结束测量 扫码
        scanErrResult() {
            this.resetData(1)
            this.clearClockTimer()
            this.clearSecondTimer()
            this.clearStepTimer()
            this.scanSuc = true
            // 结束后取消按钮显示
            const pageInfo = {
                btnList: []
            }
            this.$store.commit('CHANGE_PAGE_INFO', pageInfo)
            this.playerAudio('shoulderScanResult')
        },
        // 音频播放
        playerAudio(data, type) {
            this.$emit('on-audio-event', 'playAudio', data, type)
        },
        // 按键事件
        btnClick(btnType) {
            if (this.$refs.shdErrorCard && this.$refs.shdErrorCard.btnClick) {
                this.$refs.shdErrorCard.btnClick(btnType)
                return
            }
            if (btnType === 3) {
                if (this.scanSuc) {
                    return
                }
                if ([0, 1, 2].indexOf(this.step) > -1 && !this.scanFailed) {
                    // 动作演示结束后取消按钮显示
                    const pageInfo = {
                        btnList: []
                    }
                    this.$store.commit('CHANGE_PAGE_INFO', pageInfo)
                    this.step = 3
                    this.tips = []
                    this.tips.push(this.$t('shoulder.countdown.bottom-msg1'))

                    this.METE_TITLE({ title: this.$t('navigation-bar.title6') })
                    this.playerAudio('shoulderStartEnter')
                    this.clearClockTimer()
                }
            }
        },
        // 语音结束
        audioEndCallback(audioId) {
            // 启动测量
            if (audioId === 'shoulderStartEnter') {
                // this.runSecondClock()
                // 姿势合法性检测
                this.$algClient.startShoulderLegalityDetect()
                this.runStepClock(5, () => {
                    this.playerAudio('shoulderStartEnter1')
                })
            } else if (audioId === 'shoulderStartEnter1') {
                // this.runSecondClock()
                // 姿势合法性检测
                if (this.$i18n.locale === 'fr') {
                    this.runStepClock(17, () => {
                        this.scanTimeoutError(1)
                    })
                } else if (this.$i18n.locale === 'zh') {
                    this.runStepClock(19, () => {
                        this.scanTimeoutError(1)
                    })
                } else {
                    this.runStepClock(18, () => {
                        this.scanTimeoutError(1)
                    })
                }
            } else if (audioId === 'shoulderAbductionLeftStart') {
                // 外展上举左启动测量
                // handleStartDetectJFReq(1)
                // this.runSecondClock()
                this.runStepClock(5, () => {
                    // 5s 后再次播放
                    this.playerAudio('shoulderAbductionLeftStart5s')
                    this.scanProcessTips(4)
                })
            } else if (audioId === 'shoulderAbductionLeftStart5s') {
                // 前屈启动测量
                // handleStartDetectJFReq(1)
                this.runStepClock(10, () => {
                    this.scanProcessTimeout()
                })
            } else if (audioId === 'shoulderAbductionRightStart5s') {
                // 异常 取消检测返回
                this.runStepClock(10, () => {
                    this.scanProcessTimeout()
                })
            } else if (audioId === 'getReportByCard') {
                // 测量成功
                if (this.scanStatus1 && this.scanStatus2) {
                    // this.clearSecondTimer()
                    this.clearStepTimer()
                    // 停止检测
                    this.$algClient.stopShoulderDetect(this.detectType)
                } else {
                    this.angleList = []
                    this.scanProcessTips(4, true)
                    // 重新发起5s定时
                    this.runStepClock(5, () => {
                        this.playerAudio(
                            this.measureInfo.shoulder.active === 0
                                ? 'printByQrcode'
                                : this.measureInfo.shoulder.active === 1
                                ? 78
                                : 83
                        )
                    })
                }
            } else if (audioId === 'shoulderAntexionLeftStart') {
                // 前屈左启动测量
                // handleStartDetectJFReq(2)
                this.runStepClock(5, () => {
                    this.playerAudio('shoulderAntexionLeftStart5s')
                    this.scanProcessTips(3)
                })
            } else if (audioId === 'shoulderAntexionLeftStart5s') {
                // 前屈左5秒后
                this.runStepClock(10, () => {
                    this.scanProcessTimeout()
                })
            } else if (audioId === 'shoulderAntexionRightStart5s') {
                // 右屈
                this.runStepClock(10, () => {
                    this.scanProcessTimeout()
                    this.scanProcessTips(4)
                })
            } else if (audioId === 'shoulderScanResult') {
                // 数据上报
                this.shoulderEnd()
                // 页面逻辑处理
                this.onSentRes()
            } else if (['shoulderAbductionRightStart', 'shoulderAntexionRightStart'].indexOf(audioId) > -1) {
                // 第一项测量成功
                this.angleList = []
                // this.scanProcessTips()
                // 重新发起5s定时
                this.runStepClock(5, () => {
                    this.scanProcessTips(3)
                    this.playerAudio(
                        this.measureInfo.shoulder.active === 0
                            ? 'shoulderAbductionRightStart5s'
                            : 'shoulderAntexionRightStart5s'
                    )
                })
            } else if (['shoulderAbductionSuccess', 'shapeFinish'].indexOf(audioId) > -1) {
                // 第二项测量成功
                if (this.scanStatus1 && this.scanStatus2) {
                    // this.clearSecondTimer()
                    this.clearStepTimer()
                    // 停止检测
                    this.$algClient.stopShoulderDetect(this.detectType)
                    this.isRightLegMeasure()
                }
            } else if (audioId === 'shutDownInUse' && this.step === 3) {
                // this.runSecondClock()
                // 姿势合法性检测
                this.$algClient.startShoulderLegalityDetect()
                this.runStepClock(5, () => {
                    this.playerAudio('shoulderStartEnter1')
                })
            }
        },
        // 判断测量类型
        shoulderType() {
            if (this.measureInfo.shoulder.active > 0) {
                this.shoulderEnd()
            }
        },
        // 测量结束时间
        shoulderEnd() {
            // 测量结束
            const scanTime = Date.parse(new Date())
            // 发送测量数据
            let scanInfo = {
                scanId: this.measureInfo.scanId,
                measureTime: scanTime / 1000,
                leftAbduction: -1,
                rightAbduction: -1,
                leftAntexion: -1,
                rightAntexion: -1
            }
            const abduction = {
                leftAbduction: this.getFinalResult(this.scanProcessRes[0].first.value),
                rightAbduction: this.getFinalResult(this.scanProcessRes[0].second.value)
            }
            const antexion = {
                leftAntexion: this.getFinalResult(this.scanProcessRes[1].first.value),
                rightAntexion: this.getFinalResult(this.scanProcessRes[1].second.value)
            }
            if (abduction.leftAbduction > 0 && abduction.rightAbduction > 0) {
                scanInfo = Object.assign(scanInfo, abduction)
            }
            if (antexion.leftAntexion > 0 && antexion.rightAntexion > 0) {
                scanInfo = Object.assign(scanInfo, antexion)
            }
            // 更新测量时间
            if (!this.measureInfo.scanTime) {
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    scanTime: scanTime,
                    shoulder: {
                        status: true,
                        composeStatus: 1
                    }
                })
            }
            // 上报肩关节灵活度数据
            this.$controlClient.shoulderResult(scanInfo)
        },
        // 获取最终测量结果
        getFinalResult(val) {
            if (val > 0) {
                return val
            } else {
                return -1
            }
        }
    }
}
</script>

<!-- Add "scoped"attribute to limit CSS to this component only -->
<style lang="less" type="text/css" scoped>
.main-container {
    .title {
        position: absolute;
        top: 200px;
        font-size: 64px;
        width: 100%;
        text-align: center;
        margin-top: -90px;
    }

    .shd-process {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        // height: calc(100% - 408px);

        &.mt-400 {
            margin-top: 400px;
        }

        .status-image-failed {
            width: 480px;
            height: 480px;
            position: absolute;
            top: 422px;
        }

        .status-image-suc {
            width: 528px;
            height: 528px;
            position: absolute;
            top: 442px;
        }

        .scan-video {
            display: flex;
            justify-content: center;
        }
    }

    .scan-process {
        // position: absolute;
        width: 100%;

        // 导航
        .nav-container-out {
            position: relative;
            display: flex;
            margin: 60px;
            top: 336px;
            background: none;
            border-radius: 32px;
            z-index: 1;

            .nav-container {
                position: relative;
                display: flex;
                border-radius: 32px;
                margin: 3px;
                background: none;
                align-items: center;
                justify-content: center;
                padding: 10px;
                width: 100%;

                img {
                    width: 130px;
                    height: 130px;
                }

                .nav-main {
                    // display: flex;
                    // flex-direction: column;
                    width: 100%;
                    padding: 36px 20px 12px 20px;

                    .nav-list {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        i {
                            font-size: 20px;
                        }

                        .nav-text {
                            margin: 0;
                            font-size: 48px;
                            color: #5e687b;
                            font-family: OPPOSansR;
                            flex: none !important;

                            &.active {
                                color: #fff;
                            }
                        }
                    }

                    .nav-edg {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-top: 30px;

                        p {
                            width: 40%;
                            text-align: center;
                        }

                        .edg-text {
                            margin: 0;
                            font-size: 48px;
                            color: #5e687b;
                            font-family: OPPOSansR;

                            &.active {
                                color: #0088ff;
                            }
                        }
                    }
                }
            }
        }

        // 演示动画
        .scan-animate {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            top: -186px;

            img {
                width: 1080px;
            }

            // .man-bg {
            //     margin-top: 466px;
            // }
            .positionDome1,
            positionDome2 {
                position: absolute;
                top: 468px;

                img {
                    width: 100%;
                }
            }

            .positionDome2 {
                top: 454px;
            }
        }
    }

    .scan-image {
        img {
            width: 100%;
            height: 100%;
        }

        .process-prompt {
            display: flex;
            width: 100%;
            margin-top: 454px;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            img {
                width: 888px;
                height: 837px;
            }

            p {
                margin: 0;
                font-size: 48px;
                font-family: OPPOSansR;
                font-weight: normal;
                color: #cccccc;
                line-height: 72px;
            }

            .tip {
                margin: 82px 100px 0 100px;
                // max-width: 658px;
                text-align: center;
            }
        }
    }

    .info {
        position: absolute;
        bottom: 150px;
        margin: auto;
        width: 100%;

        .guide-tip {
            ul:nth-last-child(1) {
                margin-bottom: -60px;
            }

            ul:nth-last-child(2) {
                margin-bottom: 24px;
            }

            li {
                max-width: 720px;
                margin-right: 50px;
            }
        }
    }

    .scan-card-title {
        // margin: 50px 50px 100px 50px !important;
        // font-size: 64px !important;
        // color: #fff !important;
        font-size: 64px !important;
        color: #fff !important;
        line-height: 96px !important;
        margin: 0 auto 64px !important;
    }

    .scan-item-list {
        // display: flex;
        // margin: 20px;
        // margin-bottom: -60px;
        justify-content: space-around;

        display: flex;
        // justify-content: center;
        // margin-bottom: 60px;

        .scan-item {
            display: flex;

            // align-items: center;
            // justify-content: center;
            img {
                width: 48px;
                height: 48px;
                margin-right: 24px;
            }

            .item-title {
                width: 264px;
                margin: 0;
                font-size: 36px;
                color: #ced7e0;
                text-align: left;
            }
        }
    }

    // 角度动画
    .angle-container {
        position: absolute;
        display: flex;
        justify-content: center;
        height: 860px;
        // overflow: hidden;
        width: 100%;
        // top: -35px;
    }

    .guide-line {
        position: absolute;
        border-left: 5px dashed #ef6b0c;
        height: 304px;
        transition: all 0.3s;
        top: 350px;
    }

    .guide-line.left {
        transform-origin: top;
        position: relative;
        left: -77px;

        span {
            position: absolute;
            bottom: 0;
        }

        img {
            position: absolute;
            width: 96px;
            bottom: -96px;
            right: -48px;
        }
    }

    .left-success {
        position: absolute;
        display: inline-block;
        width: 96px;
        height: 96px;
        top: 350px;
        left: -432px;
    }

    .guide-line.center-left {
        left: 460px;
    }

    .guide-line.center-right {
        right: 460px;
    }

    .guide-line.right {
        transform-origin: top;
        position: relative;
        right: -77px;

        span {
            position: absolute;
            bottom: 0;
            right: 0;
        }

        img {
            position: absolute;
            width: 96px;
            bottom: -96px;
            right: -48px;
        }
    }

    .right-success {
        position: absolute;
        width: 96px;
        height: 96px;
        top: 350px;
        right: -432px;
    }

    .sector.left {
        height: 600px;
        width: 600px;
        background: antiquewhite;
        border-radius: 50%;
        border: 2px dashed #fff;
        margin-top: 50px;
    }

    .canvas-bg {
        position: absolute;
    }

    .scan-time-out {
        display: flex;
        flex-direction: column;
        font-size: 36px;
        justify-content: center;
        z-index: 103;
        position: absolute;
        width: 100%;
        height: 700px;
        top: 500px;
        background-color: #000000;
        background: -webkit-radial-gradient(center center, circle, #1c2133, #000, #000);

        p {
            font-size: 560px;
            font-family: Akrobat-ExtraLight;
            font-weight: 200;
            line-height: 700px;
            text-align: center;
            position: absolute;
            margin: auto;
            width: 100%;
        }
    }

    .cut-down-container {
        position: fixed;
        bottom: 24px;
    }
}
</style>
