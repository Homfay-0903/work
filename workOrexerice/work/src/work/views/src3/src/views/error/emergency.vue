<!--
 * @Description: 紧急制动
 * @Author: WendyGao
 * @Date: 2022-02-14 16:56:50
 * @LastEditors: WendyGao
 * @LastEditTime: 2022-02-17 11:56:33
-->
<template>
    <div class="emergency">
        <div class="content">
            <img src="@img/error/emergency.png" class="icon-board" alt="stop" />
            <h3>紧急制动</h3>
            <p>
                当前设备被禁止使用，待工作人员确认无危险后，
                <br />再复位紧急制动按钮继续使用。
            </p>
        </div>
        <div class="info">
            <transition name="fade-move" appear>
                <msg-card>
                    <ul slot="info-content">
                        <li>非工作人员，请勿操作紧急制动按钮</li>
                    </ul>
                </msg-card>
            </transition>
        </div>
    </div>
</template>
<script>
import MsgCard from '@/components/MsgCard.vue'
export default {
    name: 'Emergency',
    components: {
        MsgCard
    },
    created() {
        this.$store.commit('CLEAR_DEVICED_ERRORS')
        // 修改扫描状态
        this.$store.commit('CHANGE_SCAN_STATE', false)
    }
}
</script>
<style lang="less" type="text/css" scoped>
.emergency {
    height: 100%;
    .content {
        text-align: center;
        img {
            width: 415px;
            margin: 475px 0 188px;
        }
        h3 {
            font-size: 64px;
            font-family: 'OPPOSansM';
            font-weight: normal;
            line-height: 96px;
            margin: 0;
        }
        p {
            width: 66%;
            font-size: 32px;
            font-family: 'OPPOSansR';
            font-weight: normal;
            line-height: 48px;
            margin: 48px auto 0;
            text-align: left;
        }
    }
    .info {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        margin-bottom: 96px;
    }
}
</style>
