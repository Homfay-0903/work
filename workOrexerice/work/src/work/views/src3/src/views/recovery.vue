<!--
 * @Description: 相机掉线设备恢复页面
 * @Author: fanzongru
 * @Date: 2021-01-23 15:44:48
 * @LastEditors: liutq
 * @LastEditTime: 2023-05-25 11:01:51
 -->
<template>
    <div class="footer-msg">
        <!-- <video src="media-file://video/recovery.mp4" name="设备恢复" preload="auto" autoplay loop width="100%">
            您的浏览器不支持 video 标签。
        </video> -->
        <img class="checkSelf-png" src="@/assets/img/checkSelf/recovery.png" alt="" />
        <i18n path="recovery.she-bei-xiao-zhun-zhong" tag="p" class="model-title">
            <br place="item" />
        </i18n>
        <h3 style=""></h3>
    </div>
</template>

<script>
import { EventBus } from '@/util/event-bus'
export default {
    name: 'Recovery',
    data() {
        return {
            // 服务重启上报数量
            backNum: 0
        }
    },
    async created() {
        window.logger.info('深度相机硬件异常重启扫描、肩部服务')
        this.$store.commit('CHANGE_RECOVERY_STATUS', true)
        // 停止站人检测
        this.$algClient.stopPersonDetect()
        // 发起设备重启扫描服务、肩部服务
        await this.$controlClient.restartScanSrv()
        setTimeout(() => {
            // 重启后重新连接算法服务
            this.$algClient.reconnect()
        }, 20 * 1000)
    },
    mounted() {
        // 服务重启上报后回到首页
        EventBus.$on('EventAction', (type, data) => {
            // 服务状态上报
            if (type === 'ServiceStatus') {
                // 服务
                if (data.name === 'alg') {
                    // 硬件异常恢复统一在store中处理
                    this.$changeViewPage('Home')
                }
            }
        })
    },
    // 离开页面
    beforeDestroy() {
        EventBus.$off('EventAction')
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/css" scoped>
.footer-msg {
    width: 100%;
    height: 100%;
    position: relative;
    text-align: center;
    img {
        margin-top: 585px;
        width: 340px;
        height: 340px;
    }
    .model-title {
        position: absolute;
        top: 984px;
        width: 100%;
        font-size: 64px;
        font-family: OPPOSansM;
        font-weight: normal;
        color: #e7e9f0;
        line-height: 96px;
        margin: 0px;
    }
}
</style>
