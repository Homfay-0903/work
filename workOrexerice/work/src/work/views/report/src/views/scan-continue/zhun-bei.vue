<template>
    <div>
        <!-- <button @click="gainn()">anna</button> -->
        <div class="continue-scan">
            <div class="scan-project animated fast fadeIn">
                <div class="bottom-msg">
                    <transition name="fade-move" mode="out-in" appear>
                        <div v-if="gestureUsable" class="gesture-operation">
                            <gesture-select
                                :select="selectGes"
                                @on-gesture-feedback="onGestureCallback"
                                backgroundColor="#454f58"
                                :available="true"
                                :rightText="$t('girth.select.item1.content')"
                                leftText="退出测量"
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
                <div class="top-tips">*请确保穿着符合要求，否则将会影响测量准确性。</div>
                <div class="class-zun-bei">
                    <div>
                        <img v-if="deviceInfo.teenagerIsOpen" src="@/assets/img/women1.png" alt="" />
                        <img v-else src="@/assets/img/women.png" alt="" />
                        <span
                            ><img src="@/assets/img/user@2x.png" alt="" /> 女{{
                                deviceInfo.teenagerIsOpen ? '生' : '士'
                            }}请穿着紧身服饰</span
                        >
                    </div>
                    <div>
                        <img v-if="deviceInfo.teenagerIsOpen" src="@/assets/img/men@2x1.png" alt="" />
                        <img v-else src="@/assets/img/men@2x.png" alt="" />
                        <span
                            ><img src="@/assets/img/jersey@2x.png" alt="" /> 男{{
                                deviceInfo.teenagerIsOpen ? '生' : '士'
                            }}请脱掉上衣</span
                        >
                    </div>
                </div>
            </div>
            <cut-down-load ref="cutDown" @cut-down-over="onCutDownOver" :duration="60" :suffixType="1"></cut-down-load>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import KeySelect from '@/components/KeySelect.vue'
import GestureSelect from '@/components/GestureSelect.vue'
import CutDownLoad from '@/components/CutDownLoad.vue'
import * as types from '@/store/mutation-types'
export default {
    name: 'ZhunBei',
    components: {
        CutDownLoad,
        KeySelect,
        GestureSelect
    },
    computed: {
        ...mapGetters(['measureInfo', 'settingInfo', 'deviceUsable', 'deviceInfo', 'measureInfo', 'standPeople']),
        // 手势是否可用 手势开启且手势功能正常下可用
        gestureUsable() {
            return this.settingInfo.gestureState === 1 && this.deviceUsable.gesture
        },

        // 是否为标准模式
        isStandardMode() {
            return this.settingInfo.deviceMode === 2
        },
        itemsContent() {
            return [
                {
                    icon: 'checkdui',
                    content: this.$t('girth.select.item1.content'),
                    remarks: `可继续${
                        this.deviceInfo.healthPackageEnable === 2
                            ? '身体成分围度'
                            : this.isStandardMode
                            ? '身体成分围度'
                            : parseInt(this.$route.query.typeSort) === 3
                            ? '营养分析'
                            : '身体成分围度'
                    }测量`
                },
                {
                    icon: 'end',
                    content: '退出测量',
                    remarks: '退出测量将返回项目选择'
                }
            ]
        },
        isStand() {
            return this.standPeople
        }
    },
    watch: {
        isStand: {
            handler(val) {
                if (!val) {
                    this.touchScreenTimer('RunTime')
                }
            },
            deep: true
        }
    },
    data() {
        return {
            // 按钮选择下标
            selectIdx: 0,
            selectGes: 0
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
            this.$emit('on-audio-event', 'playAudio', 'zunBeiBtn')
        } else {
            // if (this.deviceInfo.operationMode === 2) {
            this.$emit('on-audio-event', 'playAudio', 'zunBei')
            // } else {
            //     this.$emit('on-audio-event', 'playAudio', 'continueScanGirthBtn_touch')
            // }
        }
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList
        })
        this.setMeteTitle(this.$route.query?.typeSort)
    },
    methods: {
        ...mapMutations([types.METE_TITLE]),
        setMeteTitle(type) {
            const conditionMet = this.$route.meta.nav && this.$route.meta.nav.icon && type

            // 构建基础参数
            const baseProps = {
                prev: 'navigation-bar.xiang-mu-xuan-ze',
                title: 'navigation-bar.qing-zuo-hao-yi-xia-zhun-bei',
                align: 'center',
                icon: false,
                isBackPre: true
            }

            // 根据条件决定是否包含 icon 属性
            const conditionalProps = conditionMet
                ? { icon: undefined } // 条件满足时，不添加 icon（实现删除效果）
                : {} // 条件不满足时，添加 icon

            // 根据 type 设置不同的 prev 值
            if ([1, '1'].includes(type)) {
                baseProps.prev =
                    this.settingInfo.combineMeasureEnable && this.settingInfo.triMode && this.isStandardMode
                        ? '首页'
                        : 'navigation-bar.xiang-mu-xuan-ze'
            }

            const meteTitleParams = { ...baseProps, ...conditionalProps }

            this.METE_TITLE(meteTitleParams)
        },
        gainn() {
            this.$store.commit('CHANGE_STAND_PEOPLE', true)
            this.$store.commit('CHANGE_STAND_PEOPLE', false)
        },
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
                        window.history.go(-1)
                    } else if (this.selectGes === 2) {
                        // this.$changeViewPage('ShapeResult')

                        this.touchScreenTimer('WeightGuide', {
                            canSkip: true,
                            typeSort: this.$route.query.typeSort
                        })
                    }
                    // 按键模式
                } else {
                    // 继续测量
                    if (this.selectIdx === 1) {
                        window.history.go(-1)
                    } else {
                        // this.$changeViewPage('ShapeResult')
                        this.touchScreenTimer('WeightGuide', { canSkip: true, typeSort: this.$route.query.typeSort })
                    }
                }
                // 返回
            } else if (btnType === 7) {
                // 统一返回首页 由首页处理异常跳转逻辑
                // this.$changeViewPage('getReport')
                window.history.go(-1)
            }
        },
        onCutDownOver() {
            this.$changeViewPage('getReport')
        },
        touchScreenTimer(page, query) {
            const setTimer = setInterval(() => {
                this.$changeViewPage(page, query)
                this.type = 0
                window.clearInterval(setTimer)
            }, 300)
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
                window.history.go(-1)
            } else {
                this.touchScreenTimer('WeightGuide', { canSkip: true, typeSort: this.$route.query.typeSort })
                // this.$changeViewPage('ShapeResult')
            }
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.continue-scan {
    .scan-project {
        margin-top: 328px;
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

    .info {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 101;
        margin-bottom: 96px;
    }
    .top-tips {
        position: absolute;
        background: rgba(255, 121, 31, 0.34);
        width: 100%;
        height: 56px;
        text-align: center;
        top: 384px;
        font-family: OPPOSans, OPPOSans;
        font-weight: normal;
        font-size: 32px;
        color: #ff791f;
        line-height: 56px;
        font-style: normal;
    }
    .class-zun-bei {
        position: absolute;
        top: 440px;
        display: flex;
        justify-content: space-between;
        padding: 40px 84px;
        text-align: center;
        font-weight: normal;
        font-size: 40px;
        color: #e7e9f0;
        line-height: 53px;
        text-align: right;
        font-style: normal;
        div {
            margin: 8px;
            width: 432px;
            height: 576px;
            background: #1a1a1a;
            img {
                width: 432px;
                height: 576px;
            }
            text-align: center;
            span {
                font-weight: normal;
                font-size: 40px;
                color: #e7e9f0;
                line-height: 53px;
                display: inline-block;
                margin-top: 12px;
                img {
                    position: relative;
                    top: 4px;
                    width: 35px;
                    height: 38px;
                }
            }
        }
    }
}
</style>
