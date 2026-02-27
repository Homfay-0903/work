<template>
    <div class="device-gesture">
        <div class="content">
            <div class="result-item">
                <template v-if="checkStatus !== 0">
                    <img
                        class="gesture-left"
                        v-if="checkStatus === 1"
                        src="@/assets/img/setting/leftHandGesture.png"
                        alt="左手引导"
                    />
                    <img
                        class="gesture-right"
                        v-if="checkStatus === 2"
                        src="@/assets/img/setting/rightHandGesture.png"
                        alt="右手引导"
                    />
                    <!-- <video
                        v-if="checkStatus === 1"
                        src="media-file://video/setting/leftHandGesture.mp4"
                        class="gesture-video"
                        name="左手引导"
                        preload="auto"
                        autoplay
                        loop
                        width="100%"
                    > 
                        您的浏览器不支持 video 标签。
                    </video>
                    <video
                        v-if="checkStatus === 2"
                        src="media-file://video/setting/rightHandGesture.mp4"
                        class="gesture-video"
                        name="右手引导"
                        preload="auto"
                        autoplay
                        loop
                        width="100%"
                    >
                        您的浏览器不支持 video 标签。
                    </video> -->
                </template>
                <template v-else>
                    <img
                        v-if="gesture.left && !gesture.right"
                        src="@img/setting/leftHandGesture.jpg"
                        class="gesture-left"
                    />
                    <img
                        v-if="gesture.left && gesture.right"
                        src="@img/setting/rightHandGesture.jpg"
                        class="gesture-right"
                    />
                </template>
            </div>
        </div>
        <!-- 底部提醒 -->
        <div class="bottom-msg">
            <transition name="fade-move" mode="out-in" appear>
                <msg-card key="gestureCard" v-if="checkStatus !== 0" class="gesture">
                    <ul slot="info-content">
                        <li>
                            {{
                                $t('setting.detect.guide', [
                                    gesture.left ? $t('setting.detect.you-shou') : $t('setting.detect.zuo-shou')
                                ])
                            }}
                        </li>
                    </ul>
                </msg-card>
                <cut-down-card
                    key="successCrd"
                    v-if="!gesture.right && gesture.left && checkStatus === 0"
                    :duration="0"
                    :title="$t('setting.detect.shi-bie-cheng-gong')"
                    class="success"
                >
                    <img slot="icon" src="@img/setting/set_gesture_icon_success.svg" alt="成功图标" />
                </cut-down-card>
                <cut-down-card
                    key="successEnd"
                    v-if="gesture.right && gesture.left && checkStatus === 0"
                    :duration="5"
                    @on-close="btnClick(7)"
                    suffix
                    :suffixType="4"
                    :title="$t('setting.detect.shi-bie-cheng-gong')"
                    class="success"
                >
                    <img slot="icon" src="@img/setting/set_gesture_icon_success.svg" alt="成功图标" />
                    <p slot="content" class="info-msg">{{ $t('setting.detect.shi-bie-cheng-gong_desc') }}</p>
                </cut-down-card>
            </transition>
        </div>
    </div>
</template>
<script>
import { EventBus } from '@/util/event-bus'
import MsgCard from '@/components/MsgCard.vue'
import CutDownCard from '@/components/CutDownCard.vue'
export default {
    name: 'DetectGesture',
    components: {
        MsgCard,
        CutDownCard
    },
    data() {
        return {
            // 手势检测结果
            gesture: {
                right: false,
                left: false
            },
            // 检测状态 0 停止检测 1 左手检测 2 右手检测
            checkStatus: 0,
            countDownInter: null,
            // 是否回到设置列表页 回到前需等待算法响应
            toSettingDetect: false
        }
    },
    created() {
        this.$emit('on-audio-event', 'playAudio', 'btnEffect')
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: [
                {
                    btn: 'switch',
                    msg: '电源'
                }
            ]
        })
        // this.$store.commit('CHANGE_PAGE_INFO', {
        //     btnList: [
        //         {
        //             btn: 'check',
        //             msg: '确认'
        //         },
        //         {
        //             btn: 'return',
        //             msg: '返回'
        //         }
        //     ],
        //     openNotOperated: true
        // })
        // 监听检测结果
        EventBus.$on('EventAction', (type, result) => {
            if (type === 'GestureResult') {
                if (this.gesture.left === false && result === 1 && this.checkStatus === 1) {
                    this.gesture.left = true
                    this.checkStatus = 0
                    this.startCountDownInter(2)
                    // 都识别成功音效
                    this.$emit('on-audio-event', 'playAudio', 'gestureSuccess')
                } else if (this.gesture.right === false && result === 2 && this.checkStatus === 2) {
                    this.gesture.right = true
                    this.checkStatus = 0
                    // 都识别成功音效
                    this.$emit('on-audio-event', 'playAudio', 'gestureSuccess')
                }
            }
        })
        this.checkStatus = 1
        // 开启手势检测
        this.$algClient.startGestureDetect()
    },
    mounted() {
        // 识别到左手音效
        this.$emit('on-audio-event', 'playAudio', 'gestureLeft')
    },
    beforeDestroy() {
        this.clearCountDownInter()
        if (!this.toSettingDetect) {
            // 关闭手势检测
            this.$algClient.stopGestureDetect()
        }
        this.$emit('on-audio-event', 'stopAudio')
    },
    methods: {
        // 按键事件
        async btnClick(btnType) {
            // 确定
            if (btnType === 3 && this.checkStatus === 0) {
                // 重新检测 重置手势检测结果
                this.gesture = { right: false, left: false }
                this.checkStatus = 1
                this.clearCountDownInter()
                // 识别到左手音效
                this.$emit('on-audio-event', 'playAudio', 'gestureLeft')
                // 返回
            } else if (btnType === 7) {
                this.toSettingDetect = true
                // 关闭手势检测
                await this.$algClient.stopGestureDetect()
                // 跳转到手势识别设置
                // this.$changeViewPage('DetectSetting')
                window.history.go(-1)
            }
        },
        // 倒计时结束
        handleClose() {
            this.clearCountDownInter()
            this.checkStatus = 2
            // 识别到右手音效
            this.$emit('on-audio-event', 'playAudio', 'gestureRight')
        },
        // 启动倒计时计时器
        startCountDownInter(count) {
            this.clearCountDownInter()
            if (count > 0) {
                this.countDownInter = setInterval(() => {
                    if (count === 1) {
                        this.handleClose()
                    } else {
                        // eslint-disable-next-line no-param-reassign
                        count--
                    }
                }, 1000)
            }
        },
        // 销毁倒计时计时器
        clearCountDownInter() {
            clearInterval(this.countDownInter)
        },
        // 超时未操作处理
        handleNotOperated() {
            this.$store.commit('CHANGE_SETTING_INFO', {
                menuType: 0,
                childActive: 0
            })
            this.$changeViewPage('Home')
        }
    }
}
</script>
<style lang="less" scoped>
.device-gesture {
    .content {
        position: absolute;
        width: 100%;
        height: 100%;
        .result-item {
            display: flex;
            flex-direction: column;
            // align-items: center;
            .gesture-img {
                width: 100%;
                height: 100%;
            }
            .gesture-left {
                position: relative;
                top: 664px;
                left: 179px;
                width: 494px;
                height: 958px;
            }
            .gesture-right {
                position: relative;
                top: 664px;
                left: 407px;
                width: 494px;
                height: 958px;
            }
        }
    }
    .bottom-msg {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        .gesture {
            margin-bottom: 144px;
            li {
                max-width: 720px;
                margin-right: 50px;
            }
        }
        .success {
            img {
                width: 96px;
            }
            .info-msg {
                margin: 0 40px;
                font-size: 36px;
                font-family: OPPOSansR;
                font-weight: normal;
                color: #ffffff;
                line-height: 56px;
            }
        }
    }
}
</style>
