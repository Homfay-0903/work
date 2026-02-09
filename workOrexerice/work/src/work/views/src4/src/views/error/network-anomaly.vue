<!--
 * @Description: 网络异常页面（自检网络异常）
 * @Author: gaoyuanyuan
 * @Date: 2019-10-16 14:25:49
 * @LastEditors: liutq
 * @LastEditTime: 2025-12-15 16:38:52
 -->
<template>
    <div :class="['network-anomaly', $i18n.locale]">
        <img src="@img/error/wired_network .svg" class="icon" alt="网络异常" />
        <h3 class="title">{{ $t('network-error.title') }}</h3>
        <p>
            <i18n path="network-error.desc0" tag="span">
                <br place="item" />
            </i18n>
        </p>
        <error-contact-card
            class="error-contact-box"
            v-if="deviceErrorCode"
            :errorCode="deviceErrorCode"
            type="gray"
            key="timeout"
            title="扫码联系售后"
        ></error-contact-card>
        <div class="info">
            <!-- 网络提醒 -->
            <tip-card
                key="network"
                :type="tipCardType"
                title-icon="wifishezhi_white"
                :title="$t('wifi.title')"
                :submitType="'click'"
                @eventType="btnClick(4)"
            >
                <p slot="msg" class="network-msg">
                    <!-- <i18n path="home.cha_ru_wang_xian_or_wifi_subtitle">
                        <img src="@/assets/img/home/add-circle-fill.svg" place="img" alt="" />
                    </i18n> -->
                    {{ $t('home.cha_ru_wang_xian_or_wifi_subtitle') }}
                </p>
            </tip-card>
            <tip-card
                key="network"
                :type="tipCardType"
                title-icon="network_white"
                :title="$t('home.jian-cha-wang-luo')"
                :submitType="'click'"
                @eventType="btnClick(5)"
            >
                <p slot="msg" class="network-msg">
                    <!-- <i18n path="home.jian-cha-wang-luo_subtitle">
                        <img src="@/assets/img/home/indeterminate-circle-fill.svg" place="img" alt="" />
                    </i18n> -->
                    {{ $t('home.jian-cha-wang-luo_subtitle') }}
                </p>
            </tip-card>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/util/event-bus'
import TipCard from '../home/components/TipCard.vue'
const moment = require('moment')
import ErrorContactCard from '../../components/ErrorContactCard.vue'
export default {
    name: 'NetworkAnomaly',
    components: {
        TipCard,
        ErrorContactCard
    },
    data() {
        return {
            interval: null,
            active: false
        }
    },
    computed: {
        ...mapGetters(['deviceInfo', 'statusClient', 'deviceErrors']),
        tipCardType() {
            return 'blue'
        },
        deviceErrorCode() {
            return this.deviceErrors.map((err) => err.title).join(',')
        }
    },
    created() {
        // 监听网络状态，如果刚进来网络就恢复了，就直接关闭自己，不播放语音提示了
        // if (navigator.onLine) {
        // this.onNetConnectChange(navigator.onLine)
        // return
        // }
        this.interval = setInterval(async () => {
            try {
                const res = await this.$controlClient.checkSelf()
                if (res.status !== 4) {
                    this.onNetConnectChange(this.deviceInfo.isNetConnect)
                }
            } catch (e) {
                window.logger.info('网络异常页', e)
            }
        }, 30000)
        this.$emit('on-audio-event', 'playAudio', 'networkAnomaly')
        // 修改测量状态
        this.$store.commit('CHANGE_SCAN_STATE', false)
    },
    mounted() {},
    methods: {
        audioEndCallback(audioId) {
            // 监听网络异常语音
            if (audioId === 'networkAnomaly') {
                // 网络是否恢复
                // if (this.deviceInfo.isNetConnect && this.statusClient) {
                //     this.onNetConnectChange(this.deviceInfo.isNetConnect)
                // } else {
                //     //没恢复，则注册一个恢复监听
                //     EventBus.$on('EventAction', async (type, data) => {
                //         if (type === 'netWorktStatus') {
                //             this.onNetConnectChange(data.online)
                // this.onNetConnectChange(data.online)
                //         }
                //     })
                // }
            }
        },
        // 跳转逻辑处理
        onNetConnectChange(online) {
            this.$store.commit('CHANGE_DEVICE_INFO', {
                isNetConnect: online
            })
            if (online) {
                window.logger.info('网线状态恢复正常')
                if ([3].includes(this.deviceInfo.deviceType)) {
                    this.updatedAiExp(this.deviceInfo.deviceId)
                } else {
                    this.updatedExp(this.deviceInfo.deviceId)
                }
                // 需要重新自检
                if (this.deviceInfo.reSelfCheck && this.statusClient) {
                    window.logger.info('自检导致的网络异常，网络恢复后重新发起自检')
                    // 清空异常
                    this.$store.commit('RESET_DEVICE_ERROR', [])
                    this.$changeViewPage('CheckSelf')
                } else {
                    if (!this.deviceInfo.contortStatus && this.statusClient) {
                        window.logger.info('控制服务引起的异常，网络恢复后重新发起自检')
                        this.$store.commit('CHANGE_DEVICE_INFO', { contortStatus: true })
                        // 清空异常
                        this.$store.commit('RESET_DEVICE_ERROR', [])
                        this.$changeViewPage('CheckSelf')
                    } else if (this.statusClient) {
                        this.$changeViewPage('Home')
                    }
                }
            }
        },
        // 按键事件
        btnClick(btnType) {
            if (btnType === 5) {
                // 长按-
                this.$changeViewPage('NetworkDiagnose')
            } else if (btnType === 4) {
                // 长按+
                this.$changeViewPage('wifiList')
            }
        },
        async updatedExp(deviceId) {
            const expInfo = await this.$statusClient.getDeviceExpire(deviceId)
            this.$store.commit('CHANGE_DEVICE_INFO', {
                renewalStatus: expInfo.status,
                expirationTime: moment(expInfo.expirationTime * 1000)
                    .add(7, 'd')
                    .format('YYYY-MM-DD')
                    // eslint-disable-next-line no-control-regex
                    .replace(/([^\u0000-\u00FF])/g, ' $1 ')
                    .trim()
            })
            EventBus.$emit('EventAction', 'ExpStatus', {})
        },
        async updatedAiExp(deviceId) {
            const expInfo = await this.$statusClient.getAIDeviceExpire(deviceId)
            this.$store.commit('CHANGE_DEVICE_INFO', {
                aiRenewalStatus: expInfo.status,
                aiExpirationTime: moment(expInfo.expirationTime * 1000)
                    .add(expInfo.status === 3 ? 0 : 7, 'd')
                    .format(this.$i18n.locale === 'zh' ? 'YYYY-MM-DD' : 'MM-DD-YYYY')
                    // eslint-disable-next-line no-control-regex
                    .replace(/([^\u0000-\u00FF])/g, ' $1 ')
                    .trim()
            })
            EventBus.$emit('EventAction', 'AiExpStatus', {})
        }
    },
    beforeDestroy() {
        clearInterval(this.interval)
        EventBus.$off('EventAction')
    }
}
</script>
<style lang="less" scoped>
.network-anomaly {
    position: relative;
    text-align: center;
    height: 100%;

    .icon {
        position: relative;
        width: 270px;
        height: 455px;
        padding-top: 482px;
        margin-left: 46px;
    }
    &.el,
    &.en,
    &.es,
    &.pt,
    &.tr,
    &.fr,
    &.it,
    &.de,
    &.ru,
    &.hu {
        .icon {
            width: 180px;
            height: 300px;
            padding-top: 400px;
        }
        p span {
            line-height: 1.3;
        }
    }

    .title {
        margin: 43px 0 24px;
        font-size: 64px;
        color: #e7e9f0;
        font-family: 'OPPOSansM';
        font-weight: normal;
        line-height: 96px;
    }

    p {
        margin: 0;

        svg {
            display: inline-block;
            margin: 10px;
            width: 36px;
            height: 36px;
            vertical-align: middle;
            vertical-align: top;
        }

        span {
            display: inline-block;
            width: 80%;
            margin: 0 auto;
            font-family: 'OPPOSansR';
            font-weight: normal;
            line-height: 75px;
            font-size: 40px;
            color: #cccccc;
            line-height: 64px;
        }

        .footer {
            font-size: 32px;
        }
    }
    &.zhcht p span {
        width: 90%;
    }

    .info {
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        z-index: 101;
        width: 100%;
        margin-bottom: 80px;
        text-align: left;

        .network-msg {
            span {
                display: flex;
                align-items: center;
                width: 100%;

                img {
                    width: 48px;
                }
            }
        }
        .network-msg1 {
            background: #1d66e6;
        }
    }
}
</style>
