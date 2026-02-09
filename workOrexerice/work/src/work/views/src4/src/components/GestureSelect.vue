<!--
 * @Description: 手势选择
 * @Author: wangmingdong
 * @Date: 2019-12-16 19:36:00
 * @LastEditTime: 2022-12-14 11:15:42
 * @LastEditors: liutq
 -->
<template>
    <div class="gesture-content">
        <div class="man-guide">
            <!-- <video
                id="apose-raise"
                src="media-file://video/gesture/raiseHands.mp4"
                class="guide-video"
                name="apose引导动画"
                preload="auto"
                autoplay
                loop
                width="45%"
            >
                您的浏览器不支持 video 标签。
            </video> -->
            <img class="guide-video" width="100%" src="@/assets/img/shape/raiseHands.png" alt="" />
        </div>
        <div class="card-list">
            <div class="card-item" @touchstart="isTouchScreen(1)">
                <div
                    :class="{
                        'bubble-content': true,
                        hide: !leftText,
                        active: this.select ? this.select === 1 : active === 1
                    }"
                >
                    <p class="content-title">{{ $t('common.gesture-select.left.content-title') }}</p>
                    <p class="content-msg">{{ leftText }}</p>
                </div>
            </div>
            <div class="card-item" @touchstart="isTouchScreen(2)">
                <div
                    :class="{
                        'bubble-content': true,
                        hide: !rightText,
                        active: this.select ? this.select === 2 : active === 2
                    }"
                >
                    <p class="content-title">{{ $t('common.gesture-select.right.content-title') }}</p>
                    <p class="content-msg">{{ rightText }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from '@/util/event-bus'
export default {
    name: 'GestureSelect',
    components: {},
    props: {
        leftText: {
            type: String,
            default: ''
        },
        rightText: {
            type: String,
            default: ''
        },
        // 背景色
        backgroundColor: {
            type: String,
            default: '#000'
        },
        // 备注信息
        memo: {
            type: String,
            default: ''
        },
        // 默认选择
        select: {
            type: Number,
            default: null
        },
        //
        available: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 手势检测结果
            gesture: {
                right: false,
                left: false
            },
            // 当前显示手势
            // 1 左手  2右手 0单手（左手或者右手）
            currentHand: 0,
            changeTimer: null,
            setTimer: null,
            // 选中的项目
            active: 0
        }
    },
    mounted() {
        // 监听检测结果
        EventBus.$on('EventAction', async (type, result) => {
            if (type === 'GestureResult') {
                this.gestureResultHandler(result)
            }
        })
        // 发起手势识别
        if (this.available) {
            this.setTimer = setInterval(() => {
                window.logger.info('延迟三秒启动手势识别---11')
                this.$algClient.startGestureDetect()
                clearInterval(this.setTimer)
            }, 3 * 1000)
        } else {
            window.logger.info('延迟两秒启动手势识别---22')
            this.$algClient.startGestureDetect()
        }

        if (this.leftText && this.rightText) {
            this.currentHand = 1
            this.runChangeHand()
        } else {
            this.currentHand = 0
        }
    },
    beforeDestroy() {
        if (this.changeTimer) {
            clearInterval(this.changeTimer)
        }
        if (this.setTimer) {
            clearInterval(this.setTimer)
        }
        this.$algClient.stopGestureDetect()
    },
    methods: {
        // 触屏识别
        isTouchScreen(type) {
            this.active = type
            this.currentHand = type
            const setTimer = setInterval(() => {
                // 关闭手势识别
                this.$algClient.stopGestureDetect()
                // 移除监听事件
                // EventBus.$off('EventAction')
                this.$emit('on-gesture-feedback', this.active)
                window.clearInterval(setTimer)
            }, 300)
        },
        runChangeHand() {
            if (this.changeTimer) {
                clearInterval(this.changeTimer)
            }
            this.changeTimer = setInterval(() => {
                if (this.currentHand === 1) {
                    this.currentHand = 2
                } else if (this.currentHand === 2) {
                    this.currentHand = 1
                }
            }, 1000)
        },
        gestureResultHandler(result) {
            if (this.gesture.left === false && this.leftText && result === 1) {
                this.active = 1
                this.currentHand = 1
                window.logger.info('手势识别成功左手主动发起关闭手势')
                // 关闭手势识别
                this.$algClient.stopGestureDetect()
                // 移除监听事件
                // EventBus.$off('EventAction')
                this.$emit('on-gesture-feedback', this.active)
            } else if (this.gesture.right === false && this.rightText && result === 2) {
                this.active = 2
                this.currentHand = 2
                window.logger.info('手势识别成功右手主动发起关闭手势')
                // 关闭手势识别
                this.$algClient.stopGestureDetect()
                // 移除监听事件
                // EventBus.$off('EventAction')
                this.$emit('on-gesture-feedback', this.active)
            }
            // if (this.changeTimer) {
            //     clearInterval(this.changeTimer)
            // }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/css" scoped>
.gesture-content {
    position: relative;
    display: flex;
    justify-content: center;
    .guide-video {
        width: 440px;
        height: 340px;
        position: relative;
        top: -74px;
    }

    // 底部卡片
    .card-list {
        position: absolute;
        bottom: 60px;
        width: calc(100% - 96px);
        display: flex;
        justify-content: space-between;
        .card-item {
            flex: 1;
            padding: 0 12px;
            .bubble-content {
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 312px;
                min-width: 192px;
                background: @color-background;
                border-radius: 32px;
                box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.16);
                z-index: 101;
                // border: 8px solid #D4E8FF;
                &.active {
                    background: @color-blue;
                }

                p {
                    margin: 0;
                    text-align: center;
                }
                .content-title {
                    font-size: 36px;
                    color: #ffffff;
                    font-family: OPPOSansR;
                    line-height: 48px;
                    margin: 0 48px;
                }
                .content-msg {
                    font-size: 48px;
                    font-family: OPPOSansM;
                    color: #ffffff;
                    line-height: 63px;
                    width: 388px;
                    margin: 24px auto 0;
                }
            }
        }
    }
    // 中间举手动画
    .man-guide {
        position: relative;
        display: flex;
        justify-content: center;
        margin-bottom: 120px;
        z-index: 100;

        .hand-img {
            height: 270px;
        }
    }
}
</style>
