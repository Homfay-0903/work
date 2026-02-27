<template>
    <div class="qr-code">
        <div class="preview-video">
            <template v-if="deviceInfo.thirdBindType === 4">
                <iframe v-if="showVideo" src="http://127.0.0.1:8080/color" />
                <div v-if="showVideo" class="qr-effect">
                    <div class="box"></div>
                    <div class="quadrangle"></div>
                </div>
            </template>
            <template v-else>
                <img v-if="deviceInfo.thirdBindType === 5" src="@img/identity-check/face.png" alt="人脸识别" />
                <img v-else-if="deviceInfo.thirdBindType === 6" src="@img/identity-check/id_card.png" alt="人脸识别" />
            </template>
        </div>
        <p :class="{ tip: true, err: checkErr }">{{ tipMsg }}</p>
        <cut-down-load @cut-down-over="goIndexPage" :duration="600" :suffixType="1"></cut-down-load>
    </div>
</template>
<script>
import CutDownLoad from '@/components/CutDownLoad.vue'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { EventBus } from '@/util/event-bus'
import CONFIG from '@/config/index'
import { _getTimeZone } from '@/util'

export default {
    name: 'QRCodeCheck',
    components: {
        CutDownLoad
    },
    data() {
        return {
            // 判断服务测量类型是否返回
            scanTypeRes: false,
            // 是否显示扫码预览
            showVideo: false,
            // 提示信息
            tipMsg: '请出示您的二维码，设备会识别您的信息',
            // 检录状态 0 默认值 1 检录中 2 检录成功
            checkStatus: 0,
            checkErr: false
        }
    },
    computed: {
        ...mapGetters(['qrcode', 'measureInfo', 'deviceInfo', 'external', 'settingInfo', 'scanQueue', 'sucItemNum'])
    },
    created() {
        // 发送测量类型
        // 开启了无体成分报告
        if (this.deviceInfo.deviceType === 5 && this.deviceInfo.noBodyCompositionReport) {
            this.$store.commit('CHANGE_MEASURE_INFO', {
                mass: {
                    status: false
                }
            })
        }
        this.sendScanType()
        this.tipMsg =
            this.deviceInfo.thirdBindType === 4 ? '请出示您的二维码，设备会识别您的信息' : '请到检录设备进行身份检录'
    },
    mounted() {
        EventBus.$on('EventAction', (type, data) => {
            window.logger.info('监听数据', type, data)
            if (type === 'QRCodeScanResult') {
                // 上报信息
                if (this.checkStatus === 0) this.qrCodeReport(data)
            } else if (type === 'StartedStream') {
                window.logger.info('监听到视频流开始上报')
                setTimeout(() => {
                    this.showVideo = true
                }, 1000)
            } else if (type === 'IdentityCheck') {
                window.logger.info('身份检录收到数据', data)
                switch (data.status) {
                    case 1:
                        // 停止扫描二维码
                        this.$algClient.stopScanQRCode()
                        break
                    case 2:
                        this.tipMsg = '识别失败，无法匹配学生信息'
                        this.checkStatus = 0
                        this.checkErr = true
                        break
                    case 3:
                        this.tipMsg = '识别失败，请先到M6完成身高测量'
                        this.checkStatus = 0
                        this.checkErr = true
                        break
                    case 4:
                        this.tipMsg = '识别失败，请检查二维码是否正确'
                        this.checkStatus = 0
                        this.checkErr = true
                        break
                    default:
                        break
                }
            } else if (type === 'NotifyTaskStatus') {
                if (this.checkStatus !== 2) {
                    // 本次测量结果
                    if (data.scanInfo.scanId === this.measureInfo.scanId && data.streamType === 1) {
                        this.tipMsg = '检录成功'
                        this.checkErr = false
                        const isNewOne = data.scanInfo.id !== '' ? false : true
                        // 根据手机号判断是否为新用户
                        const userInfo = {
                            isNewUser: isNewOne,
                            phoneNum: data.scanInfo.id
                        }
                        this.$store.commit('CHANGE_MEASURE_INFO', {
                            userInfo
                        })
                        this.checkStatus = 2
                        setTimeout(() => {
                            this.goIndexPage()
                        }, 3000)
                    }
                }
            }
        })
    },
    beforeDestroy() {
        // 停止扫描二维码
        this.$algClient.stopScanQRCode()
    },
    methods: {
        goIndexPage() {
            // 打印
            this.addPrint()
            // 返回首页
            this.$changeViewPage('Home')
        },
        // 上报二维码识别信息
        qrCodeReport(qrCodeData) {
            this.checkStatus = 1
            window.logger.info('二维码识别结果', qrCodeData)
            let that = this
            axios
                .post(
                    '/qrcode-info',
                    {
                        device_id: this.deviceInfo.deviceId,
                        qrcode_msg: qrCodeData
                    },
                    {
                        baseURL: `http://${CONFIG.SERVICE.STATUS_HTTP_ADDR}`
                    }
                )
                .then(function (response) {
                    window.logger.info('二维码上报结果', response)
                    // that.tipMsg = '扫描成功'
                })
                .catch(function (error) {
                    window.logger.info('二维码上报异常', error)
                    that.tipMsg = '网络异常，请重试'
                    this.checkStatus = 0
                    this.checkErr = true
                })
        },
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
                        this.measureInfo.height,
                        this.settingInfo.beauty,
                        this.measureInfo.weight.status ? 1 : 0,
                        this.settingInfo.Athlete
                    )
                    .then((createScanTypeRes) => {
                        this.scanTypeRes = true
                        // 保存测量时间
                        this.$store.commit('CHANGE_MEASURE_INFO', {
                            scanTime: createScanTypeRes.createTime * 1000,
                            createTime: createScanTypeRes.createTime + '000'
                        })
                        this.getQrcodeInfo()
                        this.countdownClock()
                    })
            })
        },
        // 按键事件
        btnClick(btnType) {
            if (btnType === 7) {
                // 返回首页
                this.goIndexPage()
            }
        },
        // 添加打印状态数据
        addPrint() {
            if (this.checkStatus === 2) {
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    printType: this.settingInfo.printMode === 1 ? 1 : 0
                })
                // 添加打印队列
                this.$store.commit('PUSH_REPORT_LIST', true)
            }
        }
    }
}
</script>

<style lang="less" type="text/css" scoped>
.qr-code {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .preview-video {
        position: relative;
        margin-top: 531px;
        width: 660px;
        height: 660px;

        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }

        img {
            width: 660px;
        }

        .qr-effect {
            width: 660px;
            height: 660px;
            margin-top: -680px;
            position: relative;
            top: 0;
            z-index: 999;
            overflow: hidden;

            // background-color: #cccccc;
            .box {
                width: 100%;
                height: 100%;
                position: absolute;
                background: url(/img/identity-check/scan.png) no-repeat;
                /*上下扫的线*/
                background-size: 100% auto;
                /*动画效果*/
                animation: myScan 2s linear infinite normal;
            }

            .quadrangle {
                width: 396px;
                height: 396px;
                top: 132px;
                left: 132px;
                position: absolute;
                background: linear-gradient(to left, #fff, #fff) left top no-repeat,
                    linear-gradient(to bottom, #fff, #fff) left top no-repeat,
                    linear-gradient(to left, #fff, #fff) right top no-repeat,
                    linear-gradient(to bottom, #fff, #fff) right top no-repeat,
                    linear-gradient(to left, #fff, #fff) left bottom no-repeat,
                    linear-gradient(to bottom, #fff, #fff) left bottom no-repeat,
                    linear-gradient(to left, #fff, #fff) right bottom no-repeat,
                    linear-gradient(to left, #fff, #fff) right bottom no-repeat;
                background-size: 6px 66px, 66px 6px, 6px 66px, 66px 6px;
            }
        }
    }

    .tip {
        margin-top: 216px;
        max-width: 856px;
        font-size: 48px;
        font-family: OPPOSansR;
        font-weight: normal;
        text-align: center;
        color: #cccccc;
    }

    .err {
        color: #e64444;
    }

    @keyframes myScan {
        from {
            top: -200px;
        }

        to {
            top: 350px;
        }
    }
}
</style>
