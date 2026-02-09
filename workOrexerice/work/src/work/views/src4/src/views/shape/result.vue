<!--
 * @Description: 体态测量结果页
 * @Author: gaoyuanyuan
 * @Date: 2021-04-28 11:32:34
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2024-11-19 14:53:44
-->
<template>
    <div class="result">
        <div class="content">
            <img src="@img/shoulder/scan_success.svg" alt="成功" />
        </div>
        <div class="bottom-msg">
            <msg-card type="success">
                <div slot="success-content">
                    <p class="tip-title">{{ $t('shape.result.bottom-msg-title') }}</p>
                    <div class="list">
                        <div class="item">
                            <img v-if="!measureInfo.shape.status" src="@img/shoulder/checkbox_default.svg" alt="默认" />
                            <img v-else src="@img/shoulder/checkbox_check.svg" alt="勾选" />
                            <p class="title">{{ $t('shape.result.bottom-msg-item1') }}</p>
                        </div>
                        <div class="item">
                            <img v-if="!measureInfo.girth.status" src="@img/shoulder/checkbox_default.svg" alt="默认" />
                            <img v-else src="@img/shoulder/checkbox_check.svg" alt="勾选" />
                            <p class="title">{{ $t('shape.result.bottom-msg-item2') }}</p>
                        </div>
                    </div>
                </div>
            </msg-card>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import MsgCard from '@/components/MsgCard.vue'
export default {
    name: 'ShapeResult',
    components: {
        MsgCard
    },
    computed: {
        ...mapGetters(['measureInfo', 'deviceInfo'])
    },
    created() {
        this.$emit('on-audio-event', 'playAudio', 'shoulderScanResult')
    },
    methods: {
        ...mapMutations(['CHANGE_MEASURE_INFO']),
        // 语音结束
        audioEndCallback(audioId) {
            if (audioId === 'shoulderScanResult') {
                let continueItem = this.measureInfo.unScanItems.filter((ele) => ele != 2)
                this.$store.commit('CHANGE_MEASURE_INFO', {
                    unScanItems: continueItem
                })
                window.logger.info('设备操作模式', this.deviceInfo.operationMode)
                if (
                    this.measureInfo.unScanItems.length === 0 &&
                    this.deviceInfo.deviceType === 5 &&
                    this.deviceInfo.healthPackageEnable === 2
                ) {
                    window.logger.info('无未测量项目，进入报告页面')
                    this.$changeViewPage('getReport')
                } else {
                    this.$changeViewPage(this.deviceInfo.operationMode === 1 ? 'TouchContinue' : 'GestureContinue')
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.result {
    width: 100%;
    height: 100%;

    .content {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        display: flex;
        justify-content: center;

        img {
            width: 528px;
            height: 528px;
            margin-top: 495px;
        }
    }

    .bottom-msg {
        position: absolute;
        bottom: 150px;
        margin: auto;
        width: 100%;

        .tip-title {
            // margin: 50px 50px 100px 50px !important;
            // font-size: 64px !important;
            // color: #fff !important;
            font-size: 64px !important;
            color: #fff !important;
            line-height: 96px !important;
            margin: 0 auto 64px !important;
        }

        .list {
            display: flex;
            // margin: 20px 70px;
            justify-content: space-around;

            .item {
                display: flex;

                // align-items: center;
                // justify-content: center;
                img {
                    margin-right: 20px;
                    width: 48px;
                    height: 48px;
                }

                .title {
                    width: 264px;
                    margin: 0;
                    font-size: 36px;
                    color: #ced7e0;
                    text-align: left;
                }
            }
        }
    }
}
</style>
