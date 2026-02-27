<!--
 * @Description: 设备到期提醒
 * @Author: WendyGao
 * @Date: 2022-02-17 15:22:54
 * @LastEditors: liutq
 * @LastEditTime: 2022-09-28 10:16:35
-->
<template>
    <div class="renewal">
        <img src="@img/renewal/server.png" alt="服务器" />
        <h1>服务器数据存储续费通知</h1>
        <p>
            您的设备云端数据存储服务已到期，设备已无法使用。<br />请您尽快到设备B端管理平台 {{ address }}
            完成年费续缴。续费完成后设备恢复使用，若续费后未恢复使用，请尝试重启设备。如有疑问可咨询维塑官方客服：400-161-7020
        </p>
        <!-- <i></i> -->
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/util/event-bus'

export default {
    name: 'Renewal',
    computed: {
        ...mapGetters(['deviceInfo']),
        address() {
            if (this.deviceInfo.operationMode === 1) {
                return 'http://rpro5.visbody.com'
            } else {
                return 'http://rpro3.visbody.com'
            }
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
            if (type === 'ExpStatus') {
                if (this.deviceInfo.renewalStatus < 3) {
                    // 转台站人 启动测量
                    window.logger.info('设备端到期续费提醒页已续费')
                    this.$changeViewPage('Home')
                }
            } else if (type === 'netWorktStatus') {
                if (!data.online) {
                    this.$changeViewPage('NetworkAnomaly')
                    window.logger.info('设备端到期续费提醒页网络中断')
                }
            }
        })
    }
}
</script>
<style lang="less" type="text/css" scoped>
.renewal {
    text-align: center;
    img {
        margin-top: 274px;
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
        margin: 0;
        padding: 0 96px;
        line-height: 68px;
        font-family: OPPOSansR;
        font-weight: normal;
        color: #ced7e0;
        font-size: 64px;
        word-break: break-all;
        font-size: 36px;
        &:last-child {
            font-size: 36px;
        }
    }
    i {
        display: block;
        margin: 60px auto;
        width: 900px;
        height: 2px;
        background: #5e687b;
        opacity: 0.5;
    }
}
</style>
