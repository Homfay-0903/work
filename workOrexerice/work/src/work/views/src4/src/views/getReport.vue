<!--
 * @Description: 获取测量报告页
 * @Author: gaoyuanyuan
 * @Date: 2020-07-30 11:15:44
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2026-01-29 17:12:50
-->
<template>
    <div class="get-report">
        <div class="content" v-if="isShowDom">
            <div class="content-bg">
                <span class="scan-time"
                    >{{ $t('get-report.sao-miao-shi-jian') }} {{ scanTime ? scanTime : '...' }}</span
                >
                <span v-if="$i18n.locale === 'zh'" class="rept-id">{{
                    reptId ? `${$t('get-report.xu-hao')} ${reptId}` : '...'
                }}</span>
                <span v-else v-html="reptId ? $t('get-report.xu-hao') + reptId : '...'" class="rept-id en-rept"></span>
                <p
                    v-if="status !== 0 && !settingInfo.deviceViewReport"
                    v-html="$t('get-report.desc0')"
                    class="tips"
                ></p>
                <p v-if="settingInfo.deviceViewReport && status !== 0" class="tips">
                    联系工作人员完成用户绑定，设备端可直接查看报告
                </p>
                <!-- 网络异常 -->
                <div v-if="status === 0" class="loading-box">
                    <img :src="require('@/assets/img/qrcode_load.svg')" class="img-qrcode load" alt="加载中" />
                    <p class="networkTips">{{ $t('get-report.desc1') }}</p>
                </div>
                <!-- 倒计时进度条 -->
                <div v-if="status !== -1 && status !== 0" class="countdown-gray">
                    <div :style="{ width: countdownWeight + 'px' }" class="countdown-blue"></div>
                </div>
                <p class="countdown">
                    <!-- 网络异常倒计时 -->
                    <template v-if="status === 0">
                        <template>
                            <i18n class="p-num" path="common.error.count-down3" tag="span">
                                <span class="num" place="num"> {{ countdown }} </span>
                            </i18n>
                        </template>
                    </template>
                    <!-- 获取成功倒计时 -->
                    <template v-else-if="status === 1">
                        <template>
                            <i18n class="p-num" path="scan-result.countdown" tag="span">
                                <span class="num" place="num"> {{ countdown }} </span>
                            </i18n>
                        </template>
                    </template>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { EventBus } from '@/util/event-bus'
import { _getTimeZone } from '@/util'
export default {
    data() {
        return {
            // 扫描时间
            scanTime: '',
            // 报告序号
            reptId: '',
            // 30s倒计时
            countdown: 30,
            clockTimer: null,
            // 状态 -1 发送测量类型未返回 0 网络异常 1 网络正常且已获取到序号
            status: -1,
            listBug: true,
            // 状态通知服务是否正常上报
            scanTypeRes: false,
            // 等待状态通知服务时间
            time: 15,
            timer: null,
            // 是否显示本页面dom
            isShowDom: false
        }
    },
    computed: {
        countdownWeight() {
            return (this.countdown - 1) * 18 + 8
        },
        ...mapGetters({
            qrcode: 'qrcode',
            measureInfo: 'measureInfo',
            deviceInfo: 'deviceInfo',
            standPeople: 'standPeople',
            external: 'external',
            settingInfo: 'settingInfo',
            scanQueue: 'scanQueue',
            sucItemNum: 'sucItemNum',
            initMesInfo: 'initMesInfo'
        }),
        isOnlyWeight() {
            // 通过measureInfo数据判断防止异常测量项导致的判断失效
            // return this.measureInfo.unScanItems.indexOf(1) === -1 && this.measureInfo.unScanItems.length === 3
            const weightState = this.measureInfo.weight.isMeasurement || false
            const massState = this.measureInfo.mass.isMeasurement || false
            const shapeState = this.measureInfo.shape.isMeasurement || false
            const girthState = (this.measureInfo.girth.isMeasurement && this.measureInfo.girth.status) || false
            const shoulder = this.measureInfo.shoulder.isMeasurement || false
            return weightState && !massState && !shapeState && !girthState && !shoulder
        }
    },
    watch: {
        // 监听设备状态
        deviceInfo: {
            handler(val, oldVal) {
                if (val.isNetConnect === true && oldVal.isNetConnect === false) {
                    window.logger.info('获取报告页网络恢复')
                    if (this.status === 0) {
                        this.status = -1
                        // 发送测量类型
                        this.sendScanType()
                    }
                } else if (val.isNetConnect === false && oldVal.isNetConnect === true) {
                    window.logger.info('获取报告页网络断开')
                    if (this.status === -1) {
                        this.status = 0
                    }
                }
            },
            deep: true
        },
        status: {
            // eslint-disable-next-line no-unused-vars
            handler(val, oldVal) {
                if (val === 0 || val === 1) {
                    // 倒计时30s
                    if (this.settingInfo.deviceViewReport && this.status === 1) {
                        this.countdown = 360
                    } else {
                        this.countdown = 30
                    }
                    this.countdownClock()
                }
            },
            deep: true
        }
    },
    created() {
        if (this.deviceInfo.deviceType === 5) {
            // 上报测量数据
            this.$controlClient.scanResult(this.measureInfo.recordReport)
        }
        if (!this.sucItemNum) {
            // 返回首页
            this.$changeViewPage('Home')
            return
        }
        const isTouristModule = this.deviceInfo.deviceType === 4 || this.deviceInfo.deviceType === 5 ? true : false
        // 1.绑定方式正常进行,
        // 2.游客模式下有第三方对接走第三方对接
        // 开启了无体成分报告
        if (this.deviceInfo.deviceType === 5 && this.deviceInfo.noBodyCompositionReport) {
            this.$store.commit('CHANGE_MEASURE_INFO', {
                mass: {
                    status: false
                }
            })
        }
        if (
            this.settingInfo.reportbindType !== 1 ||
            (this.settingInfo.reportbindType === 1 && isTouristModule && this.deviceInfo.thirdBindType !== 0) ||
            (isTouristModule && this.isOnlyWeight)
        ) {
            this.$changeViewPage('ScanResult')
        } else {
            window.logger.info('进入获取报告页面')
            this.isShowDom = true
            this.$store.commit('CHANGE_PAGE_INFO', {
                topInfo: true,
                navigation: '',
                title: this.$t('navigation-bar.huo-qu-ce-liang-bao-gao'),
                titleAlign: 'center',
                btnList: [],
                openNotOperated: false
            })
            EventBus.$on('EventAction', this.eventBus())
            // 如果网络正常则发送测量类型
            if (this.deviceInfo.isNetConnect) {
                // 开始测量类型倒计时
                this.sendScanTypeTimer()
                // 发送测量类型
                this.sendScanType()
            } else {
                this.status = 0
            }
            // 结束本次测量
            // handleStopScanReq()
        }
    },
    beforeDestroy() {
        // 重置scanId
        clearInterval(this.clockTimer)
        // 清除计时器
        clearTimeout(this.timer)
        EventBus.$off('EventAction')
    },
    methods: {
        ...mapMutations(['METE_TITLE']),
        // 事件监听
        eventBus() {
            return (type, data) => {
                if (type === 'NotifyTaskStatus') {
                    // 本次测量结果
                    if (data.scanInfo.scanId === this.measureInfo.scanId && data.streamType === 1) {
                        this.listBug = false
                        window.logger.info('===3==============')
                        const isNewOne = data.scanInfo.id !== '' ? false : true
                        // 根据手机号判断是否为新用户
                        const userInfo = {
                            isNewUser: isNewOne,
                            phoneNum: data.scanInfo.id
                        }
                        this.$store.commit('CHANGE_MEASURE_INFO', {
                            userInfo
                        })
                        this.$store.commit('PUSH_REPORT_LIST', true)
                        if (this.settingInfo.deviceViewReport) {
                            // 跳转查看报告页面
                            this.$changeViewPage('viewReport')
                        }
                    }
                }
            }
        },
        // 开始测量类型倒计时
        sendScanTypeTimer() {
            clearTimeout(this.timer)

            window.logger.info('开始测量类型倒计时')
            this.timer = setTimeout(() => {
                this.status = 0
            }, this.time * 1000)
        },
        // 发送测量类型
        sendScanType() {
            let that = this
            let currentScanInfo = that.measureInfo
            let currentDeviceInfo = that.deviceInfo
            window.logger.info('开始发起测量==')
            _getTimeZone().then((timeZone) => {
                window.logger.info('timeZone', timeZone)
                window.logger.info('开始倒计时')
                this.countdownClock()
                let mass =
                    currentDeviceInfo.deviceType === 3 && currentScanInfo.weight && currentScanInfo.weight.status
                        ? 1
                        : 0
                if (currentDeviceInfo.deviceType === 5) {
                    mass = currentScanInfo.mass && currentScanInfo.mass.status ? 1 : 0
                }
                this.$statusClient
                    .createScanType(
                        that.deviceInfo.deviceId,
                        currentScanInfo.scanId,
                        this.deviceInfo.noBodyCompositionReport ? 0 : mass,
                        currentScanInfo.shape && currentScanInfo.shape.status ? 1 : 0,
                        currentScanInfo.girth && currentScanInfo.girth.status ? 1 : 0,
                        currentScanInfo.shoulder.active > 0 ? 1 : 0,
                        this.measureInfo.utc,
                        timeZone,
                        currentScanInfo.deviceMode,
                        currentScanInfo.nutrition,
                        this.measureInfo.height,
                        this.settingInfo.beauty,
                        this.measureInfo.weight.status ? 1 : 0,
                        this.settingInfo.Athlete
                    )
                    .then((createScanTypeRes) => {
                        // 清除计时器
                        clearTimeout(this.timer)
                        if (this.settingInfo.printMode === 2) {
                            this.$store.commit('CHANGE_MEASURE_INFO', {
                                printType: 0
                            })
                        }
                        this.scanTypeRes = true
                        // 保存测量时间
                        this.$store.commit('CHANGE_MEASURE_INFO', {
                            scanTime: createScanTypeRes.createTime * 1000,
                            createTime: createScanTypeRes.createTime + '000'
                        })
                        // 已获取到序号
                        this.status = 1
                        this.reptId = createScanTypeRes.codeNum
                        const time = Number(createScanTypeRes.createTime + '000')
                        this.scanTime = new Date(time).Format('yyyy/MM/dd hh:mm:ss')
                        // this.getQrcodeInfo()
                        this.countdownClock()
                    })
            })
        },
        // 倒计时
        countdownClock() {
            if (this.clockTimer) {
                clearInterval(this.clockTimer)
            }
            this.clockTimer = setInterval(() => {
                this.countdown--
                if (this.countdown === 0) {
                    if (this.status === 0) {
                        this.METE_TITLE({
                            icon: false,
                            prev: ''
                        })
                        this.$changeViewPage('NetworkAnomaly')
                    } else if (this.status === 1) {
                        this.METE_TITLE({
                            icon: true,
                            prev: 'navigation-bar.shou-ye'
                        })
                        this.$changeViewPage('Home')
                    } else {
                        this.METE_TITLE({
                            icon: true,
                            prev: 'navigation-bar.shou-ye'
                        })
                        this.$changeViewPage('Home')
                    }
                    if (this.listBug) {
                        this.$store.commit('PUSH_REPORT_LIST', true)
                    }
                }
            }, 1000)
        }
        // 语音结束
        // audioEndCallback(audioId) {
        // },
        // 按键事件
        // btnClick(btnType) {
        // },
        // 监听状态服务
        // statusEventListener({ viewStage, data }) {
        //     // 测量类型通知成功
        //     if (viewStage === 14) {
        //         if (data.scanId === this.measureInfo.scanid) {
        //             // if (this.status === -1) {
        //             // 已获取到序号
        //             this.status = 1
        //             this.reptId = data.codeNum
        //             const time = Number(data.createTime + '000')
        //             this.scanTime = new Date(time).Format('yyyy/MM/dd hh:mm:ss')
        //             // }
        //         }
        //     }
        // }
    }
}
</script>
<style lang="less" scoped>
.get-report {
    .content {
        width: 100%;

        .content-bg {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 864px;
            height: 1074px;
            margin: 480px auto 0;
            background-image: url('/img/scan_result/get_report_bg.svg');
            background-size: 100% 100%;

            .scan-time {
                margin-top: 215px;
                font-size: 36px;
                font-family: OPPOSansR;
                font-weight: normal;
                color: #fff;
                line-height: 54px;
            }
            .rept-id {
                margin-top: 100px;
                font-size: 64px;
                font-family: OPPOSansM;
                font-weight: normal;
                color: #ff791f;
                line-height: 96px;
            }

            .en-rept {
                text-align: center;
                margin-top: 70px;
                line-height: 84px;
            }

            .tips {
                position: absolute;
                top: 628px;
                margin: 0;
                text-align: center;
                font-size: 36px;
                font-family: OPPOSansR;
                font-weight: normal;
                color: #fff;
                line-height: 54px;
                width: 784px;
            }

            .networkTips {
                font-size: 36px;
                font-family: OPPOSansR;
                font-weight: normal;
                margin: 90px 0 0 0;
            }

            .qrcode-bg {
                position: absolute;
                top: 274px;
                left: 96px;
            }

            .loading-box {
                position: absolute;
                top: 200px;
                height: 600px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 2;
                background-color: #333;
                width: 800px;

                .img-qrcode {
                    width: 364px;

                    &.load {
                        width: 128px;
                        -webkit-animation: spin 1s linear infinite;
                        -moz-animation: spin 1s linear infinite;
                        -o-animation: spin 1s linear infinite;
                        animation: spin 1s linear infinite;
                    }
                }

                .tips {
                    margin-top: 100px;
                }
            }

            .countdown-gray {
                position: absolute;
                bottom: 162px;
                width: 530px;
                height: 24px;
                background-image: url('/img/scan_result/countdown_gray.svg');

                .countdown-blue {
                    position: relative;
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

            .countdown {
                position: absolute;
                bottom: 90px;
                font-size: 32px;
                text-align: center;
                padding: 0;
                margin: 0;
                color: #ccc;

                span {
                    font-size: 32px;
                    font-family: OPPOSansR;
                    font-weight: normal;
                    line-height: 48px;
                }

                .p-num {
                    font-size: 32px;

                    .num {
                        color: #ff791f;
                    }
                }
            }

            &.or {
                height: 1314px;
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
