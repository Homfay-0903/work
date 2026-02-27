<!--
 * @Description: 体围测量引导页
 * @Author: gaoyuanyuan
 * @Date: 2021-04-28 11:32:11
 * @LastEditors: liutq
 * @LastEditTime: 2026-01-06 23:36:40
-->
<template>
    <div class="guide">
        <!-- <button @click="isShutDown" style="position: absolute; z-index: 1000">APOSI检测</button> <br /> -->
        <!-- <button @click="isShut" style="position: absolute; z-index: 1000">缩小肩部</button>
        <button @click="isShut" style="position: absolute; z-index: 1000">多人干扰</button>
        <button @click="issuceess" style="position: absolute; z-index: 1000; left: 500px">识别成功</button> -->
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
                <!-- 姿势调整 -->
                <div v-else-if="adjustment">
                    <div class="content">
                        <transition name="fade" mode="in-out" out>
                            <!-- <video
                                key="tipOne"
                                :src="`media-file://video/girth/${$i18n.locale}/${
                                    adjustmentCode === 2 ? 'aposeRaise' : 'aposeFall'
                                }.mp4`"
                                name="体态引导"
                                autoplay
                                loop
                            >
                                您的浏览器不支持 video 标签。
                            </video> -->

                            <div :class="deviceInfo.teenagerIsOpen ? 'adjustment-box1' : 'adjustment-box'">
                                <img
                                    v-if="adjustmentCode === 2 && lineStatus"
                                    class="adjustment-img"
                                    :src="
                                        require(`@/assets/img/girth/aposeRaise${
                                            deviceInfo.teenagerIsOpen ? '_t' : ''
                                        }.png`)
                                    "
                                    alt=""
                                />
                                <img
                                    class="adjustment-img"
                                    v-if="adjustmentCode === 3 && lineStatus"
                                    :src="
                                        require(`@/assets/img/girth/aposeFall${
                                            deviceInfo.teenagerIsOpen ? '_t' : ''
                                        }.png`)
                                    "
                                    alt=""
                                />
                            </div>
                        </transition>
                        <!-- <div class="canvas-bg" v-if="leftAngle > 20">
                            <canvas
                                id="leftGuideLine"
                                ref="leftGuideLine"
                                width="1080"
                                height="1192"
                                style="background: transparent"
                            ></canvas>
                        </div>
                        <div class="canvas-bg" v-if="rightAngle > 20">
                            <canvas
                                id="rightGuideLine"
                                ref="rightGuideLine"
                                width="1080"
                                height="1192"
                                style="background: transparent"
                            ></canvas>
                        </div> -->
                    </div>
                    <!-- 底部提醒 -->
                    <div class="bottom-msg">
                        <transition name="fade-move" mode="out-in" appear>
                            <msg-card class="tip">
                                <ul slot="info-content">
                                    <li>
                                        {{
                                            adjustmentCode === 2
                                                ? $t('girth.guide.bottom-msg4')
                                                : $t('girth.guide.bottom-msg5')
                                        }}
                                    </li>
                                </ul>
                            </msg-card>
                        </transition>
                    </div>
                    <cut-down-load
                        ref="adjustmentCutDown"
                        @cut-down-over="onAdjustmentCutDownOver"
                        :duration="30"
                        :suffixType="2"
                    ></cut-down-load>
                </div>
                <template>
                    <div class="content" v-show="!interfere && !adjustment">
                        <transition name="fade" mode="in-out">
                            <div>
                                <!-- src="@img/girth/apose_success2.svg" -->
                                <img
                                    v-show="success"
                                    :src="
                                        require(`@img/girth/${
                                            deviceInfo.teenagerIsOpen ? 'apose_success_t.png' : 'apose_success2.svg'
                                        }`)
                                    "
                                    :class="deviceInfo.teenagerIsOpen ? 'success-apose1' : 'success-apose'"
                                    alt="apose检测成功"
                                />
                                <!-- ToDo: 缺图片 src="@/assets/img/girth/aposeGuide.jpg"-->
                                <img
                                    v-show="!success"
                                    :class="deviceInfo.teenagerIsOpen ? 'fade-png1' : 'fade-png'"
                                    :src="
                                        require(`@/assets/img/girth/aposeGuide${
                                            deviceInfo.teenagerIsOpen ? '_t' : ''
                                        }.jpg`)
                                    "
                                    alt=""
                                />
                            </div>
                        </transition>
                    </div>
                    <!-- 底部提醒 -->
                    <div class="bottom-msg" v-if="!interfere && !adjustment">
                        <transition name="fade-move" mode="out-in" appear>
                            <msg-card class="tip">
                                <ul slot="info-content">
                                    <li v-if="success">{{ $t('girth.guide.bottom-msg1') }}</li>
                                    <template v-else>
                                        <li>{{ $t('girth.guide.bottom-msg2') }}</li>
                                        <li>{{ $t('girth.guide.bottom-msg3') }}</li>
                                    </template>
                                </ul>
                            </msg-card>
                        </transition>
                    </div>
                    <cut-down-load
                        v-if="!interfere && !adjustment"
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
                    :scanType="1"
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
import ShapeErrorCard from '../shape/components/ErrorCard.vue'
import { EventBus } from '@/util/event-bus'
import * as types from '@/store/mutation-types'
export default {
    name: 'GirthGuide',
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
            // 多人干扰
            // interfere: false,
            // 姿势调整 0 默认 2 抬起双臂 3 放下双臂
            adjustmentCode: 0,
            // 是否人离开
            leave: false,
            // 体态异常
            shapeErrors: [],
            // 干扰语音播放完毕
            infTipAudioEnded: true,
            // 从多人干扰恢复正常
            infReturnToNormal: true,
            // 成功跳转计时器
            successTimer: null,
            // 视频是否播放完成
            videoEnded: false,
            // 解决耦合异常
            isReturn: false,
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
        // 测量失败 算法异常或人为超时
        fail() {
            return this.timeout || this.error
        },
        // 姿势调整
        adjustment() {
            return this.adjustmentCode !== 0 && this.videoEnded
        },
        // 多人干扰 干扰语音播放完毕 和 从干扰恢复正常 才算恢复 所以默认初始化为true
        interfere() {
            return !this.infTipAudioEnded || !this.infReturnToNormal
        }
    },
    beforeCreate() {
        // if (this.$route.query?.typeSort) {
        //     const type = this.$route.query?.typeSort
        //     // 禁止返回
        //     if (this.$route.meta.nav && this.$route.meta.nav.icon && type) {
        //         delete this.$route.meta.nav.icon // 删除 icon 属性
        //     }
        //     if (type == 3) {
        //         this.$route.meta.nav.prev = 'navigation-bar.wu-dian-liu'
        //     } else if (type == 1) {
        //         this.$route.meta.nav.prev = this.settingInfo.combineMeasureEnable
        //             ? '身体评估'
        //             : 'item-select.shen-ti-cheng-fen-ce-liang-wei-du'
        //     }
        // }
    },
    created() {
        // if (this.$route.query?.typeSort) {
        //     const type = this.$route.query?.typeSort
        //     // 禁止返回
        // }
        this.setMeteTitle(this.$route.query?.typeSort)
        // 修改扫描状态

        this.$emit('on-audio-event', 'stopAudio')
        this.$store.commit('CHANGE_SCAN_STATE', true)
        this.initStep()
        this.$store.commit('CHANGE_MEASURE_INFO', {
            girth: { isMeasured: true }
        })
    },
    mounted() {
        if (this.settingInfo.combineMeasureEnable && this.settingInfo.triMode) {
            window.logger.info('修复测量状态值')
            const devicePre = this.deviceInfo.deviceId.substring(0, 2)
            const isVE335 = ['38', '39'].includes(devicePre)
            this.$store.commit('CHANGE_MEASURE_INFO', {
                shape: { isMeasured: true },
                spine: { isMeasured: isVE335 || this.deviceInfo.spineReportEnabled }
            })
        }
        EventBus.$on('EventAction', (type, data) => {
            console.log(data)
            // pose检测和异常上报
            if (type === 'ScanError') {
                this.scanErrorHandler(data.errorStatus)
            } else if (type === 'SurveyorStatus') {
                if (data !== 1) {
                    this.scanErrorHandler(data)
                } else if (data === 1) {
                    this.infReturnToNormal = true
                    if (this.adjustmentCode === 2 && this.videoEnded) {
                        this.$emit('on-audio-event', 'playAudio', 'aposeRaise')
                    } else if (this.adjustmentCode === 3 && this.videoEnded) {
                        this.$emit('on-audio-event', 'playAudio', 'aposeFall')
                    }
                }
            } else if (type === 'AposeDetectResult') {
                this.poseDetectResultHandler(data)
            }
        })
        if (!this.adjustment && !this.fail) {
            // 播放引导语音 aposeStayStill_a
            this.$emit('on-audio-event', 'playAudio', 'aposeStayStill_a')
        }
    },
    beforeDestroy() {
        EventBus.$off('EventAction')
        clearTimeout(this.successTimer)
    },
    methods: {
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
                icon: true,
                isBackPre: true
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
            console.log(meteTitleParams, 88888)

            this.METE_TITLE(meteTitleParams)
        },
        isShutDown() {
            EventBus.$emit('EventAction', 'SurveyorStatus', 1)
            // EventBus.$emit('EventAction', 'ScanError', { errorStatus: 1 })
            // this.onDeviceError(1)
        },
        issuceess() {
            this.adjustmentCode = 0
            window.logger.info('姿势识别成功')
            this.success = true
        },
        isShut() {
            EventBus.$emit('EventAction', 'AposeDetectResult', { detectResult: 3 })
        },
        initStep() {
            this.isReturn = false
            this.success = false
            this.timeout = false
            this.error = false
            this.lineStatus = false
            this.infTipAudioEnded = true
            this.infReturnToNormal = true
            this.shapeErrors = []
            this.$nextTick(() => {
                // 倒计时组件重置时间 解决重新测量后倒计时不重置
                this.$refs.scanCutDown.init(30)
            })
            // 发起体围apose姿势检测
            this.$algClient.startAposeDetect()
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
            console.log(audioId, '====')
            // 多提醒语音
            if (audioId === 'shapeAroundPeople') {
                this.videoEnded = true
                this.infTipAudioEnded = true
            } else if (this.adjustmentCode === 3 && audioId === 'aposeFall') {
                this.changeStatus()
                this.$emit('on-audio-event', 'playAudio', 'aposeFall')
            } else if (this.adjustmentCode === 2 && audioId === 'aposeRaise') {
                this.changeStatus()
                this.$emit('on-audio-event', 'playAudio', 'aposeRaise')
            }
            if (audioId === 'aposeStayStill_a') {
                this.videoEnd()
            }
        },
        // 改变多人检测恢复正常状态
        changeStatus() {
            if (this.infReturnToNormal) {
                this.videoEnded = true
                this.infTipAudioEnded = true
            }
        },
        poseDetectResultHandler(data) {
            // ipose检测成功
            if (data.detectResult === 1) {
                this.isReturn = true
                // 多人干扰恢复
                // if (this.interfere) {
                //     this.infReturnToNormal = true
                // }
                // 姿势调整恢复
                if (this.adjustment) {
                    this.adjustmentCode = 0
                    window.logger.info('姿势调整成功')
                    this.poseDetectSuccessHandler()
                } else {
                    this.adjustmentCode = 0
                    window.logger.info('姿势识别成功')
                    this.poseDetectSuccessHandler()
                }
            } else if ([2, 3].indexOf(data.detectResult) > -1) {
                // 多人干扰恢复
                // if (this.interfere) {
                //     if (this.videoEnded) {
                //         this.infReturnToNormal = true
                //     }
                // }
                // 姿势调整恢复
                this.adjustmentCode = data.detectResult
                setTimeout(() => {
                    return (this.lineStatus = true)
                }, 1 * 300)
                if (this.adjustmentCode === 3 && this.videoEnded) {
                    this.$emit('on-audio-event', 'playAudio', 'aposeFall')
                } else if (this.adjustmentCode === 2 && this.videoEnded) {
                    this.$emit('on-audio-event', 'playAudio', 'aposeRaise')
                }
            }
        },
        // 姿势检测成功
        poseDetectSuccessHandler() {
            this.success = true
            // 播放识别成功音效
            this.$emit('on-audio-event', 'playAudio', 'gestureEffect', 2)
            // 停止检测
            this.$algClient.stopAposeDetect()
            // 转台异常单独处理
            const tableErrors = this.deviceErrors.filter((err) => {
                return ['0011', '0012'].indexOf(err.title) > -1
            })
            // 没有转台异常则发起检测
            if (tableErrors.length === 0) {
                this.successTimer = setTimeout(() => {
                    // 跳转到测量过程
                    this.$changeViewPage('GirthScan', { typeSort: this.$route.query.typeSort })
                }, 3 * 1000)
            } else {
                this.shapeErrors.push(tableErrors[0])
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
                    this.infReturnToNormal = false
                    this.infTipAudioEnded = false
                    // 播放多人提醒语音
                    this.$emit('on-audio-event', 'playAudio', 'shapeAroundPeople')
                    break
                case 3:
                    window.logger.info('人离开')
                    this.leave = true
                    break
                default:
                    break
            }
        },
        // 视频播放结束
        videoEnd() {
            window.logger.info('视频播放结束: ')
            this.videoEnded = true
            if (this.adjustment) {
                this.infReturnToNormal = true
                if (this.adjustmentCode === 3) {
                    this.$emit('on-audio-event', 'playAudio', 'aposeFall')
                } else if (this.adjustmentCode === 2) {
                    this.$emit('on-audio-event', 'playAudio', 'aposeRaise')
                }
            }
        },
        // 体态硬件异常处理 3 深度相机硬件异常 4 深度相机同步线异常
        onDeviceError(code) {
            window.logger.info('体围启动异常，主动关闭算法')
            // 取消扫描，扫描过程中其他异常后发起，不上报图像路径 - 异常停止
            this.$algClient.stopAposeDetect()

            const error = algError.find((err) => {
                return err.id === code + 2
            })
            this.$store.commit('CHANGE_DEVICE_ERRORS', error)
            this.shapeErrors.push(error)
            this.error = true
        },
        // 引导倒计时结束 主动关闭算法
        onScanCutDownOver() {
            if (this.isReturn) return
            window.logger.info('体围启动倒计时结束，主动关闭算法')
            this.timeout = true
            // 关闭算法
            this.$algClient.stopAposeDetect()
            if (this.leave) {
                this.$changeViewPage('getReport')
            } else {
                window.logger.info('体围启动超时')
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
            this.$algClient.stopAposeDetect()
            // 返回首页
            this.$changeViewPage('getReport')
        },
        // 姿势调整倒计时结束
        onAdjustmentCutDownOver() {
            // 关闭算法
            this.$algClient.stopAposeDetect()
            // 返回首页
            this.$changeViewPage('getReport')
        },
        // 重新测量
        handleScanErrRescan() {
            this.initStep()
        }
        // huizhiClick(type) {
        //     if (type === 1) {
        //         this.paintGuideLine('rightGuideLine', 30, false)
        //     } else {
        //         this.paintGuideLine('leftGuideLine', 30, true)
        //     }
        // },
        // processArmOpeningAngle(data) {
        //     window.logger.info('手臂角度', data)
        //     this.leftAngle = data.leftAngle
        //     this.rightAngle = data.rightAngle
        //     this.paintGuideLine('leftGuideLine', this.leftAngle, false)
        //     this.paintGuideLine('rightGuideLine', this.rightAngle, true)
        // },
        // 添加角度转弧度的方法
        // angleToRadian(angle) {
        //     return (angle * Math.PI) / 180
        // },
        // 绘制虚线弧度
        // way true第一个 false第二个
        // paintGuideLine(id, angle, way, color = '#fff') {
        //     console.log('开始绘制', { id, angle, way, color })
        //     let cvs = this.$refs[id]
        //     if (!cvs) {
        //         console.log('Canvas 元素不存在')
        //         return
        //     }
        //     let ctx = cvs.getContext('2d')
        //     if (!ctx) {
        //         console.log('无法获取 Canvas 上下文')
        //         return
        //     }

        //     // 清空画布
        //     ctx.clearRect(0, 0, cvs.width, cvs.height)

        //     // 画虚线弧
        //     // ctx.save()

        //     // 计算中心点和半径
        //     const centerY = 425
        //     const radius = 435
        //     const centerX = way ? 595 : 455 // way为true是左臂，false是右臂 要镜像 右传true 左传false

        //     // 计算起始角度和结束角度
        //     // const startAngle = this.angleToRadian(90) // 从90度开始
        //     const endAngle = way
        //         ? this.angleToRadian(90 - angle) // 左臂逆时针
        //         : this.angleToRadian(90 + angle) // 右臂顺时针

        //     // 1. 先画圆弧
        //     // ctx.beginPath()
        //     // ctx.setLineDash([8, 8]) // 虚线间距
        //     // ctx.lineWidth = 3
        //     // ctx.strokeStyle = '#ffffff'
        //     // ctx.moveTo(centerX + radius * Math.cos(startAngle), centerY + radius * Math.sin(startAngle))
        //     // ctx.arc(centerX, centerY, radius, startAngle, endAngle, way)
        //     // ctx.stroke()

        //     // 2. 画从圆心到圆弧的直线
        //     ctx.beginPath()
        //     ctx.setLineDash([8, 8]) // 实线
        //     ctx.lineWidth = 2
        //     ctx.strokeStyle = '#ffffff'
        //     // 从圆心到圆弧起点
        //     // ctx.moveTo(centerX, centerY)
        //     // ctx.lineTo(centerX + radius * Math.cos(startAngle), centerY + radius * Math.sin(startAngle))
        //     // 从圆心到圆弧终点
        //     ctx.moveTo(centerX, centerY)
        //     ctx.lineTo(centerX + radius * Math.cos(endAngle), centerY + radius * Math.sin(endAngle))
        //     ctx.stroke()

        //     // 在起点绘制一个圆
        //     ctx.beginPath()
        //     ctx.setLineDash([]) // 实线
        //     ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
        //     ctx.fillStyle = '#ffffff'
        //     ctx.stroke()

        //     // 3. 添加角度文本
        //     // ctx.font = '24px Arial'
        //     // ctx.fillStyle = '#ffffff'
        //     // const textX = centerX + (radius + 20) * Math.cos((startAngle + endAngle) / 2)
        //     // const textY = centerY + (radius + 20) * Math.sin((startAngle + endAngle) / 2)
        //     // ctx.fillText(`${angle}°`, textX, textY)

        //     ctx.restore()
        // }
    }
}
</script>
<style lang="less" scoped>
.guide {
    width: 1080px;
    height: 1920px;

    .content {
        position: relative;
        width: 1080px;
        height: 1920px;
        text-align: center;
        overflow: hidden;

        .success-apose,
        .success-apose1 {
            margin: 376px 0;
            width: 724px;
        }

        .fade-png,
        .fade-png1 {
            display: inline-block;
            margin-top: 71px;
            width: 888px;
            height: auto;
        }
        .fade-png1 {
            margin-top: 0px;
            // margin-top: 160px;
            width: 1080px;
        }
        .success-apose1 {
            margin: auto;
            margin-top: 428px;
            width: 1080px;
        }

        .adjustment-back {
            position: relative;
            top: 0;
            width: 100%;
            z-index: 1;
        }

        .adjustment-box,
        .adjustment-box1 {
            background-image: url('../../assets/img/girth/aposeBack@2x.jpg');
            width: 888px;
            height: 100vh;
            margin: 72px auto 0;

            // position: absolute;
            // top: 0;
            // right: 0;
            // left: 0;
            // bottom: 0;
            // margin: 0 auto;
            background-size: 100%, 100%;
            z-index: 0;

            .adjustment-img {
                position: absolute;
                width: 888px;
                top: 31%;
                left: calc(50% - 444px);
                z-index: 99;
                animation-delay: 2s;
                transition: all 2s;
            }
        }
        .adjustment-box1 {
            margin-top: 0px;
            width: 1080px;
            background-image: url('../../assets/img/girth/aposeGuide_t.jpg');
            .adjustment-img {
                position: absolute;
                width: 1080px;
                top: 30.88%;
                left: calc(50% - 540px);
                z-index: 99;
                animation-delay: 2s;
                transition: all 2s;
            }
        }

        .canvas-bg {
            position: absolute;
            // background: red;
            left: 0px;
            top: 200px;
            z-index: 200;

            canvas {
                background: transparent; // 确保背景透明
                display: block; // 防止 canvas 下方有空白
            }
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
    }
}
</style>
