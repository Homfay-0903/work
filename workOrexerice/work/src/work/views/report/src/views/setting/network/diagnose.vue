<template>
    <div class="network-diagnose">
        <template v-if="networkState">
            <div class="borders">
                <img src="@img/setting/set_net_spin_bg.png" class="spin-bg" alt="正在网络诊断" style="z-index: 1" />
                <img
                    src="@img/setting/set_net_spin_dot.png"
                    class="spin-dot"
                    alt="正在网络诊断"
                    style="position: absolute; z-index: 2"
                />
            </div>
            <span>{{ $t('setting.check.network.testing') }}</span>
        </template>
        <!-- 外网连接异常 - 网络中断 -->
        <template v-else>
            <div class="err-content">
                <img src="@img/setting/set_net_error.svg" class="network-error" alt="网络中断" />
                <div class="err-card">
                    <transition name="fade-move" mode="out-in" appear>
                        <msg-card :show-type-icon="false" type="tips">
                            <p slot="title" class="model-title">
                                <img
                                    v-if="deviceInfo.deviceType === 5 || deviceInfo.deviceType === 3"
                                    src="@img/setting/network-disconnected.svg"
                                    class="disconnected-icon"
                                    alt=""
                                />
                                {{ $t('setting.check.network.disconnected') }}
                            </p>
                            <p slot="info-content" class="info-content">
                                {{ $t('setting.check.network.disconnected_desc1') }}<br />
                                {{ $t('setting.check.network.disconnected_desc2') }}
                            </p>
                        </msg-card>
                    </transition>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import MsgCard from '@/components/MsgCard.vue'
import { _getNetworkState } from '@/util'
export default {
    name: 'NetworkDiagnose',
    components: {
        MsgCard
    },
    computed: {
        ...mapGetters(['netSpeedInfo', 'deviceInfo'])
    },
    watch: {
        netSpeedInfo: {
            handler(val) {
                // 上传和下载数据都返回后
                if (val.upLoadNetSpeed.status !== 0 && val.downLoadNetSpeed.status !== 0) {
                    // 进入报告
                    this.$changeViewPage('NetworkReport', { standUp: true })
                }
            },
            deep: true
        }
    },
    data() {
        return {
            // 外网连接情况
            networkState: true
        }
    },
    created() {
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: [
                {
                    btn: 'switch',
                    msg: '电源'
                }
            ],
            openNotOperated: false
        })
        this.networkTest()
    },
    methods: {
        // 按键事件
        btnClick(btnType) {
            // 返回
            if (btnType === 7) {
                this.$changeViewPage('DeviceSetting')
            }
        },
        // 网络测试
        networkTest() {
            // 外网连接
            _getNetworkState('baidu.com', (state) => {
                window.logger.info('外网连接检测：', state)
                this.networkState = state
                this.$store.commit('CHANGE_NET_SPEED_INFO', {
                    networkState: state,
                    // 初始化
                    upLoadNetSpeed: {
                        status: 0,
                        netSpeed: 0,
                        subTime: 0,
                        state: true
                    },
                    downLoadNetSpeed: {
                        status: 0,
                        netSpeed: 0,
                        subTime: 0
                    }
                })
                if (state) {
                    // 上传速度请求
                    this.$controlClient.upLoadNetSpeed()
                    // 下载速度请求
                    this.$controlClient.downLoadNetSpeed()
                } else {
                    // 开启1分钟超时
                    this.$store.commit('CHANGE_PAGE_INFO', {
                        openNotOperated: true
                    })
                }
            })
        },
        // 超时未操作处理
        handleNotOperated() {
            this.$store.commit('CHANGE_SETTING_INFO', {
                menuType: 0,
                childActive: 0
            })
            this.$changeViewPage('Home')
        }
    }
}
</script>
<style lang="less" scoped>
.network-diagnose {
    .borders {
        position: absolute;
        width: 100%;
        top: 480px;
        display: flex;
        justify-content: center;
        align-items: center;
        .spin-bg {
            width: 672px;
            animation: spin 2s linear infinite;
        }
        .spin-dot {
            width: 384px;
            animation: spin 4s linear infinite;
        }
    }
    span {
        position: absolute;
        top: 1272px;
        width: 100%;
        text-align: center;
        font-size: 36px;
        font-family: OPPOSansR;
        font-weight: normal;
        line-height: 54px;
        color: @text-gray-2;
    }
    .err-content {
        position: absolute;
        width: 100%;
        top: 480px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .network-error {
            width: 672px;
            height: 674px;
        }
        .err-card {
            margin-top: 158px;
            .model-title {
                text-align: center;
                margin-bottom: 16px;
                margin-top: 0;
                font-size: 64px;
                font-family: OPPOSansM;
                font-weight: normal;
                line-height: 96px;
                color: #ffffff;
                .disconnected-icon {
                    width: 64px;
                    height: 64px;
                    vertical-align: middle;
                    margin-right: 16px;
                }
            }
            .info-content {
                font-size: 36px;
                font-family: OPPOSansR;
                font-weight: normal;
                text-align: center;
                color: #e7e9f0;
                line-height: 48px;
                margin: 0;
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
<style>
.msg-card-main.tips {
    padding: 80px 40px !important;
    background: #333333 !important;
}
.msg-card-main.tips.pro5-style {
    box-shadow: inset 0px 0px 24px 0px rgba(255, 0, 0, 0.5) !important;
}
</style>
