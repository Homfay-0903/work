<!--
 * @Description: 设备异常页
 * @Author: wangmingdong
 * @Date: 2019-11-28 15:57:57
 * @LastEditTime: 2025-12-17 23:16:50
 * @LastEditors: liutq
 -->
<template>
    <div class="device-error">
        <div class="content">
            <div class="animated fast fadeIn">
                <img src="@img/error/check_self_error.png" />
                <h3>{{ $t('device-error.title') }}</h3>
                <p>
                    {{ deviceErrorTittle }}{{ deviceErrorTittle ? ',' : '' }} 请重启设备, 错误代码{{ deviceErrorCode }}
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
    name: 'DeviceError',
    components: {
        ErrorContactCard
    },
    data() {
        return {}
    },
    computed: {
        ...mapGetters(['filterDeviceErrors', 'deviceErrors']),
        deviceErrorCode() {
            return this.deviceErrors.map((err) => err.title).join(',')
        },
        deviceErrorTittle() {
            // 获取数组中第一个非空的errorTxt
            return this.deviceErrors
                .filter((err) => err && err.errorTxt && typeof err.errorTxt === 'string' && err.errorTxt.trim() !== '')
                .map((err) => err.errorTxt)
                .join(',')
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
    }
}
</script>
<style lang="less" scoped>
.device-error {
    height: 100%;
    .content {
        text-align: center;
        img {
            margin: 555px auto 23px;
            width: 346px;
        }
        h3 {
            font-size: 64px;
            font-family: 'OPPOSansM';
            font-weight: normal;
            line-height: 96px;
            margin: 0;
            color: #e7e9f0;
        }
        p {
            font-size: 32px;
            font-family: 'OPPOSansR';
            font-weight: normal;
            line-height: 48px;
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
