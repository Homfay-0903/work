<!--
 * @Description: 项目选择卡片
 * @Author: gaoyuanyuan
 * @Date: 2019-12-06 21:59:49
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2025-10-24 13:59:10
 -->
<template>
    <div :class="['scan-project-card', styleType === 1 ? 'in-line' : 'in-list', $i18n.locale]">
        <!-- <video
            id="apose-raise"
            v-if="styleType === 1 && available"
            src="media-file://video/gesture/raiseHands.mp4"
            class="guide-video"
            name="apose引导动画"
            preload="auto"
            autoplay
            loop
            width="100%"
        >
            您的浏览器不支持 video 标签。
        </video> -->
        <img
            id="apose-raise"
            v-if="styleType === 1 && available && gestureFeedback === 0"
            class="guide-video"
            src="@img/select/raiseHands.png"
            alt=""
        />
        <!-- 左 -->
        <img
            id="apose-raise"
            v-if="styleType === 1 && available && gestureFeedback === 1"
            class="guide-video"
            src="@img/select/raiseHands-R.jpg"
            alt=""
        />
        <!-- 右 -->
        <img
            id="apose-raise"
            v-if="styleType === 1 && available && gestureFeedback === 2"
            class="guide-video"
            src="@img/select/raiseHands-L.jpg"
            alt=""
        />

        <img
            v-else-if="styleType === 1 && !available"
            src="@img/select/gesture_default.png"
            class="gesture-default"
            alt="默认图片"
        />
        <div
            v-for="(item, idx) in projectList"
            @touchstart="isTouchScreen(item.active, idx)"
            :key="idx"
            :class="[
                'scan-project',
                {
                    active: activePro === idx + 1,
                    'no-selected': activePro === 0,
                    unselected: activePro !== 0 && idx + 1 !== activePro,
                    'no-gesture': !gestureUsable,
                    error: item.error,
                    'device-pro5': deviceInfo.deviceType === 5
                }
            ]"
        >
            <div v-if="item.active === 0 || item.active === 4" class="tip">
                <img
                    v-if="$i18n.locale === 'zh'"
                    :src="
                        deviceInfo.deviceType === 5
                            ? require('@img/select/laboratory_zh_pro5.png')
                            : require('@img/select/laboratory_zh.png')
                    "
                    class="tip-img"
                    alt="实验室"
                />
                <img
                    v-else-if="$i18n.locale === 'ja'"
                    src="@img/select/laboratory_ja.png"
                    class="tip-img"
                    alt="实验室"
                />
                <img
                    v-else-if="$i18n.locale === 'zhcht'"
                    src="@img/select/laboratory_zhcht.png"
                    class="tip-img"
                    alt="實驗室"
                />
                <img v-else src="@img/select/laboratory_en.png" class="tip-img" alt="实验室" />
            </div>
            <!-- 一项未测量 - 按钮 - 项目选择 -->
            <div class="type-icon">
                <img
                    v-if="item.listIcon && styleType === 1"
                    :src="require(`@img/select/${item.listIcon}.png`)"
                    :alt="item.title"
                    class="type-img"
                />
                <img v-else :src="require(`@img/select/${item.listIcon}.png`)" :alt="item.title" class="button-img" />
            </div>
            <!-- 内容 -->
            <div :class="['content', $i18n.locale]">
                <p
                    :class="{ 'content-title': true }"
                    :style="item.title === '身体成分<br />围度测量' ? 'line-height: 78px' : ''"
                    v-html="
                        item.title +
                        (styleType !== 1 && item.active > 0 && item.title === $t('shen-ti-cheng-fen-celiang')
                            ? '测量'
                            : '')
                    "
                ></p>
                <!-- {{
                        item.title +
                        (styleType !== 1 && item.active > 0 && item.title === $t('shen-ti-cheng-fen-celiang')
                            ? '测量'
                            : '')
                    }} -->
                <img
                    v-if="item.title === '营养分析'"
                    class="wudianliu"
                    :src="activePro === idx + 1 ? require('@img/wudianliu-s.png') : require('@img/wudianliu.png')"
                    alt=""
                />
                <img
                    v-if="item.title === '营养分析<br/> <img/>'"
                    class="wudianliu-gesture"
                    :src="activePro === idx + 1 ? require('@img/wudianliu-s.png') : require('@img/wudianliu.png')"
                    alt=""
                />
                <p :class="{ 'content-msg': true }">{{ item.content }}</p>
                <p
                    v-if="
                        (showNutritionTips(item.active) && item.title !== '营养分析') ||
                        item.title === '身体成分<br />围度测量' ||
                        item.title === '身体成分围度测量' ||
                        item.title === '体围测量'
                    "
                    class="mass-nutrition-tips"
                >
                    {{ $t('home.mass-tips') }}
                </p>
            </div>
            <!-- 样式保留 下次做无触屏操做 -->
            <div v-if="item.skip && styleType === 1 && deviceInfo.operationMode !== 1" class="skip">
                <i18n path="home.skip-tip">
                    <img src="@/assets/img/home/indeterminate-circle-fill.svg" place="subImg" alt="" />
                </i18n>
            </div>
        </div>
        <div
            :class="['gesture-click', isfinishClick ? 'finish-click' : '']"
            v-if="styleType === 1 && isAbleClick"
            @touchstart="isTouchScreen(5)"
        >
            <div class="left">{{ $t('item-select.jie-shu-ce-liang_touch') }}</div>
            <div class="right">
                <img src="@img//select/gesture.png" alt="" />
                <p>{{ $t('item-select.jie-shu-ce-liang_touch_tip') }}</p>
            </div>
        </div>
        <!-- <p class="jumpTxt" @touchend="jump" v-if="styleType === 1" >点击跳过此项目</p> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/util/event-bus'
export default {
    name: 'ScanProjectCard',
    props: {
        // 卡片显示类型 1 手势左右排列 2 按钮上下排列
        styleType: {
            type: Number,
            default: 2
        },
        // 高亮的项目 0 都不选择 1 身体成分 2 体态
        activePro: {
            type: Number,
            default: 0
        },
        projectList: {
            type: Array,
            default() {
                return []
            }
        },
        // 手势是否可用
        available: {
            type: Boolean,
            default: true
        },
        // 控制底部按钮
        isAbleClick: {
            type: Boolean,
            default: false
        },
        // 控制手势按钮点击状态
        isfinishClick: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            delayTimer: null,
            gestureFeedback: 0 // 1-左 2-右
        }
    },
    computed: {
        ...mapGetters(['settingInfo', 'measureInfo', 'deviceUsable', 'deviceInfo']),
        // 手势是否可用 手势开启且手势功能正常下可用
        gestureUsable() {
            return this.settingInfo.gestureState === 1 && this.deviceUsable.gesture
        },
        isStandardMode() {
            return this.settingInfo.deviceMode === 2
        }
    },
    mounted() {
        this.gestureFeedback = 0
        // 手势正常且是手势选择状态则发起算法检测请求
        if (this.gestureUsable && this.styleType === 1) {
            this.delayTimer = setTimeout(() => {
                window.logger.info('延迟两秒启动手势识别')
                // 发起手势识别
                this.$algClient.startGestureDetect()
                // 监听检测结果
                EventBus.$on('EventAction', async (type, result) => {
                    if (type === 'GestureResult') {
                        this.gestureListener(result)
                    }
                })
            }, 2 * 1000)
        }
    },
    // 离开页面
    beforeDestroy() {
        // 清除延时定时器
        clearTimeout(this.delayTimer)
    },
    methods: {
        showNutritionTips(active) {
            return this.deviceInfo.deviceType === 5 && active === 1 && !this.isStandardMode
        },
        // 触屏点击
        isTouchScreen(active, index) {
            let gestureState = false
            if (active === 5) {
                gestureState = true
            }
            // gestureState为手势点击交互 仅在手势测量中使用
            this.$emit('eventType', active, index, gestureState)
        },
        gestureListener(data) {
            if (!this.available) {
                window.logger.info('手势组件不处理')
                return
            }
            // 判断是手势识别响应
            if (data === 1) {
                this.gestureFeedback = 1
                this.$emit('on-gesture-feedback', 1)
            } else if (data === 2) {
                this.gestureFeedback = 2
                this.$emit('on-gesture-feedback', 2)
            }
        }
    }
}
</script>
<style lang="less" type="text/css" scoped>
.scan-project-card {
    padding: 0 60px;

    .guide-video {
        position: absolute;
        top: 350px;
        width: 600px;
        top: 386px;
        left: 0;
        right: 0;
        margin: auto;
    }

    video {
        width: 62%;
        margin-left: 19%;
        margin-top: 120px;
    }

    .gesture-default {
        position: absolute;
        width: 678px;
        top: 340px;
        left: 201px;
    }

    .scan-project {
        position: relative;
        margin-top: 360px;
        border-radius: 32px;
        box-sizing: border-box;
        background: @color-background;
        // transition: border 0.6s ease;

        .tip {
            position: absolute;
            right: 0px;
            top: 0px;
            width: 237px;
            height: 157px;

            .tip-img {
                width: 100%;
                height: 100%;
            }
        }

        .type-icon {
            .type-img {
                height: 210px;
            }

            .button-img {
                height: 210px;
            }
        }

        .content {
            p {
                margin: 0;
            }

            .content-title {
                width: 100%;
                font-size: 56px;
                color: #e7e9f0;
                position: relative;
                line-height: 47px;
            }

            .content-msg {
                font-size: 32px;
                font-family: OPPOSansR;
                font-weight: normal;
                color: #cccccc;
                line-height: 48px;
            }
            .wudianliu,
            .wudianliu-gesture {
                display: inline-block;
                position: absolute;
                top: 94px;
                right: 260px;
                width: 160px;
                height: 58px;
            }
            .wudianliu-gesture {
                top: 548px;
                left: 150px;
            }
            .mass-nutrition-tips {
                font-family: OPPOSans, OPPOSans;
                font-weight: normal;
                font-size: 32px;
                color: #ff791f;
                // line-height: 56px;
                font-style: normal;
                margin-top: 10px;
            }
        }

        .de {
            .content-title {
                font-size: 51px;
            }
        }

        .pt {
            .content-title {
                font-size: 45px;
            }
        }

        &.active {
            background: @color-blue;

            .content-title {
                color: @color-white;
            }

            .content-msg {
                color: #e7e9f0;
            }
            .tr {
                .skip {
                    font-size: 10px;
                }
            }
            .skip {
                background: @color-blue;
            }
        }

        &.no-gesture {
            &.error {
                .content-title {
                    color: #5e687b;
                    font-size: 56px;

                    &::before {
                        content: '';
                        width: 12px;
                        position: absolute;
                        left: -40px;
                        top: 10px;
                        height: 60px;
                        z-index: 10;
                        background-color: @color-red;
                    }
                }
            }
        }
    }
    .scan-project.active.device-pro5 .skip {
        background: #357eff !important;
    }

    // 上下列样式
    &.in-list {
        .scan-project {
            display: flex;
            align-items: center;
            width: 960px;
            min-height: 224px;
            margin: 0 auto 24px;

            .type-icon {
                padding: 54px 0 48px 39px;
            }

            .content {
                margin-left: 48px;

                .content-title {
                    // width: 672px;
                }

                .content-msg {
                    margin-top: 38px;
                    width: 584px;
                }
            }

            .tr {
                .content-title {
                    width: 500px !important;
                    line-height: 70px;
                }
            }
        }
    }

    // 左右行样式
    &.in-line {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .scan-project {
            height: 792px;
            max-width: 468px;
            width: 468px;

            .content {
                padding: 0px 40px;
            }

            .type-icon {
                display: flex;
                justify-content: center;

                .type-img {
                    margin-top: 160px;
                }

                .button-img {
                    margin-top: 160px;
                }
            }

            .content {
                p {
                    text-align: center;
                }

                .content-title {
                    // width: 300px;
                    // height: 168px;
                    line-height: 96px;
                    margin: 62px auto 0;
                }

                .content-msg {
                    margin-top: 24px;
                    // max-width: 361px;
                    max-height: 160px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            .skip {
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                right: 0px;
                bottom: 0px;
                width: 100%;
                height: 80px;
                background: #464646;
                border-radius: 0 0 32px 32px;

                span {
                    margin: 0;
                    font-size: 31px;
                    font-family: OPPOSansR;
                    color: #e7e9f0;
                    display: flex;
                    align-content: center;
                }

                img {
                    width: 48px;
                    margin: -1px 5px 0;
                }
            }

            &.active {
                .skip {
                    background: @color-blue;
                }
            }
        }
    }

    .gesture-click {
        width: 960px;
        background: @color-background;
        // height: 240px;
        border-radius: 32px;
        display: flex;
        position: absolute;
        bottom: 144px;
        justify-content: space-between;

        .left {
            font-size: 64px;
            font-family: OPPOSansM, OPPOSans;
            font-weight: normal;
            color: #ffffff;
            line-height: 96px;
            display: flex;
            align-items: center;
            // line-height: 240px;
            margin-left: 40px;
        }

        .right {
            padding: 40px 40px 24px 40px;
            text-align: center;

            p {
                font-size: 32px;
                font-family: OPPOSansR, OPPOSans;
                font-weight: normal;
                color: #cccccc;
                margin: 0;
                line-height: 48px;
                position: relative;
                top: -20px;
            }

            img {
                width: 104px;
            }
        }
    }
}

.en,
.ja,
.es,
.pt,
.de,
.fr,
.tr,
.it,
.el,
.ru,
.hu {
    .type-img {
        margin-top: 58px !important;
    }
}
.jumpTxt {
    width: 100%;
    height: 67px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 48px;
    color: #75a6fc;
    line-height: 67px;
    text-align: center;
    font-style: normal;
    margin-top: 104px;
}
</style>
