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
                <span class="volume-num">{{ luminance }}</span>
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
                <span class="volume-num">{{ luminance }}</span>
                <span class="volume-unit">%</span>
            </div>
        </div>
        <img src="@img/setting/scale_left.svg" class="scale-left" alt="左刻度尺" />
        <div class="volume-scrollbar">
            <div class="scrollbar-content">
                <div class="scrollbar-bg">
                    <!-- 'background-image': `linear-gradient(180deg, #1D66E6 ${0 - quadHeight}%,#1D66E6 100%)`, -->
                    <div
                        v-if="deviceInfo.operationMode === 1"
                        :style="{
                            'background-image': `linear-gradient(180deg, #FFFFFF ${0 - quadHeight}%,#FFFFFF 100%)`,
                            'background-size': `100% ${luminance}%`
                        }"
                        class="quard"
                    ></div>
                    <div
                        v-else
                        :style="{
                            'background-image': `linear-gradient(180deg, #FFFFFF ${0 - quadHeight}%, #FFFFFF 100%)`,
                            'background-size': `100% ${luminance}%`
                        }"
                        class="quard"
                    ></div>
                </div>
                <!-- <i :class="'iconfont icon-' + voiceIcon"></i> -->
                <img src="@/assets/img/setting/sun-line-1.svg" />
            </div>
        </div>
        <img src="@img/setting/scale_right.svg" class="scale-right" alt="右刻度尺" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Luminance',
    data() {
        return {
            luminance: 30,
            timer: null,
            minusStatus: false,
            plusStatus: false
        }
    },

    computed: {
        // 音量格子显示的高度
        quadHeight() {
            return 100 - this.luminance
        },
        voiceIcon() {
            return this.luminance === 0 ? 'voice-close' : this.luminance < 51 ? 'voice-low' : 'voice-hight'
        },
        ...mapGetters({
            deviceInfo: 'deviceInfo'
        })
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
        this.luminance = this.deviceInfo.luminance
    },

    methods: {
        // 按键事件
        btnClick(btnType) {
            // 上
            if (btnType === 1 || btnType === 4) {
                if (btnType === 1) {
                    this.plusStatus = true
                    const setTimer = setInterval(() => {
                        this.plusStatus = false
                        window.clearInterval(setTimer)
                    }, 300)
                }
                if (this.luminance <= 95) {
                    this.luminance += 5
                } else {
                    this.luminance = 100
                }
                this.handlePlayVolume()
                // 下
            } else if (btnType === 2 || btnType === 5) {
                if (btnType === 2) {
                    this.minusStatus = true
                    const setTimer = setInterval(() => {
                        this.minusStatus = false
                        window.clearInterval(setTimer)
                    }, 300)
                }
                if (this.luminance >= 5) {
                    this.luminance -= 5
                } else {
                    this.luminance = 0
                }
                this.handlePlayVolume()
                // 返回
            } else if (btnType === 7) {
                this.$changeViewPage('SettingIndex')
            }
        },
        // 播放测试音量
        handlePlayVolume() {
            this.$store.commit('CHANGE_DEVICE_INFO', {
                luminance: this.luminance
            })

            // FIXME:音量设置失败
            // this.$controlClient.changeVolume(this.luminance)
            this.$hardwareClient.screenBright(this.luminance)

            // clearTimeout(this.timer)
            // this.timer = setTimeout(() => {
            //     this.$emit('on-audio-event', 'stopeAudio')
            //     this.$emit('on-audio-event', 'playAudio', 'volumeNotification', 5)
            // }, 500)
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

        img {
            position: absolute;
            left: 504px;
            top: 1552px;
            font-size: 72px;
            width: 66px;
            height: 66px;
            z-index: 100;
            transition: all 0.3s;
        }
    }
}
</style>
