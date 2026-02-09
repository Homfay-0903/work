<!--
 * @Description: 设备异常页
 * @Author: wangmingdong
 * @Date: 2019-11-28 15:57:57
 * @LastEditTime: 2026-01-04 16:06:57
 * @LastEditors: liutq
 -->
<template>
    <div class="device-error">
        <!-- <button @click="remove" style="position: absolute; z-index: 1000">移除异常</button><br /> -->
        <div class="content">
            <div class="animated fast fadeIn">
                <img src="@img/error/turntable.png" />
                <h3>转台连接异常</h3>
                <p>
                    <!-- 请重新插拔转台，若重试无效，<br />请联系售后维修 -->
                    未检测到转台，请重新插拔连接线并重启设备，<br />错误代码
                    {{ deviceErrorCode }}
                    <!-- <i18n path="device-error.desc0" tag="span">
                        <br place="item" />
                    </i18n> -->
                </p>
            </div>
        </div>
        <error-contact-card
            class="error-contact-box"
            v-if="deviceErrorCode"
            :errorCode="deviceErrorCode"
            key="timeout"
            title="扫码联系售后"
        ></error-contact-card>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ErrorContactCard from '../../components/ErrorContactCard.vue'
export default {
    name: 'TurntableError',
    components: {
        ErrorContactCard
    },
    data() {
        return {}
    },
    computed: {
        ...mapGetters(['filterDeviceErrors', 'deviceUsable', 'deviceErrors']),
        deviceErrorCode() {
            return this.deviceErrors.map((err) => err.title).join(',')
        }
    },
    watch: {
        // 监听设备状态
        deviceUsable: {
            handler(val, oldVal) {
                if (val !== oldVal) {
                    this.checkDeviceState(val)
                }
            },
            deep: true
        }
    },
    created() {
        // 修改测量状态
        this.$store.commit('CHANGE_SCAN_STATE', false)
        // 只有网络异常 跳转到网络异常
        if (this.filterDeviceErrors.length === 1 && this.filterDeviceErrors[0].id === 13) {
            this.$store.commit('CHANGE_DEVICE_INFO', { reSelfCheck: true })
            this.$changeViewPage('NetworkAnomaly')
        }
        // 结束本次测量
        this.$shoulderClient.stopShoulderDetect()
        // handleResetScanIDReq()
    },
    methods: {
        // 检查设备状态
        async checkDeviceState() {
            console.log(this.deviceErrors.length == 0 || this.deviceErrors.some((error) => error.id != 8), 888)
            if (this.deviceErrors.length == 0 || this.deviceErrors.some((error) => error.id != 8)) {
                this.$changeViewPage('Home')
            }
        },
        remove() {
            this.$store.commit('REMOVE_DEVICE_ERROR', 8)
        }
    }
}
</script>
<style lang="less" scoped>
.device-error {
    height: 100%;
    .content {
        text-align: center;
        img {
            margin: 505px auto 0px;
            width: 460px;
        }
        h3 {
            font-size: 64px;
            font-family: 'OPPOSansM';
            font-weight: normal;
            line-height: 64px;
            margin: 0;
            color: #e7e9f0;
        }
        p {
            font-size: 40px;
            font-family: 'OPPOSansR';
            font-weight: normal;
            line-height: 64px;
            margin: 24px 0 0;
            svg {
                width: 36px;
                height: 36px;
                vertical-align: middle;
            }
            span {
                width: 800px;
                display: inline-block;
                vertical-align: top;
                text-align: center;
                font-family: 'OPPOSansR';
                font-weight: normal;
                font-size: 40px;
                color: #cccccc;
                line-height: 64px;
                vertical-align: top;
            }
        }
    }
    .info {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        margin-bottom: 96px;
        .error-msg {
            font-size: 36px;
            font-family: 'OPPOSansR';
            font-weight: normal;
            line-height: 48px;
            color: #ced7e0;
            &:before {
                top: 10px;
            }
            span {
                font-size: 36px;
            }
        }
    }
    .error-contact-box {
        position: fixed;
        bottom: 0px;
    }
}
</style>
