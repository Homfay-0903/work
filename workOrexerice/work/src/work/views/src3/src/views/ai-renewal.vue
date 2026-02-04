<!--
 * @Description: 设备到期提醒
 * @Author: WendyGao
 * @Date: 2022-02-17 15:22:54
 * @LastEditors: ouyaping
 * @LastEditTime: 2025-07-08 11:25:08
-->
<template>
    <div>
        <div v-if="deviceInfo.aiRenewalStatus === 1" class="renewal renewal1">
            <img src="@img/renewal/server.png" alt="服务器" />
            <h1>{{ $t('renewal.wei-jihuo-title') }}</h1>
            <div class="content">
                <p v-html="$t('renewal.wei-jihuo-content')"></p>
                <ul>
                    <li>{{ $t('renewal.wei-jihuo-content1', [renewAddr]) }}</li>
                    <li>{{ $t('renewal.wei-jihuo-content2') }}</li>
                    <li>{{ $t('renewal.wei-jihuo-content3') }}</li>
                </ul>
            </div>

            <div class="bottom">
                <p class="content4">{{ $t('renewal.wei-jihuo-content4') }}</p>
                <div class="phone">
                    <img src="@img/renewal/whatsapp-line.png" alt="" />
                    <span v-if="isOsDevice">{{ $t('renewal.wei-jihuo-content5') }}</span>
                    <span v-else>{{ $t('renewal1.wei-jihuo-content5') }}</span>
                </div>
                <div class="phone" v-if="isOsDevice">
                    <img src="@img/renewal/mail-line.png" alt="" />
                    <span>{{ $t('renewal.wei-jihuo-content6') }}</span>
                </div>
                <p class="content7">{{ $t('renewal.wei-jihuo-content7') }}</p>
                <div id="canvasTutorials"></div>
                <p class="content8">{{ $t('renewal.wei-jihuo-content8') }}</p>
            </div>
        </div>
        <div v-else class="renewal">
            <img src="@img/renewal/server.png" alt="服务器" />
            <h1>{{ $t('renewal.ting-ji-title') }}</h1>
            <p v-if="isOsDevice" v-html="$t('renewal.ting-ji-content', [deviceInfo.aiExpirationTime, renewAddr])"></p>
            <p v-else v-html="$t('renewal1.ting-ji-content', [deviceInfo.aiExpirationTime, renewAddr])"></p>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/util/event-bus'
import CONFIG from '@/config/index'
import QRCodeStyling from 'qr-code-styling'
import { languageMap } from '@/i18n/langs/languageList'
import { isOsDevice } from '@/types/device'

export default {
    name: 'AiRenewal',
    data() {
        return {
            qrCode: {},
            isOsDevice: isOsDevice()
        }
    },
    computed: {
        ...mapGetters(['deviceInfo']),
        address() {
            return 'https://assistant.visbody.com/'
        },
        renewAddr() {
            return CONFIG.RENEW_ADDR || 'https://assistant.visbody.com'
        }
    },
    created() {
        // 网络断开进入中断常驻
        if (!this.deviceInfo.isNetConnect) {
            this.$changeViewPage('NetworkAnomaly')
            return
        }
    },
    mounted() {
        // 监听检测结果
        EventBus.$on('EventAction', async (type, data) => {
            if (type === 'AiExpStatus') {
                if (this.deviceInfo.aiRenewalStatus === 2) {
                    // 转台站人 启动测量
                    window.logger.info('设备端ai到期续费提醒页已续费')
                    this.$changeViewPage('Home')
                }
            } else if (type === 'netWorktStatus') {
                if (!data.online) {
                    this.$changeViewPage('NetworkAnomaly')
                    window.logger.info('设备端到ai期续费提醒页网络中断')
                }
            }
        })

        window.logger.info('this.pageText==>', JSON.stringify(this.pageText))
        // 生成二维码
        if (this.renewAddr && this.deviceInfo.aiRenewalStatus === 1) {
            this.onUpdateQrcode()
        }
    },
    methods: {
        // 生成二维码
        onUpdateQrcode() {
            console.log('onUpdateQrcode')
            if (this.qrCode.data === null || this.qrCode.data === undefined) {
                console.log('onUpdateQrcode1')
                let dataUrl = ''
                if (!isOsDevice()) {
                    dataUrl = `${this.renewAddr}/resource?typeId=4&language=zh-CN`
                } else {
                    const language = languageMap[this.$i18n.locale || 'en']
                    dataUrl = `${this.renewAddr}/resource?typeId=5&language=${language}`
                }
                console.log('dataUrl', dataUrl)
                this.qrCode = new QRCodeStyling({
                    width: 220,
                    height: 220,
                    type: 'svg',
                    data: dataUrl,
                    dotsOptions: {
                        color: '#000',
                        type: 'dots'
                    },
                    backgroundOptions: {
                        color: '#ffffff'
                    }
                    // imageOptions: {
                    //     crossOrigin: 'anonymous'
                    // },
                    // cornersDotOptions: {
                    //     type: 'dot'
                    // },
                    // cornersSquareOptions: {
                    //     type: 'dot'
                    // },
                    // qrOptions: {
                    //     typeNumber: 0,
                    //     mode: 'Byte',
                    //     errorCorrectionLevel: 'L'
                    // }
                })
            }
            this.qrCode.append(document.getElementById('canvasTutorials'))
        },
        testResetPage() {
            console.log('testResetPage', this.deviceInfo)
            this.$store.commit('CHANGE_DEVICE_INFO', {
                deviceType: 3,
                aiRenewalStatus: 1,
                aiExpirationTime: '2025-5-31'
            })
            // this.$changeViewPage('ResetPage', { standPeople: true })
            // 触发全局事件
            // this.$store.commit('CHANGE_STAND_PEOPLE', true)
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.renewal {
    text-align: center;
    img {
        margin-top: 160px;
        width: 510px;
        height: 590px;
    }
    h1 {
        font-family: OPPOSanaM;
        line-height: 96px;
        font-weight: normal;
        font-size: 64px;
        color: #ffffff;
    }
    p {
        text-align: left;
        margin: 0;
        padding: 0 96px;
        line-height: 68px;
        font-family: OPPOSansR;
        font-weight: normal;
        color: #ced7e0;
        font-size: 36px;
        word-wrap: nowrap;
        font-size: 36px;
    }
    i {
        display: block;
        margin: 60px auto;
        width: 900px;
        height: 2px;
        background: #5e687b;
        opacity: 0.5;
    }
    &.renewal1 {
        img {
            margin-top: 0px;
            width: 510px;
            height: 590px;
        }
        h1 {
            margin-top: -140px;
        }
        .content {
            text-align: left;
            margin: 0 60px;
            padding: 44px 64px 24px;
            background: #333333;
            border-radius: 32px;
            p {
                padding: 0;
                font-weight: normal;
                font-size: 32px;
                color: #cccccc;
                line-height: 48px;
                text-align: left;
                font-style: normal;
            }
            li {
                font-weight: normal;
                font-size: 32px;
                color: #cccccc;
                line-height: 48px;
                text-align: left;
                font-style: normal;
                margin-bottom: 16px;
                position: relative;
            }
            ul {
                list-style-type: none; /* 移除默认的项目符号 */
                padding-left: 50px; /* 移除默认的左侧内边距 */
                margin: 16px 0 0 0;
            }

            ul li::before {
                content: '•'; /* 使用伪元素添加自定义项目符号 */
                color: #ef670c; /* 设置项目符号的颜色 */
                font-size: 70px; /* 设置项目符号的大小 */
                margin-right: 8px; /* 设置项目符号与列表项文本之间的间距 */
                position: absolute;
                left: -50px;
                top: 0px;
            }
        }
        .bottom {
            margin: 28px 124px 0;
            font-weight: normal;
            font-size: 32px;
            color: #838383;
            line-height: 48px;
            text-align: left;
            font-style: normal;
            p {
                padding: 0;
                line-height: 48px;
            }
            .content4 {
                margin-bottom: 16px;
            }
            .phone {
                img {
                    width: 30px;
                    height: 30px;
                    margin: 0 16px 0 0;
                }
                span {
                    font-weight: normal;
                    font-size: 32px;
                    color: #838383;
                    line-height: 48px;
                    text-align: left;
                    font-style: normal;
                }
            }
            .content7 {
                margin-top: 16px;
            }
            #canvasTutorials {
                margin: 48px 0 0 0;
                text-align: center;
            }
            .content8 {
                margin-top: 16px;
                text-align: center;
            }
        }
    }
}
</style>
