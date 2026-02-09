<!--
 * @Description: 体围测量选择页
 * @Author: gaoyuanyuan
 * @Date: 2021-04-27 17:55:53
 * @LastEditors: liutq
 * @LastEditTime: 2024-09-06 11:04:29
-->
<template>
    <div class="select">
        <div class="content">
            <img src="@img/select/item_girth.png" alt="体围项目图标" />
            <p>{{ $t('girth.select.content') }}</p>
        </div>
        <div class="bottom-msg">
            <transition name="fade-move" mode="out-in" appear>
                <div v-if="gestureUsable" class="gesture-operation">
                    <gesture-select
                        :select="selectGes"
                        @on-gesture-feedback="onGestureCallback"
                        backgroundColor="#454f58"
                        :rightText="$t('girth.select.item2.content')"
                        :leftText="$t('girth.select.item1.content')"
                    ></gesture-select>
                </div>
                <key-select
                    v-else
                    :select="selectIdx"
                    :items="itemsContent"
                    @on-key-feedback="onKeyFeedback"
                ></key-select>
            </transition>
        </div>
        <cut-down-load ref="cutDown" @cut-down-over="onCutDownOver" :duration="60" :suffixType="2"></cut-down-load>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CutDownLoad from '@/components/CutDownLoad.vue'
import GestureSelect from '@/components/GestureSelect.vue'
import KeySelect from '@/components/KeySelect.vue'
export default {
    name: 'GirthSelect',
    beforeRouteEnter(to, from, next) {
        next(() => {
            if (to.query?.typeSort) {
                const type = to.query?.typeSort
                if (type == 3) {
                    to.meta.nav.prev = 'navigation-bar.wu-dian-liu'
                } else if (type == 1) {
                    to.meta.nav.prev = 'item-select.shen-ti-cheng-fen-ce-liang-wei-du'
                }
            }
        })
    },
    components: {
        CutDownLoad,
        GestureSelect,
        KeySelect
    },
    data() {
        return {
            // 按钮选择下标
            selectIdx: 0,
            selectGes: 0
        }
    },
    computed: {
        ...mapGetters(['measureInfo', 'settingInfo', 'deviceUsable', 'deviceInfo']),
        // 手势是否可用
        gestureUsable() {
            // 按键启动的后续选择全部使用按键
            return this.settingInfo.gestureState === 1 && this.deviceUsable.gesture
        },
        itemsContent() {
            return [
                {
                    icon: 'restart',
                    content: this.$t('girth.select.item1.content'),
                    remarks: this.$t('girth.select.item1.remarks')
                },
                {
                    icon: 'end',
                    content: this.$t('girth.select.item2.content'),
                    remarks: this.$t('girth.select.item2.remarks')
                }
            ]
        }
    },
    created() {
        let btnList = [
            {
                btn: 'switch',
                msg: '电源'
            }
        ]
        // 按钮模式
        if (!this.gestureUsable) {
            btnList.push(
                {
                    btn: 'add',
                    msg: '加'
                },
                {
                    btn: 'sub',
                    msg: '减'
                }
            )
            this.$emit('on-audio-event', 'playAudio', 'continueScanGirthBtn_touch')
        } else {
            if (this.deviceInfo.operationMode === 2) {
                this.$emit('on-audio-event', 'playAudio', 'continueScanGesture')
            } else {
                this.$emit('on-audio-event', 'playAudio', 'continueScanGirthBtn_touch')
            }
        }
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList
        })
    },
    methods: {
        // 触屏
        onKeyFeedback(active) {
            this.selectIdx = active
            const setTimer = setInterval(() => {
                this.btnClick(3)
                window.clearInterval(setTimer)
            }, 300)
        },
        // 按键事件
        btnClick(btnType) {
            // 上
            if (btnType === 1) {
                // 使用按钮 上下切换
                if (!this.gestureUsable) {
                    if (this.selectIdx > 0) {
                        this.selectIdx = 0
                    } else {
                        this.selectIdx = 1
                    }
                } else {
                    if (this.selectGes > 1) {
                        this.selectGes = 1
                    } else {
                        this.selectGes = 2
                    }
                }
                // 下
            } else if (btnType === 2) {
                // 使用按钮 上下切换
                if (!this.gestureUsable) {
                    if (this.selectIdx < 1) {
                        this.selectIdx = 1
                    } else {
                        this.selectIdx = 0
                    }
                } else {
                    if (this.selectGes < 2 && this.selectGes != 0) {
                        this.selectGes = 2
                    } else {
                        this.selectGes = 1
                    }
                }
                // 确定
            } else if (btnType === 3) {
                // 手势模式
                if (this.gestureUsable) {
                    if (this.selectGes) {
                        // 关闭手势识别
                        this.$algClient.stopGestureDetect()
                    }
                    if (this.selectGes === 1) {
                        // 关闭手势识别
                        // 继续测量
                        this.$changeViewPage('GirthGuide')
                    } else if (this.selectGes === 2) {
                        this.$changeViewPage('ShapeResult')
                    }
                    // 按键模式
                } else {
                    // 继续测量
                    if (this.selectIdx === 0) {
                        this.$changeViewPage('GirthGuide')
                    } else {
                        this.$changeViewPage('ShapeResult')
                    }
                }
                // 返回
            } else if (btnType === 7) {
                // 统一返回首页 由首页处理异常跳转逻辑
                this.$changeViewPage('getReport')
            }
        },
        onCutDownOver() {
            this.$changeViewPage('getReport')
        },
        // 手势组件响应回调处理 1 左 2 右
        onGestureCallback(data) {
            window.logger.info(`体围选择页面${data === 1 ? '左手' : '右手'}识别成功`)
            this.selectIdx = data - 1
            // 播放识别成功音效
            this.$emit('on-audio-event', 'playAudio', 'gestureEffect', 2)
            this.handleGestureConfirm()
        },
        // 手势识别确认逻辑
        handleGestureConfirm() {
            // 关闭手势识别
            this.$algClient.stopGestureDetect()
            // 继续测量
            if (this.selectIdx === 0) {
                this.$changeViewPage('GirthGuide')
            } else {
                this.$changeViewPage('ShapeResult')
            }
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.select {
    width: 100%;
    height: 100%;
    .content {
        position: absolute;
        width: 100%;
        height: 100%;
        padding-top: 556px;
        text-align: center;
        img {
            width: 288px;
        }
        p {
            font-size: 64px;
            font-family: OPPOSansM;
            line-height: 96px;
        }
    }
    .bottom-msg {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        .manual-operation {
            display: flex;
            flex-direction: column;
            margin: 0 auto 144px;

            .option-list {
                position: relative;
                border-radius: 32px;
                margin: 12px 65px;
                .normal-border();
                padding: 40px 0;
                display: flex;

                .list-icon {
                    display: flex;
                    align-items: center;
                    margin: 0px 72px;
                }

                .title {
                    color: #e7e9f0;
                    font-size: 48px;
                    font-family: 'OPPOSansR';
                    margin: 0;
                }

                .remarks {
                    color: #cccccc;
                    font-size: 40px;
                    font-family: 'OPPOSansR';
                    margin: 0;
                    margin-top: 10px;
                }

                &.active {
                    .active-border();
                    padding: 40px 0;

                    .title {
                        color: #ffffff;
                    }

                    .remarks {
                        color: #e7e9f0;
                    }
                }
            }
        }
        .gesture-operation {
            margin-bottom: 86px;
        }
    }
}
</style>
