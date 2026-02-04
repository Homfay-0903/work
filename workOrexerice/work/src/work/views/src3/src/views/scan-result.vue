<!--
 * @Description: 测量结果
 * @Author: wangmingdong
 * @Date: 2019-09-06 17:30:16
 * @LastEditTime: 2026-01-30 15:53:56
 * @LastEditors: liyunfei 3090384495@qq.com
 -->
<template>
    <div class="scan-result">
        <div class="content">
            <div
                v-if="resultStatus === 1"
                :class="[{ or: deviceInfo.thirdBindType === 3 }, isOnlyWeight ? 'content-bg1' : 'content-bg']"
            >
                <span v-if="qrcodeStatus === -1" class="title">{{ $t('scan-result.qrcode.loading') }}</span>
                <span v-else-if="!scanTypeRes" class="title">{{ $t('scan-result.qrcode.load-failed') }}</span>
                <!-- 做国家化需要提取该文案 -->
                <span v-else-if="isOnlyWeight" class="title">{{ $t('scan-result.qrcode.title4') }}</span>
                <span v-else class="title">{{ qrCodeTitle }}</span>
                <img src="@img/scan_result/qrcode_bg.svg" class="qrcode-bg" alt="二维码背景" style="z-index: 1" />
                <div class="qrcode-box">
                    <div class="qr-bg" v-if="onlyWeight">
                        <div id="canvas"></div>
                    </div>
                    <!-- 扫码 -->
                    <template v-else-if="[0, 1, 3].indexOf(deviceInfo.thirdBindType) > -1">
                        <!-- 测量类型发送中 -->
                        <img
                            v-if="qrcodeStatus === -1"
                            src="@img/scan_result/qrcode_load.svg"
                            class="load"
                            alt="二维码加载"
                        />
                        <!-- 二维码失败 -->
                        <img
                            v-else-if="qrcodeStatus !== 0"
                            src="@img/scan_result/qrcode_failure.svg"
                            class="img-qrcode"
                            alt="二维码失败"
                            @touchstart="retryQRCode"
                        />

                        <transition v-else name="fade" mode="out-in" appear>
                            <div class="qrcode-container">
                                <img :src="qrcode.path" class="img-qrcode" alt="扫描二维码" />
                                <img
                                    v-if="deviceInfo.thirdBindType === 0 && deviceInfo.deviceType < 1"
                                    src="@img/scan_result/icon_wechat.png"
                                    class="icon-wechat"
                                    alt="微信图标"
                                />
                            </div>
                        </transition>
                        <p class="retry-txt" v-if="qrcodeStatus > 0" @touchstart="retryQRCode">点击重试</p>
                    </template>
                    <!-- 刷手环 -->
                    <template v-if="deviceInfo.thirdBindType === 2">
                        <!-- <img :src="qrcode.path" class="img-qrcode" alt="刷手环" /> -->
                        <!-- <img
                            :src="require(`@img/scan_result/${cardFail ? 'watch-failure' : 'watch'}.svg`)"
                            :class="{ 'watch-big-err': cardFail, 'watch-big': !cardFail }"
                            alt="刷手环"
                        /> -->
                    </template>
                </div>
                <!-- 扫码+手环 -->
                <div v-if="deviceInfo.thirdBindType === 3" class="or">
                    <div class="order">
                        <div class="line"></div>
                        <span class="txt">{{ $t('scan-result.or') }}</span>
                        <div class="line"></div>
                    </div>
                    <img
                        :src="require(`@img/scan_result/${cardFail ? 'watch-failure' : 'watch'}.svg`)"
                        :class="{ 'watch-err': cardFail, watch: !cardFail }"
                        alt="手环图标"
                    />
                    <p class="watch-txt">{{ $t('scan-result.card.get-result') }}</p>
                </div>
                <div v-if="settingInfo.deviceViewReport && qrcodeStatus === 0" class="countdown-top-title">
                    完成用户绑定后，设备端可直接查看报告
                </div>
                <!-- 倒计时 -->
                <div v-if="qrcodeStatus === 0" class="countdown-gray">
                    <div :style="{ width: countdownWeight + 'px' }" class="countdown-blue"></div>
                </div>
                <!-- 二维码失败提示 -->
                <div v-if="qrcodeStatus !== 0" class="qrcode-err-msg">
                    <div v-if="deviceInfo.thirdBindType === 3" class="err-line"></div>
                    <p v-if="qrcodeStatus === 1">{{ $t('scan-result.error.network') }}</p>
                    <p v-if="qrcodeStatus === 2">{{ $t('scan-result.error.api') }}</p>
                </div>
                <p v-if="qrcodeStatus === -1" class="countdown">
                    <i18n path="scan-result.load-down" tag="span">
                        <span class="num" place="num">{{ countdown }}</span>
                    </i18n>
                </p>
                <p v-else-if="qrcodeStatus === 1" class="countdown">
                    <i18n path="scan-result.countdown1" tag="span">
                        <span class="num" place="num">{{ countdown }}</span>
                        <span place="page">{{ jumpPage }}</span>
                    </i18n>
                </p>
                <p v-else class="countdown">
                    <i18n path="scan-result.countdown" tag="span">
                        <span class="num" place="num">{{ countdown }}</span>
                        <span place="page">{{ jumpPage }}</span>
                    </i18n>
                </p>
            </div>
            <div v-if="[2, 3].indexOf(resultStatus) > -1" :class="['result-content', $i18n.locale]">
                <div class="result-item">
                    <img src="@img/scan_result/result_suc.png" class="result-suc" alt />
                    <p class="animated fast fadeInUp">{{ successTitle }}</p>
                    <p class="result-msg animated fast fadeInUp">
                        <img src="@img/scan_result/view_report.svg" class="icon-check" alt />
                        {{ $t('scan-result.result.desc') }}
                    </p>
                </div>
            </div>
            <!-- 底部提醒 -->
            <div v-if="settingInfo.printMode !== 0" class="bottom-msg">
                <transition name="fade-move" mode="out-in" appear>
                    <key-select
                        v-if="resultStatus === 2"
                        :items="keySelectItems"
                        :select="select"
                        @on-key-feedback="confirmSelection"
                    ></key-select>
                    <!-- <msg-card key="print" :duration="30" v-if="resultStatus === 2">
                        <p slot="title" class="model-title">是否打印纸质报告？</p>
                        <p slot="info-content" class="info-content">
                            如需打印报告，请按屏幕下方的
                            <i class="iconfont icon-print"></i> 键
                        </p>
                        <div slot="info-content"></div>
                        <span slot="error-duration" class="duration">返回首页</span>
                    </msg-card> -->
                    <msg-card key="printed" v-if="resultStatus === 3">
                        <ul slot="info-content">
                            <!-- 未注册提醒 -->
                            <template v-if="isNewOne">
                                <li>{{ $t('scan-result.result.msg-card.new-user') }}</li>
                            </template>
                            <!-- 加入打印提醒 -->
                            <template v-else>
                                <li>{{ $t('scan-result.result.msg-card.print-added') }}</li>
                            </template>
                        </ul>
                    </msg-card>
                </transition>
                <cut-down-load
                    v-if="resultStatus === 2"
                    @cut-down-over="goIndexPage"
                    :duration="30"
                    :suffixType="1"
                ></cut-down-load>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import MsgCard from '@/components/MsgCard.vue'
import { EventBus } from '@/util/event-bus'
import KeySelect from '@/components/KeySelect.vue'
import CutDownLoad from '@/components/CutDownLoad.vue'
import { _getTimeZone } from '@/util'
import QRCodeStyling from 'qr-code-styling'
import CONFIG from '@/config/index'
import { getQRCode, createScanType } from '@/http/status-server-api'
export default {
    components: {
        MsgCard,
        KeySelect,
        CutDownLoad
    },
    data() {
        return {
            // 120s倒计时
            countdown: 5,
            // 打印选择倒计时
            printSelectCount: 30,
            // 打印完成倒计时
            printSuccessCount: 5,
            clockTimer: null,
            // 结果状态
            // 0 初始   1 二维码生成成功    2 扫码成功  3 打印提醒
            resultStatus: 1,
            // 是否为新用户
            isNewOne: false,
            qrCodeTitle: '',
            successTitle: '',
            // 刷手环状态
            cardFail: false,
            // 获取打印报告语音
            getReportAudioNum: 'getReportByThirdQrcode',
            // 扫码或刷手环语音
            successAudioNum: 'printByQrcode',
            // 二维码状态 -1 发送测量类型未返回 0 正常 1 网络错误 2 二维码接口请求地址错误
            qrcodeStatus: -1,
            // 跳转页面
            jumpPage: this.$t('navigation-bar.shou-ye'),
            // 是否打印
            isPrint: false,
            // 判断服务测量类型是否返回
            scanTypeRes: false,
            keySelectItems: [
                {
                    icon: 'printer',
                    content: this.$t('scan-result.result.key-select.da-yin-bao-gao'),
                    remarks: this.$t('scan-result.result.key-select.da-yin-bao-gao_desc')
                },
                {
                    icon: 'end',
                    content: this.$t('scan-result.result.key-select.qu-xiao-da-yin'),
                    remarks: this.$t('scan-result.result.key-select.qu-xiao-da-yin_desc')
                }
            ],
            select: 0,
            qrCode: {},
            onlyWeight: false
        }
    },
    computed: {
        ...mapGetters([
            'qrcode',
            'measureInfo',
            'deviceInfo',
            'external',
            'settingInfo',
            'scanQueue',
            'sucItemNum',
            'meteTitle'
        ]),
        countdownWeight() {
            if (this.countdown % 4 === 0) {
                return (this.countdown / 4 - 1) * 18 + 8
            } else {
                return ((this.countdown + 1) / 4 - 1) * 18 + 8 - 4
            }
        },
        isOnlyWeight() {
            // 通过measureInfo数据判断防止异常测量项导致的判断失效
            // return this.measureInfo.unScanItems.indexOf(1) === -1 && this.measureInfo.unScanItems.length === 3
            const weightState = this.measureInfo.weight.isMeasurement || false
            const massState = this.measureInfo.mass.isMeasurement || false
            const shapeState = this.measureInfo.shape.isMeasurement || false
            const girthState = (this.measureInfo.girth.isMeasurement && this.measureInfo.girth.status) || false
            const shoulder = this.measureInfo.shoulder.isMeasurement || false
            return (
                weightState && !massState && !shapeState && !girthState && !shoulder && this.deviceInfo.deviceType !== 3
            )
        },
        //  如果是va模式下测了无电流 问卷调查 的填了情况
        isAutoAddPrint() {
            return (
                this.measureInfo.weight.isMeasurement &&
                this.measureInfo.girth.isMeasurement &&
                this.measureInfo.girth.status &&
                (this.measureInfo.nutritionStatus === 4 || this.measureInfo.nutritionStatus === 5)
            )
        },
        // Vapro3非测量无电流营养分析
        notMesGirth() {
            return (
                !this.measureInfo.weight.isMeasurement &&
                !this.measureInfo.girth.isMeasurement &&
                !this.measureInfo.girth.status
            )
        }
    },
    created() {
        if (!this.sucItemNum) {
            // 返回首页
            this.$changeViewPage('Home')
            return
        }
        window.logger.info('第三方绑定类型', this.deviceInfo.thirdBindType)
        this.updateRouteNavPrev(1)
        if (this.deviceInfo.thirdBindType > 3) {
            window.logger.info('第三方绑定类型进入判断')
            this.$changeViewPage('IdentityCheck')
            return
        }
        // 开启了无体成分报告
        if (this.deviceInfo.deviceType === 5 && this.deviceInfo.noBodyCompositionReport) {
            this.$store.commit('CHANGE_MEASURE_INFO', {
                mass: {
                    status: false,
                    composeStatus: 1
                }
            })
        }

        // 设置标题
        this.title(this.deviceInfo.thirdBindType)
        // // 发送测量类型
        if (this.isOnlyWeight) {
            this.onlyWeight = true
            this.qrcodeStatus = 0
            this.countdown = 120
            this.scanTypeRes = true
            this.$emit('on-audio-event', 'playAudio', 'getReportByThirdQrcode1')
        } else {
            // 初始化二维码标题和文案
            this.getQrcodeInfo(true)
            this.sendScanType()
        }
        window.logger.info('体重测量', this.isOnlyWeight)
        // 开始倒计时
        this.countdownClock()
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: [
                {
                    btn: 'switch',
                    msg: '电源'
                }
            ]
        })
        // 重连流
        // this.$statusClient.notifyTaskStatus(this.deviceInfo.deviceId)
    },
    mounted() {
        // 监听控制服务事件
        // controlEventListener({ viewStage, data }) {
        //     if (viewStage === 69) {
        //         // 刷卡通知结果
        //         if (data.scanId === this.measureInfo.scanid) {
        //             if (data.bindResultType === 1) {
        //                 // 重置scanId 暂未用到
        //                 // handleResetScanIDReq()
        //                 if (this.successTitle === '') {
        //                     this.successTitle = this.$t('scan-result.result.card-title')
        //                     this.successAudioNum = 'printByCard'
        //                 }
        //             } else {
        //                 this.cardFail = true
        //                 this.$emit('on-audio-event', 'playAudio', 'getCardFail')
        //                 if (!this.deviceInfo.isNetConnect) {
        //                     this.jumpPage = this.$t('navigation-bar.wang-luo-yi-chang-ye')
        //                 }
        //             }
        //         }
        //     }
        // }
        EventBus.$on('EventAction', (type, data) => {
            if (type === 'NotifyTaskStatus') {
                // 本次测量结果
                if (data.scanInfo.scanId === this.measureInfo.scanId && data.streamType === 1) {
                    if (this.successTitle === '') {
                        this.successTitle = this.$t('scan-result.result.qrcode-title')
                        this.successAudioNum = 'getReportByCard_touch'
                    }
                    this.isNewOne = data.scanInfo.id !== '' ? false : true
                    // 根据手机号判断是否为新用户
                    const userInfo = {
                        isNewUser: this.isNewOne,
                        phoneNum: data.scanInfo.id
                    }
                    this.$store.commit('CHANGE_MEASURE_INFO', {
                        userInfo
                    })
                    // 判断打印模式
                    this.printModel()
                }
            } else if (type === 'CardSynthesis') {
                // 刷卡通知结果
                if (data.scanId === this.measureInfo.scanId) {
                    if (data.bindResultType === 1) {
                        window.logger.info(' 刷卡通知结果', JSON.stringify(data))
                        // 重置scanId 暂未用到
                        // handleResetScanIDReq()
                        if (this.successTitle === '') {
                            this.successTitle = this.$t('scan-result.result.card-title')
                            this.successAudioNum = 'printByCard'
                        }
                        // 判断打印模式
                        this.printModel()
                    } else {
                        this.cardFail = true
                        this.$emit('on-audio-event', 'playAudio', 'getCardFail')
                        if (!this.deviceInfo.isNetConnect) {
                            window.logger.info('刷卡通知结果', this.deviceInfo.isNetConnect)
                            this.jumpPage = this.$t('navigation-bar.wang-luo-yi-chang-ye')
                        }
                    }
                }
            }
        })
        this.qrCodeUrl()
    },
    beforeDestroy() {
        clearInterval(this.clockTimer)
        EventBus.$off('EventAction')
    },
    methods: {
        ...mapMutations(['METE_TITLE']),
        //  是否Vapro3的无电流营养分析
        isVapro3DeviceMode() {
            return (
                (this.deviceInfo.deviceType === 4 || this.deviceInfo.deviceType === 5) &&
                this.settingInfo.deviceMode === 1
            )
        },
        // 生成二维码
        qrCodeUrl() {
            this.qrCode = new QRCodeStyling({
                width: 354,
                height: 354,
                type: 'svg',
                data: `${CONFIG.QRWEIGHT}/weight?weight=${this.measureInfo.weight.weight.toFixed(2)}&date=${
                    new Date().getTime() / 1000
                }`,
                dotsOptions: {
                    color: '#000',
                    type: ''
                },
                backgroundOptions: {
                    color: ''
                },
                imageOptions: {
                    crossOrigin: 'anonymous'
                },
                cornersDotOptions: {
                    type: ''
                },
                cornersSquareOptions: {
                    type: ''
                }
            })
            this.qrCode.append(document.getElementById('canvas'))
        },
        // 判断打印模式
        printModel() {
            if (this.settingInfo.deviceViewReport) {
                // 跳转查看报告页面
                this.$changeViewPage('viewReport')
                return
            }
            if (this.settingInfo.printMode === 1 || this.settingInfo.printMode === 2) {
                // 如果打印机未就绪,并且设置自动打印或者手动打印，跳转未就绪页
                if (this.external.printer === 2) {
                    this.$changeViewPage('PrinterError')
                } else {
                    if (this.settingInfo.printMode === 2) {
                        this.nextStep(2)
                    } else {
                        // 如果打印机已就绪
                        this.nextStep(3)
                    }
                }
            } else {
                this.resultStatus = 2
                this.countdown = 3
                this.countdownClock()
            }
        },
        // currentScanInfo.weight &&
        //                     currentScanInfo.weight.status &&
        //                     currentScanInfo.girth &&
        //                     currentScanInfo.girth.status
        //                     ? 1
        //                     : 0,
        // 发送测量类型
        sendScanType() {
            let that = this
            let currentScanInfo = that.measureInfo
            let currentDeviceInfo = that.deviceInfo
            _getTimeZone().then((timeZone) => {
                window.logger.info('timeZone', timeZone)
                let mass =
                    currentDeviceInfo.deviceType === 3 && currentScanInfo.weight && currentScanInfo.weight.status
                        ? 1
                        : 0
                if (currentDeviceInfo.deviceType === 5) {
                    mass = currentScanInfo.mass && currentScanInfo.mass.status ? 1 : 0
                }
                //     this.$statusClient
                //         .createScanType(
                //             that.deviceInfo.deviceId,
                //             currentScanInfo.scanId,
                //             mass,
                //             currentScanInfo.shape && currentScanInfo.shape.status ? 1 : 0,
                //             currentScanInfo.girth && currentScanInfo.girth.status ? 1 : 0,
                //             currentScanInfo.shoulder.active > 0 ? 1 : 0,
                //             this.measureInfo.utc,
                //             timeZone,
                //             currentScanInfo.deviceMode,
                //             currentScanInfo.nutrition,
                //             this.measureInfo.height,
                //             this.settingInfo.beauty,
                //             this.measureInfo.weight.status ? 1 : 0,
                //             this.settingInfo.Athlete
                //         )
                //         .then((createScanTypeRes) => {
                //             this.scanTypeRes = true
                //             // 保存测量时间
                //             this.$store.commit('CHANGE_MEASURE_INFO', {
                //                 scanTime: createScanTypeRes.createTime * 1000,
                //                 createTime: createScanTypeRes.createTime + '000'
                //             })
                //             this.getQrcodeInfo()
                //             this.countdownClock()
                //         })
                // })
                createScanType({
                    scan_id: currentScanInfo.scanId,
                    device_id: that.deviceInfo.deviceId,
                    bia_measure: this.deviceInfo.noBodyCompositionReport ? 0 : mass,
                    eval_measure: currentScanInfo.shape && currentScanInfo.shape.status ? 1 : 0,
                    girth_measure: currentScanInfo.girth && currentScanInfo.girth.status ? 1 : 0,
                    shoulder_joint_eval: currentScanInfo.shoulder.active > 0 ? 1 : 0,
                    utc: this.measureInfo.utc,
                    time_zone: timeZone,
                    scan_mode: currentScanInfo.deviceMode === 1 ? 1 : 0,
                    nutrition: currentScanInfo.nutrition,
                    height: this.measureInfo.height,
                    beauty: this.settingInfo.beauty,
                    weight_measure: this.measureInfo.weight.status ? 1 : 0,
                    athlete: this.settingInfo.Athlete
                }).then((createScanTypeRes) => {
                    window.logger.info('createScanTypeRes', createScanTypeRes)
                    if (createScanTypeRes.data) {
                        this.scanTypeRes = true
                        // 保存测量时间
                        this.$store.commit('CHANGE_MEASURE_INFO', {
                            scanTime: createScanTypeRes.data.create_time * 1000,
                            createTime: createScanTypeRes.data.create_time + '000'
                        })
                        this.getQrcodeInfo()
                        this.countdownClock()
                    }
                })
            })
        },
        // 判断二维码文案和图片
        // isInit 初始化
        getQrcodeInfo(isInit) {
            // 如果此时还没有二维码或者网络连接中断
            window.logger.info(
                'getQrcodeInfo',
                this.qrcode.path,
                this.qrcode.status,
                this.deviceInfo.isNetConnect,
                isInit
            )
            if (!this.qrcode.path || !this.qrcode.status || !this.deviceInfo.isNetConnect) {
                if (this.deviceInfo.thirdBindType === 0) {
                    // 倒计时改为10秒
                    this.countdown = 10
                    // 二维码失败语音
                    this.getReportAudioNum = 'getQrcodeFail'
                    this.qrcodeStatus = 1
                    this.jumpPage = this.$t('navigation-bar.wang-luo-yi-chang-ye')
                    window.logger.info('测试jumpPage thirdBindType === 0')
                    this.updateRouteNavPrev('')
                } else if (this.deviceInfo.thirdBindType === 1) {
                    // 倒计时改为10秒
                    this.countdown = 10
                    // 二维码失败语音
                    this.getReportAudioNum = 'getQrcodeFail'
                    if (!this.deviceInfo.isNetConnect) {
                        this.qrcodeStatus = 1
                        this.jumpPage = this.$t('navigation-bar.wang-luo-yi-chang-ye')
                        window.logger.info('测试jumpPage thirdBindType === 1')
                        this.updateRouteNavPrev('')
                    } else {
                        this.qrcodeStatus = 2
                        this.updateRouteNavPrev(1)
                    }
                } else if (this.deviceInfo.thirdBindType === 3) {
                    this.updateRouteNavPrev(1)
                    if (!this.deviceInfo.isNetConnect) {
                        this.qrcodeStatus = 1
                        this.jumpPage = this.$t('navigation-bar.shou-ye')
                    } else {
                        this.qrcodeStatus = 2
                    }
                } else {
                    // 倒计时改为10秒
                    this.countdown = 10
                    // 二维码失败语音
                    this.getReportAudioNum = 'getQrcodeFail'
                    this.qrcodeStatus = 1
                    this.jumpPage = this.$t('navigation-bar.wang-luo-yi-chang-ye')
                    window.logger.info('测试jumpPage thirdBindType ===3333')
                    this.updateRouteNavPrev('')
                }
                // 播放语音
                this.$emit('on-audio-event', 'playAudio', this.getReportAudioNum)
            } else {
                if (isInit) {
                    this.qrcodeStatus = -1
                    this.countdown = 5
                } else {
                    this.qrcodeStatus = 0
                    this.countdown = this.settingInfo.deviceViewReport ? 360 : 120
                    // 播放语音
                    this.$emit('on-audio-event', 'playAudio', this.getReportAudioNum)
                }
            }
        },
        title(bindType) {
            switch (bindType) {
                case 0:
                    if (this.deviceInfo.deviceType > 0) {
                        this.qrCodeTitle = this.$t('scan-result.qrcode.title1')
                    } else {
                        this.qrCodeTitle = this.$t('scan-result.qrcode.title0')
                    }
                    this.getReportAudioNum = 'getReportByThirdQrcode'
                    break
                case 1:
                    this.qrCodeTitle = this.$t('scan-result.qrcode.title1')
                    this.getReportAudioNum = 'getReportByThirdQrcode'
                    break
                case 2:
                    this.qrCodeTitle = this.$t('scan-result.qrcode.title2')
                    this.getReportAudioNum = 'getReportByCard'
                    break
                case 3:
                    this.qrCodeTitle = this.$t('scan-result.qrcode.title3')
                    this.getReportAudioNum = 'getReportByQrcodeOrCard'
                    break
                default:
                    break
            }
        },
        // 清空定时器，并且移除当前测量数据并返回首页
        goIndexPage() {
            clearInterval(this.clockTimer)
            // 打印
            this.addPrint()
            window.logger.info('scan-result goIndexPage', this.jumpPage)
            if (this.jumpPage === this.$t('navigation-bar.shou-ye')) {
                // 返回首页
                this.updateRouteNavPrev(1)
                this.$changeViewPage('Home')
            } else {
                this.$changeViewPage('NetworkAnomaly')
            }
        },
        // 倒计时
        countdownClock() {
            if (this.clockTimer) {
                clearInterval(this.clockTimer)
            }

            this.clockTimer = setInterval(() => {
                this.countdown--
                if (this.countdown === 0) {
                    if (this.qrcodeStatus === -1) {
                        this.countdown = 10
                        // 二维码失败语音
                        this.getReportAudioNum = 'getQrcodeFail'
                        this.qrcodeStatus = 1
                        this.jumpPage = this.$t('navigation-bar.wang-luo-yi-chang-ye')
                        window.logger.info('测试jumpPage countdownClock')
                        this.updateRouteNavPrev('')
                        // 播放语音
                        this.$emit('on-audio-event', 'playAudio', this.getReportAudioNum)
                    } else {
                        this.goIndexPage()
                    }
                }
            }, 1000)
        },
        nextStep(step) {
            this.resultStatus = step
            if (this.resultStatus === 2) {
                this.$store.commit('CHANGE_PAGE_INFO', {
                    btnList: [
                        {
                            btn: 'switch',
                            msg: '电源'
                        },
                        {
                            btn: 'add',
                            msg: '加'
                        },
                        {
                            btn: 'sub',
                            msg: '减'
                        }
                    ]
                })
                clearInterval(this.clockTimer)
                // 播放扫码或者刷卡成功语音
                this.$emit('on-audio-event', 'playAudio', this.successAudioNum)
                this.countdown = 30
                this.countdownClock()
            } else if (this.resultStatus === 3) {
                clearInterval(this.clockTimer)
                if (this.isNewOne) {
                    // 播放新用户语音
                    this.$emit('on-audio-event', 'playAudio', 'addPrintNewUser')
                } else {
                    // 播放老用户语音
                    this.$emit('on-audio-event', 'playAudio', 'addPrintOldUser')
                }
                this.isPrint = true

                this.countdown = 5
                this.countdownClock()
            }
        },
        // 语音结束
        audioEndCallback(audioId) {
            if (audioId === 20) {
                // 返回首页
                this.$changeViewPage('Home')
            }
        },
        // 按键事件
        btnClick(btnType) {
            // 上
            if (btnType === 1) {
                if (this.select > 0) {
                    this.select = 0
                } else {
                    this.select = 1
                }
                // 下
            } else if (btnType === 2) {
                if (this.select < 1) {
                    this.select = 1
                } else {
                    this.select = 0
                }
            } else if (btnType === 3) {
                this.confirmSelection(this.select)
            } else if (btnType === 7) {
                // 返回首页
                this.goIndexPage()
            }
        },
        confirmSelection(select) {
            this.select = select
            setTimeout(() => {
                this.select = -1
                if (select === 0 && this.resultStatus === 2) {
                    // 无电流报告加入打印报告时推送电流时可打印 其他不影响
                    this.$store.commit('CHANGE_MEASURE_INFO', {
                        handleStatus: 1
                    })
                    this.nextStep(3)
                } else {
                    // 返回首页
                    if (this.resultStatus < 2) return
                    this.goIndexPage()
                }
            }, 200)
        },
        // 添加打印状态数据
        addPrint() {
            if (!this.isPrint) {
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    printType: 0
                })
            }
            // 添加打印队列
            this.$store.commit('PUSH_REPORT_LIST', this.resultStatus > 1)
        },
        // 动态更新路由的 meta.nav.prev
        updateRouteNavPrev(prevValue) {
            this.METE_TITLE({
                icon: prevValue ? true : undefined,
                prev: prevValue ? 'navigation-bar.shou-ye' : '',
                title: 'navigation-bar.huo-qu-ce-liang-bao-gao',
                align: 'center',
                leave: true
            })
        },
        retryQRCode() {
            this.qrcodeStatus = -1
            this.countdown = 10
            getQRCode({
                scan_id: this.measureInfo.scanId,
                device_id: this.deviceInfo.deviceId
            })
            // 设置标题
            this.title(this.deviceInfo.thirdBindType)
            // 初始化二维码标题和文案
            this.getQrcodeInfo(true)
            // 发送测量类型
            this.sendScanType()
            // 开始倒计时
            this.countdownClock()
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.qr-bg {
    position: absolute;
    background: #fff;
    padding: 10px 10px 0;

    #canvas {
        margin: auto;
    }
}

.scan-result {
    .content {
        width: 100%;

        .content-bg {
            background: #1f2429;
        }

        .content-bg,
        .content-bg1 {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 864px;
            height: 1074px;
            margin: 480px auto 0;

            .title {
                margin-top: 157px;
                font-size: 48px;
                font-family: OPPOSansR;
                font-weight: normal;
                color: rgba(255, 255, 255, 1);
                line-height: 72px;
            }

            .qrcode-bg {
                position: absolute;
                width: 645px;
                top: 274px;
                left: 96px;
            }

            .qrcode-box {
                position: absolute;
                top: 298px;
                width: 364px;
                height: 364px;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2;
                background-color: #fff;

                .img-qrcode {
                    width: 364px;
                }
                .load {
                    width: 128px;
                    -webkit-animation: spin 1s linear infinite;
                    -moz-animation: spin 1s linear infinite;
                    -o-animation: spin 1s linear infinite;
                    animation: spin 1s linear infinite;
                }

                .qrcode-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .icon-wechat {
                        position: absolute;
                        width: 106px;
                        left: 130px;
                    }
                }

                .watch-big {
                    width: 192px;
                }

                .watch-big-err {
                    width: 240px;
                }
                .retry-txt {
                    position: absolute;
                    bottom: -20px;
                    font-size: 48px;
                    font-family: OPPOSansR;
                    font-weight: normal;
                    color: #666666;
                }
            }

            .or {
                position: absolute;
                top: 743px;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;

                .order {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;

                    .line {
                        width: 174px;
                        height: 2px;
                        background: rgba(74, 74, 74, 1);
                    }

                    .txt {
                        width: 25px;
                        height: 48px;
                        margin: 0 20px;
                        font-size: 24px;
                        font-family: OPPOSansM;
                        font-weight: normal;
                        color: rgba(137, 143, 153, 1);
                        line-height: 48px;
                    }
                }

                .watch {
                    margin-top: 46px;
                    width: 96px;
                }

                .watch-err {
                    margin-top: 46px;
                    width: 120px;
                }

                .watch-txt {
                    margin-top: 24px;
                    font-size: 36px;
                    font-family: OPPOSansR;
                    font-weight: normal;
                    color: rgba(206, 215, 224, 1);
                    line-height: 48px;
                }
            }
            .countdown-top-title {
                position: absolute;
                bottom: 222px;
                width: 624px;
                height: 112px;
                font-size: 40px;
                color: #cccccc;
                text-align: center;
                line-height: 56px;
            }

            .countdown-gray {
                position: absolute;
                bottom: 162px;
                width: 530px;
                height: 24px;
                background-image: url('/img/scan_result/countdown_gray.svg');

                .countdown-blue {
                    position: relative;
                    // width: 50%;
                    height: 100%;
                    background-position: left;
                    background-repeat: no-repeat;
                    background-image: url('/img/scan_result/countdown_blue.svg');
                    background-size: auto 100%;
                    background-origin: border-box;
                    background-clip: border-box;
                    transition: all 0.2s linear;
                }
            }

            .qrcode-err-msg {
                position: absolute;
                bottom: 175px;
                width: 784px;
                text-align: center;
                // height: 96px;
                display: flex;
                flex-direction: column;
                align-items: center;

                .err-line {
                    width: 412px;
                    height: 2px;
                    background: #4a4a4a;
                    margin-bottom: 22px;
                }

                p {
                    font-size: 40px;
                    font-family: OPPOSansR;
                    font-weight: normal;
                    color: rgba(206, 215, 224, 1);
                    line-height: 53px;
                    margin: 0;
                }
            }

            .countdown {
                position: absolute;
                bottom: 87px;
                font-size: 32px;
                text-align: center;
                padding: 0;
                margin: 0;

                span {
                    font-size: 32px;
                    font-family: OPPOSansR;
                    font-weight: normal;
                    line-height: 48px;
                }

                .num {
                    color: #ff791f;
                }
            }

            &.or {
                height: 1314px;
            }
        }

        .content-bg1 {
            background-image: url('../assets/qrback.png');
            background-size: 100% 100%;
        }

        .result-content {
            position: relative;
            margin: 480px auto 0;
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

        .en,
        .de,
        .fr {
            .result-msg {
                width: 771px !important;
                text-align: left !important;
                text-indent: -1.5em;
                margin-left: 2em;
                padding-left: 150px !important;
            }
        }
        .it {
            .result-msg {
                text-align: center;
            }
        }

        .bottom-msg {
            position: absolute;
            bottom: 0px;
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
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
