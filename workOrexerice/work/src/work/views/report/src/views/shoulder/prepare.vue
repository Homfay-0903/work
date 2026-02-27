<!--
 * @Description: 肩关节灵活度环境设定
 * @Author: fanzongru
 * @Date: 2021-01-27 13:46:14
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2025-08-07 10:06:46
-->
<template>
    <div class="shoulder-scan-prepare">
        <div class="content">
            <transition name="fade" mode="out-in" appear>
                <!-- <video
                    :src="`media-file://video/shoulder/${$i18n.locale}/guideTurntable.mp4`"
                    name="站位引导"
                    preload="auto"
                    loop
                    autoplay
                >
                    您的浏览器不支持 video 标签。
                </video> -->
                <img
                    v-if="this.deviceInfo.deviceType === 5"
                    class="fade-png"
                    src="@/assets/img/shape/guideTurntable_pro5.png"
                    alt=""
                />
                <img v-else class="fade-png" src="@/assets/img/shape/guideTurntable.png" alt="" />
            </transition>
        </div>
        <!-- 底部提醒 -->
        <div class="bottom-msg">
            <transition name="fade-move" mode="out-in" appear>
                <msg-card key="gestureCard" class="gesture">
                    <ul slot="info-content">
                        <li>{{ $t('shape.guide.bottom-msg1') }}</li>
                        <li>{{ $t('shape.guide.bottom-msg2') }}</li>
                    </ul>
                </msg-card>
            </transition>
        </div>
        <!-- 底部倒计时进度条 -->
        <cut-down-load
            ref="cutDown"
            @cut-down-over="cutDownOver"
            :duration="30"
            :suffixType="2"
            class="cut-down"
        ></cut-down-load>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import MsgCard from '@/components/MsgCard.vue'
import CutDownLoad from '@/components/CutDownLoad.vue'
import { EventBus } from '@/util/event-bus'
import * as types from '@/store/mutation-types'
export default {
    name: 'ShoulderPrepare',
    components: {
        MsgCard,
        CutDownLoad
    },
    data() {
        return {
            clockTimer: null,
            // 倒计时超时
            timeout: false,
            // 语音是否播放完成
            isAudioComplete: false,
            // 手势是否检测成功
            iposeResult: false
        }
    },
    computed: {
        ...mapGetters(['measureInfo', 'deviceUsable', 'deviceInfo'])
    },
    created() {
        this.$emit('on-audio-event', 'stopAudio')
        window.logger.info('进入肩部功能测量准备页面')
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: [],
            openNotOperated: true
        })
        // 初始化
        this.isAudioComplete = false
        this.iposeResult = false
        // 修改扫描状态
        this.$store.commit('CHANGE_SCAN_STATE', true)
        const that = this
        setTimeout(function () {
            // 发起站人检测 延时一秒防止项目选择页关闭手势检测
            that.$algClient.startGestureIposeDetect()
        }, 1000)
        this.$store.commit('CHANGE_MEASURE_INFO', {
            shoulder: { isMeasured: true }
        })
        this.clockTimer = setTimeout(() => {
            window.logger.info('手势识别状态', this.deviceUsable.gesture)
            // 手势识别异常直接跳过站人识别
            if (!this.deviceUsable.gesture) {
                this.toScan()
            }
        }, 6 * 1000)
        this.setMeteTitle()
    },
    mounted() {
        this.$emit('on-audio-event', 'playAudio', 'guideTurntable')
        // 监听手势服务
        EventBus.$on('EventAction', (type, data) => {
            if (type === 'GestureIposeResult') {
                if (data === 1) {
                    window.logger.info('Ipose 检测成功')
                    this.iposeResult = true
                    // 语音播放完成
                    if (this.isAudioComplete) {
                        this.toScan()
                    }
                }
            }
        })
    },
    methods: {
        ...mapMutations([types.METE_TITLE]),
        setMeteTitle() {
            this.METE_TITLE({
                prev: 'common.jian-bu-gong-neng',
                title: '',
                leave: true,
                align: '',
                icon: undefined
            })
        },
        // 语音结束
        audioEndCallback(audioId) {
            if (audioId === 'guideTurntable' || audioId === 'shutDownInUse') {
                this.$emit('on-audio-event', 'playAudio', 'guideTurntable')
                this.isAudioComplete = true
                // 手势识别成功
                if (this.iposeResult) {
                    this.toScan()
                }
            }
        },
        toScan() {
            // 关闭算法
            this.$algClient.stopGestureIposeDetect()
            // 转到对应页面hhhhhhhhhhhhhhhhhhhhhhhhhhhh
            this.$changeViewPage('ShoulderScan')
        },
        // 倒计时结束 关闭算法
        cutDownOver() {
            // 倒计时超时
            this.timeout = true
            // 关闭算法
            this.$algClient.stopGestureIposeDetect()
            clearTimeout(this.clockTimer)
            // 返回首页
            this.$changeViewPage('getReport')
        }
    }
}
</script>
<style lang="less" scoped>
.shoulder-scan-prepare {
    .content {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;

        .fade-png {
            width: 348px;
            height: 970px;
            position: relative;
            left: 0;
            right: 0;
            top: 446px;
        }

        .fade-png1 {
            width: 100%;
            // height: 970px;
            position: relative;
            left: 0;
            right: 0;
            // top: 416px;
        }
    }

    .bottom-msg {
        position: absolute;
        left: 0;
        bottom: 144px;
        width: 100%;

        .gesture {
            li {
                max-width: 720px;
                margin-right: 50px;
            }
        }

        .info {
            .msg {
                text-align: center;
                font-size: 48px;
                font-family: OPPOSansR;
                font-weight: normal;
                color: #ffffff;
                line-height: 54px;
                margin: 36px auto 24px;
            }
        }
    }

    .cut-down {
        bottom: 24px;
    }
}
</style>
