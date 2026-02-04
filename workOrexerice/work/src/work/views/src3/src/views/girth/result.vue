<!--
 * @Description: 体围测量结果页
 * @Author: gaoyuanyuan
 * @Date: 2021-04-28 11:32:34
 * @LastEditors: liutq
 * @LastEditTime: 2026-01-04 15:46:14
-->
<template>
    <div class="result">
        <div class="content">
            <img src="@img/shoulder/scan_success.svg" alt="成功" />
            <p class="tips">{{ $t('mass.success') }}</p>
        </div>
        <!-- <p class="bottom-p">{{ $t('mass.success') }}</p> -->
        <div class="bottom-msg" v-if="deviceInfo.deviceType === 3 && measureInfo.weight.status">
            <msg-card type="success">
                <div slot="success-content">
                    <p class="tip-title">{{ $t('shape.result.bottom-msg-title') }}</p>
                    <div class="list" v-if="measureInfo.weight.status">
                        <!-- <div class="item">
                            <img
                                v-if="!measureInfo.weight.status || !measureInfo.girth.status"
                                src="@img/shoulder/checkbox_default.svg"
                                alt="默认"
                            />
                            <img v-else src="@img/shoulder/checkbox_check.svg" alt="勾选" />
                            <p class="title">{{ $t('shape.result.bottom-msg-item4') }}</p>
                        </div> -->
                        <div class="item">
                            <img
                                v-if="!measureInfo.weight.status"
                                src="@img/shoulder/checkbox_default.svg"
                                alt="默认"
                            />
                            <img v-else src="@img/shoulder/checkbox_check.svg" alt="勾选" />
                            <p class="title">{{ $t('shape.result.bottom-msg-item4') }}</p>
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
import * as types from '@/store/mutation-types'
export default {
    name: 'ShapeResult',
    // beforeRouteEnter(to, from, next) {
    //     next(() => {
    //         if (to.query?.typeSort) {
    //             const type = to.query?.typeSort
    //             if (type == 3) {
    //                 to.meta.nav.prev = 'navigation-bar.wu-dian-liu'
    //             } else if (type == 1) {
    //                 to.meta.nav.prev = 'item-select.shen-ti-cheng-fen-ce-liang-wei-du'
    //             }
    //         }
    //     })
    // },
    components: {
        MsgCard
    },
    computed: {
        ...mapGetters(['measureInfo', 'deviceInfo', 'settingInfo'])
    },
    created() {
        this.setMeteTitle(this.$route.query?.typeSort)
        this.$emit('on-audio-event', 'playAudio', 'shoulderScanResult')
    },
    methods: {
        ...mapMutations(['CHANGE_MEASURE_INFO', types.METE_TITLE]),
        setMeteTitle(type) {
            // 条件判断：是否需要删除 icon
            const conditionMet = this.$route.meta.nav && this.$route.meta.nav.icon && type

            // 构建基础参数
            const baseProps = {
                prev: 'navigation-bar.ti-wei-ce-liang',
                title:
                    this.settingInfo.combineMeasureEnable && this.settingInfo.triMode && [1, '1'].includes(type)
                        ? '体态体围测量'
                        : 'navigation-bar.ti-wei-ce-liang',
                align: '',
                icon: undefined,
                isBackPre: false
            }

            // 根据条件决定是否包含 icon 属性
            const conditionalProps = conditionMet
                ? { icon: undefined } // 条件满足时，不添加 icon（实现删除效果）
                : {} // 条件不满足时，添加 icon

            // 根据 type 设置不同的 prev 值
            if ([3, '3'].includes(type)) {
                baseProps.prev = 'navigation-bar.wu-dian-liu'
            } else if ([1, '1'].includes(type)) {
                baseProps.prev =
                    this.settingInfo.combineMeasureEnable && this.settingInfo.triMode
                        ? '身体评估'
                        : 'item-select.shen-ti-cheng-fen-ce-liang-wei-du'
            }

            const meteTitleParams = { ...baseProps, ...conditionalProps }

            this.METE_TITLE(meteTitleParams)
        },
        // 语音结束
        audioEndCallback(audioId) {
            if (audioId === 'shoulderScanResult') {
                let continueItem = this.measureInfo.unScanItems.filter((ele) => ele != 3)
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
        top: 183px;
        display: flex;
        // justify-content: center;
        align-items: center;
        flex-direction: column;
        img {
            width: 528px;
            height: 528px;
            margin-top: 395px;
        }
        .tips {
            font-size: 55px;
            color: #fff;
        }
    }

    .bottom-p {
        position: absolute;
        top: 1232px;
        font-size: 64px;
        font-family: OPPOSans-M, OPPOSans;
        font-weight: normal;
        color: #ffffff;
        line-height: 96px;
        left: 0;
        right: 0;
        margin: auto;
        text-align: center;
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
                    width: 334px;
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
