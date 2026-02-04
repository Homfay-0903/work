<template>
    <div class="volume-setting">
        <div class="operation" v-if="deviceInfo.operationMode === 1">
            <nav
                :class="['btn', 'btn-minus', minusStatus ? 'btn-minus-style' : '']"
                role="button"
                title="减少"
                @touchend="btnClick(2)"
            ></nav>
            <div>
                <span class="volume-num">{{ volume }}</span>
                <span class="volume-unit">%</span>
            </div>
            <nav
                :class="['btn', 'btn-plus', plusStatus ? 'btn-plus-style' : '']"
                role="button"
                title="增加"
                @touchend="btnClick(1)"
            ></nav>
        </div>
        <div class="operationCopy" v-else>
            <div>
                <span class="volume-num">{{ volume }}</span>
                <span class="volume-unit">%</span>
            </div>
        </div>
        <img src="@img/setting/scale_left.svg" class="scale-left" alt="左刻度尺" />
        <div class="volume-scrollbar">
            <div class="scrollbar-content">
                <div class="scrollbar-bg" :style="scrollbarBgStyle">
                    <!-- <div
                        v-if="deviceInfo.operationMode === 1"
                        :style="{
                            'background-image': `linear-gradient(180deg, #999999 ${0 - quadHeight}%, #333333 100%)`,
                            'background-size': `100% ${volume}%`
                        }"
                        class="quard"
                    ></div> -->
                    <div
                        v-if="deviceInfo.operationMode === 1"
                        :style="{
                            'background-image': `linear-gradient(180deg, ${gradientColors.startColor} ${
                                0 - quadHeight
                            }%, ${gradientColors.endColor} 100%)`,
                            'background-size': `100% ${volume}%`
                        }"
                        class="quard"
                    ></div>
                    <div
                        v-else
                        :style="{
                            'background-image': `linear-gradient(180deg, ${gradientColors1.startColor} ${
                                0 - quadHeight
                            }%, ${gradientColors1.endColor} 100%)`,
                            'background-size': `100% ${volume}%`
                        }"
                        class="quard"
                    ></div>
                    <!-- <div
                        v-else
                        :style="{
                            'background-image': `linear-gradient(180deg, #00B1D4 ${0 - quadHeight}%, #104EBB 100%)`,
                            'background-size': `100% ${volume}%`
                        }"
                        class="quard"
                    ></div> -->
                </div>
                <i :class="'iconfont icon-' + voiceIcon"></i>
            </div>
        </div>
        <img src="@img/setting/scale_right.svg" class="scale-right" alt="右刻度尺" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'VolumeSetting',
    data() {
        return {
            volume: 30,
            timer: null,
            minusStatus: false,
            plusStatus: false,
            countTime: 0
        }
    },

    computed: {
        // 音量格子显示的高度
        quadHeight() {
            return 100 - this.volume
        },
        voiceIcon() {
            return this.volume === 0 ? 'voice-close' : this.volume < 51 ? 'voice-low' : 'voice-hight'
        },
        ...mapGetters({
            deviceInfo: 'deviceInfo'
        }),
        // 触屏
        gradientColors() {
            if (this.deviceInfo.deviceType === 5) {
                return {
                    startColor: '#00B1D4',
                    endColor: '#104EBB'
                }
            } else {
                return {
                    startColor: '#999999',
                    endColor: '#333333'
                }
            }
        },
        // 非触屏
        gradientColors1() {
            if (this.deviceInfo.deviceType === 5) {
                return {
                    startColor: '#00B1D4',
                    endColor: '#104EBB'
                }
            } else {
                return {
                    startColor: '#00B1D4',
                    endColor: '#104EBB'
                }
            }
        },
        scrollbarBgStyle() {
            return {
                background: this.deviceInfo.deviceType === 5 ? '#565656' : '#333333'
            }
        }
    },

    created() {
        this.$store.commit('CHANGE_PAGE_INFO', {
            btnList: [
                {
                    btn: 'switch',
                    msg: '电源',
                    active: false
                },
                {
                    btn: 'add',
                    msg: '加',
                    active: false
                },
                {
                    btn: 'sub',
                    msg: '减',
                    active: false
                }
            ],
            openNotOperated: true
        })
        this.volume = this.deviceInfo.volume
    },

    methods: {
        // 按键事件
        btnClick(btnType) {
            console.log(btnType)
            // 短按上
            if (btnType === 1) {
                if (btnType === 1) {
                    this.plusStatus = true
                    const setTimer = setInterval(() => {
                        this.plusStatus = false
                        window.clearInterval(setTimer)
                    }, 300)
                }
                if (this.volume <= 99) this.volume++
                this.handlePlayVolume()
                // 长按上
            } else if (btnType === 4) {
                if (btnType === 1) {
                    this.plusStatus = true
                    const setTimer = setInterval(() => {
                        this.plusStatus = false
                        window.clearInterval(setTimer)
                    }, 300)
                }
                if (this.volume <= 95) {
                    this.volume += 5
                } else {
                    this.volume = 100
                }
                this.handlePlayVolume()
                // 短按下
            } else if (btnType === 2) {
                if (btnType === 2) {
                    this.minusStatus = true
                    const setTimer = setInterval(() => {
                        this.minusStatus = false
                        window.clearInterval(setTimer)
                    }, 300)
                }
                if (this.volume >= 1) this.volume--
                this.handlePlayVolume()
                // 长按下
            } else if (btnType === 5) {
                if (btnType === 2) {
                    this.minusStatus = true
                    const setTimer = setInterval(() => {
                        this.minusStatus = false
                        window.clearInterval(setTimer)
                    }, 300)
                }
                if (this.volume >= 5) {
                    this.volume -= 5
                } else {
                    this.volume = 0
                }
                this.handlePlayVolume()
                // 确定btnType === 3 || 返回
            } else if (btnType === 7) {
                this.$changeViewPage('SettingIndex')
            }
            // else if (btnType === 7) {
            //     ++this.countTime
            //     if (this.countTime > 20) {
            //         this.timer = null
            //         this.countTime = 0
            //         if (this.volume <= 95) {
            //             this.volume += 5
            //         } else if (this.volume > 95) {
            //             this.volume = 100
            //         }
            //         this.handlePlayVolume()
            //     }
            // } else if (btnType === 8) {
            //     ++this.countTime
            //     this.timer = null
            //     if (this.countTime > 20) {
            //         this.countTime = 0
            //         if (this.volume >= 5) {
            //             this.volume -= 5
            //         } else if (this.volume >= 1) {
            //             this.volume = 0
            //         }
            //         this.handlePlayVolume()
            //     }
            // }
        },
        // 播放测试音量
        handlePlayVolume() {
            this.$store.commit('CHANGE_DEVICE_INFO', {
                volume: this.volume
            })
            // FIXME:音量设置失败
            this.$controlClient.changeVolume(this.volume)
            if (this.timer) {
                clearTimeout(this.timer)
                this.player(5)
            } else {
                this.player(1)
            }
        },
        //播放音量
        player(time) {
            this.timer = setTimeout(() => {
                this.$emit('on-audio-event', 'stopeAudio')
                this.$emit('on-audio-event', 'playAudio', 'volumeNotification', 5)
            }, 500 * time)
        },
        // 超时未操作处理
        handleNotOperated() {
            this.$changeViewPage('Home')
        }
    }
}
</script>
<style lang="less" scoped>
.volume-setting {
    text-align: center;

    .operation {
        margin-top: 468px;
        padding: 0 204px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn {
            display: inline-block;
            background: rgba(3, 42, 82, 0.34) no-repeat center;
            width: 192px;
            height: 192px;
            border-radius: 32px;
            color: #649cff;
            transition: color 0.2s, background-color 0.2s;
            &:active {
                background-color: @color-blue;
                color: #ffffff;
            }
        }
        .btn-plus {
            background-image: linear-gradient(to top, currentColor, currentColor),
                linear-gradient(to top, currentColor, currentColor);
            background-size: 56px 8px, 8px 56px;
        }
        .btn-minus {
            background-image: linear-gradient(to top, currentColor, currentColor);
            background-size: 56px 8px;
        }
        .volume-num {
            color: #ffffff;
            font-family: 'OPPOSansR';
            font-size: 96px;
        }
        .volume-unit {
            font-size: 48px;
            color: #ffffff;
            opacity: 0.72;
        }
        .btn-minus-style,
        .btn-plus-style {
            background-color: @color-blue;
            color: #ffffff;
        }
    }
    .operationCopy {
        margin-top: 468px;
        padding: 0 204px;
        .volume-num {
            color: #ffffff;
            font-family: 'OPPOSansR';
            font-size: 96px;
        }
        .volume-unit {
            font-size: 48px;
            color: #ffffff;
            opacity: 0.72;
        }
    }
    .scale-left {
        position: absolute;
        width: 60px;
        left: 60px;
        top: 671px;
    }
    .scale-right {
        position: absolute;
        width: 60px;
        right: 60px;
        top: 671px;
    }
    .scrollbar-content {
        .scrollbar-bg {
            position: absolute;
            left: 444px;
            top: 672px;
            width: 192px;
            height: 1000px;
            background: @color-light-gray;
            border-radius: 32px;
            .quard {
                position: relative;
                width: 100%;
                height: 100%;
                background-position: bottom;
                background-repeat: no-repeat;
                border-radius: 32px;
                transition: all 0.2s linear;
            }
        }
        i {
            position: absolute;
            left: 504px;
            top: 1552px;
            font-size: 72px;
            z-index: 100;
            transition: all 0.3s;
        }
    }
}
</style>
