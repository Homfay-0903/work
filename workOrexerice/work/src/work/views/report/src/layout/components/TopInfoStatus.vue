<!--
 * @Description: 顶部状态栏信息
 * @Author: yangsheng
 * @Date: 2022-02-15 11:39:06
 * @LastEditTime: 2022-05-25 19:06:12
 * @LastEditors: liutq
 -->
<template>
    <div class="top-container">
        <div class="left" @touchend="handleDateClick">
            <!-- 首页不显示顶部时间 -->
            <date-clock v-if="$route.name !== 'Home'" :type="2" />
        </div>
        <div class="right">
            <!-- <div v-if="netSpeedInfo.speedStatus" class="icon-item">
                <img
                    :src="require('@img/top/internet-no.svg')"
                    v-if="!deviceInfo.isNetConnect"
                    class="icon-speedStatus"
                    alt="网络图标"
                />
                <img
                    :src="require('@img/top/internet-fast.svg')"
                    v-else-if="netSpeedInfo.speedStatus === 1"
                    class="icon-speedStatus"
                    alt="网络图标"
                />
                <img
                    :src="require('@img/top/internet-slowly.svg')"
                    v-else-if="netSpeedInfo.speedStatus === 2"
                    class="icon-speedStatus"
                    alt="网络图标"
                />
                <img
                    :src="require('@img/top/internet-very-slowly.svg')"
                    v-else-if="netSpeedInfo.speedStatus === 3"
                    class="icon-speedStatus"
                    alt="网络图标"
                />
            </div> -->
            <!-- 有线状态 -->
            <div class="icon-item">
                <img
                    :src="require('@img/top/xianno.png')"
                    v-if="!deviceInfo.WiredNetworkStatus"
                    class="icon-speedStatus"
                    alt="网络图标"
                />
                <img
                    :src="require('@img/top/xianhas.png')"
                    v-else-if="deviceInfo.WiredNetworkStatus"
                    class="icon-speedStatus"
                    alt="网络图标"
                />
            </div>
            <!-- wifi状态 -->
            <div class="icon-item">
                <!-- 无wifi时显示 -->
                <img
                    :src="require('@img/top/wifinoi.png')"
                    v-if="!WifiStatus"
                    class="icon-speedStatus"
                    alt="网络图标"
                />
                <!-- 不管连得有线还是无线 是否连接网络成功的状态 -->
                <img
                    :src="require('@img/top/wifinow.png')"
                    v-else-if="!isNetConnect"
                    class="icon-speedStatus"
                    alt="网络图标"
                />
                <img
                    :src="require('@img/top/wifi1i.png')"
                    v-else-if="wifiLevel < 40"
                    class="icon-speedStatus"
                    alt="网络图标"
                />
                <img
                    :src="require('@img/top/wifi2i.png')"
                    v-else-if="wifiLevel < 60"
                    class="icon-speedStatus"
                    alt="网络图标"
                />
                <img
                    :src="require('@img/top/wifi3i.png')"
                    v-else-if="wifiLevel < 80"
                    class="icon-speedStatus"
                    alt="网络图标"
                />
                <img
                    :src="require('@img/top/wifi4i.png')"
                    v-else-if="wifiLevel <= 100"
                    class="icon-speedStatus"
                    alt="网络图标"
                />
            </div>
            <!-- 手势识别开启显示 -->
            <template v-if="settingInfo.gestureState">
                <div v-if="deviceUsable.gesture" class="icon-item">
                    <i class="iconfont icon-left-hand small"></i>
                </div>
                <div v-else class="icon-item">
                    <i class="iconfont icon-no-gesture"></i>
                </div>
            </template>
            <!-- 触屏状态 -->
            <div v-if="deviceInfo.operationMode === 1" class="icon-item">
                <img
                    :src="require('@img/top/touch-no.svg')"
                    v-if="!external.touch"
                    class="icon-speedStatus"
                    alt="触摸图标"
                />
                <!-- <img :src="require('@img/top/touch.svg')" v-else class="icon-speedStatus" alt="触摸图标" /> -->
            </div>
            <!-- 打印机状态 关闭打印时不显示 -->
            <div v-if="settingInfo.printMode !== 0" class="icon-item" @touchend="handleClick">
                <print-status keep-alive></print-status>
            </div>
            <!-- 音量状态 音量不为0时不显示 -->
            <div v-if="deviceInfo.volume === 0" class="icon-item">
                <i class="iconfont icon-voice"></i>
            </div>
            <!-- usb状态 无usb插入时不显示 -->
            <div v-if="external.usb" class="icon-item">
                <i class="iconfont icon-usb"></i>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PrintStatus from '../../components/PrintStatus.vue'
import DateClock from '../../components/DateClock.vue'
import { _openAaTool } from '@/util'
import { EventBus } from '@/util/event-bus'
export default {
    name: 'TopInfoStatus',
    components: {
        PrintStatus,
        DateClock
    },
    data() {
        return {
            clickCount: 0,
            lastClickTime: 0,
            clickTimeout: 1000,
            isNetConnect: true,
            WifiStatus: false,
            wifiLevel: 0
        }
    },
    computed: {
        ...mapGetters(['settingInfo', 'deviceInfo', 'currentView', 'external', 'deviceUsable', 'netSpeedInfo'])
    },
    watch: {
        deviceInfo: {
            handler(val, oldVal) {
                if (
                    val.wifiLevel !== oldVal.wifiLevel ||
                    val.WifiStatus !== oldVal.WifiStatus ||
                    val.isNetConnect !== oldVal.isNetConnect
                ) {
                    this.wifi(val)
                }
            },
            deep: true // 对象内部的属性监听，也叫深度监听
        }
    },
    mounted() {
        EventBus.$on('EventAction', (type, data) => {
            if (type === 'WifiStatus') {
                this.wifi(data)
            }
        })
        this.isNetConnect = this.deviceInfo.isNetConnect
        this.WifiStatus = this.deviceInfo.WifiStatus
        this.wifiLevel = this.deviceInfo.wifiLevel
        window.logger.info('WiFi强度', this.WifiStatus, this.isNetConnect, this.wifiLevel)
    },
    methods: {
        handleClick() {
            this.$changeViewPage('PrintList')
        },
        handleDateClick() {
            window.logger.info('点击了时间', this.clickCount, this.lastClickTime, this.clickTimeout)
            const currentTime = new Date().getTime()
            // 检查是否在有效时间内连续点击
            if (currentTime - this.lastClickTime > this.clickTimeout) {
                this.clickCount = 1 // 重新开始计数
            } else {
                this.clickCount++
            }
            this.lastClickTime = currentTime
            // 如果达到5次点击
            if (this.clickCount === 5) {
                window.logger.info('达到5次点击')
                // 开发aa工具
                _openAaTool()
            }
        },
        wifi(val) {
            this.wifiLevel = val.wifiLevel
            this.WifiStatus = val.WifiStatus
            this.isNetConnect = this.deviceInfo.isNetConnect
            window.logger.info('deviceInfo change', this.wifiLevel, this.WifiStatus, this.isNetConnect)
        }
    }
}
</script>
<style lang="less" scoped>
.top-container {
    position: absolute;
    top: 25px;
    width: calc(100% - 120px);
    height: 48px;
    margin: 0 60px;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    z-index: 103;
    .left {
        .date-clock {
            margin-right: 74px;
        }
    }

    .right {
        display: flex;
        align-items: center;
        padding-top: 12px;

        .icon-item {
            display: flex;
            align-items: center;
            margin-right: 24px;
            i {
                font-size: 48px;

                &.small {
                    font-size: 38px;
                }
            }
            svg {
                width: 45px;
                height: 45px;
            }
            .icon-speedStatus {
                width: 48px;
                height: 48px;
            }
        }
    }
}
</style>
