<!--
 * @Description: 关机页面
 * @Author: gaoyuanyuan
 * @Date: 2019-12-06 21:59:50
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2024-09-26 20:58:47
 -->
<template>
    <transition v-on:after-leave="actionEnd" name="fade">
        <div v-show="visible" class="shut-down">
            <div class="content">
                <!-- 无任务 -->
                <img
                    :src="require('@img/shutdown/no_task.svg')"
                    v-if="taskStatus === 0"
                    class="icon-border"
                    alt="关机图标"
                />
                <!-- 有任务 -->
                <img :src="require('@img/shutdown/task.svg')" v-else class="icon-border" alt="关机图标" />
                <h3>{{ taskStatus === 0 ? $t('shut-down.que-ren-guan-ji') : $t('shut-down.guan-ji-ti-shi') }}</h3>
                <p v-if="taskStatus === 1" :style="$i18n.locale === 'de' ? 'lineHeight: 20px' : ''">
                    <span>{{ $t('shut-down.guan-ji-ti-shi_desc1') }}{{ $t('shut-down.guan-ji-ti-shi_desc2') }}</span>
                </p>
            </div>
            <div class="info" :style="$i18n.locale === 'de' ? 'bottom: 10px' : ''">
                <transition name="fade-move" appear>
                    <div v-show="visible" class="button able-click" @touchstart="isTouchScreen(1)">
                        <p
                            v-if="deviceInfo.operationMode === 1"
                            :class="['button-top', select === 1 ? 'finish-click' : '']"
                        >
                            {{ $t('shut-down.que-ren-guan-ji') }}<br />
                            <span class="button-msg">{{ $t('shut-down.que-ren-guan-ji_touch_desc') }}</span>
                        </p>
                        <p
                            v-else
                            :class="[
                                'button-top2',
                                select === 1 || deviceInfo.operationMode === 2 ? 'finish-click' : ''
                            ]"
                        >
                            {{ $t('shut-down.que-ren-guan-ji_key_desc') }}
                        </p>
                    </div>
                </transition>
                <transition name="fade-move" appear>
                    <div
                        v-show="visible"
                        :class="[
                            'button',
                            deviceInfo.operationMode === 1 || deviceInfo.deviceType === 5 ? 'able-click' : '',
                            $i18n.locale
                        ]"
                        @touchstart="isTouchScreen(2)"
                    >
                        <p
                            v-if="deviceInfo.operationMode === 1 || deviceInfo.deviceType === 5"
                            :class="['button-button', select === 2 ? 'finish-click' : '']"
                        >
                            {{ $t('shut-down.qu-xiao-guan-ji_touch', [cutdown]) }}
                        </p>
                        <i18n
                            path="shut-down.qu-xiao-guan-ji_key"
                            v-else
                            tag="p"
                            class="button-button2"
                            :style="$i18n.locale === 'de' ? 'lineHeight: 50px' : ''"
                        >
                            <span place="0" class="num">{{ cutdown }}</span>
                        </i18n>
                    </div>
                </transition>
            </div>
        </div>
    </transition>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'ShutDown',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        // 关机确认显示秒数
        duration: {
            type: Number,
            default: 10
        }
    },
    data() {
        return {
            cutdown: this.duration,
            cutInter: null,
            visible: this.value,
            taskStatus: 0,
            select: 1
        }
    },
    computed: {
        ...mapGetters(['printQueue', 'uploadTaskSum', 'deviceInfo'])
    },
    watch: {
        value(val, oldVal) {
            if (val === oldVal) {
                return
            }
            this.visible = val
            if (val) {
                this.select = 1
                this.cutdown = this.duration
                // 判断是否有正在上传的任务或则打印的任务
                const printIndex = this.printQueue.findIndex((item) => {
                    return [0, 1, 4, 5, 7].indexOf(item.statusCode) !== -1
                })
                if (printIndex === -1 && this.uploadTaskSum === 0) {
                    this.taskStatus = 0
                    this.$emit('on-audio-event', 'playAudio', 'shutDownNormal')
                } else {
                    this.taskStatus = 1
                    this.select = 2
                    this.$emit('on-audio-event', 'playAudio', 'shutDownTask')
                }
                this.open()
            } else {
                this.close()
            }
        }
    },
    methods: {
        open() {
            window.logger.debug('进入关机页面')
            window.logger.debug('是否有测量任务', this.taskStatus)
            this.clearTimer()
            if (this.duration > 0) {
                this.visible = true
                this.cutInter = setInterval(() => {
                    if (this.cutdown === 1) {
                        this.close()
                    } else {
                        this.cutdown--
                    }
                }, 1000)
            }
        },
        // await this.$controlClient.taskNum()
        close() {
            this.visible = false
            this.clearTimer()
            this.$emit('on-close-shut-down')
        },
        clearTimer() {
            clearInterval(this.cutInter)
        },
        // 动画结束后
        actionEnd() {
            this.cutdown = this.duration
        },
        btnClick(btnType, isSelect) {
            if (btnType === 1) {
                if (this.select === 2 && this.deviceInfo.operationMode === 1) {
                    this.select = 1
                }
                // 下
            } else if (btnType === 2 && this.deviceInfo.operationMode === 1) {
                if (this.select === 1) {
                    this.select = 2
                }
                // 确定
            } else if (btnType === 3) {
                // console.log('确认事件', isSelect)
                window.logger.debug('确认事件是否关机', this.taskStatus)
                if (this.deviceInfo.operationMode === 2) {
                    this.$changeViewPage('DeviceSwitch', {
                        type: 'off'
                    })
                } else if (isSelect === 2 || this.select === 2) {
                    this.close()
                } else {
                    this.$changeViewPage('DeviceSwitch', {
                        type: 'off'
                    })
                }
            }
        },
        //触屏选择
        isTouchScreen(type) {
            this.select = type
            const setTimer = setInterval(() => {
                this.btnClick(3, type)
                window.clearInterval(setTimer)
            }, 300)
        }
    }
}
</script>
<style lang="less" scoped>
.shut-down {
    position: absolute;
    top: 0;
    background: #000000;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 200;

    .content {
        text-align: center;

        img {
            width: 340px;
            margin: 500px 0 48px;
        }

        h3 {
            margin: 0;
            font-size: 64px;
            font-family: OPPOSansM;
            font-weight: normal;
            line-height: 96px;
        }

        p {
            width: 864px;
            font-size: 32px;
            font-family: OPPOSansR;
            font-weight: normal;
            line-height: 48px;
            margin: 0 108px;
            color: @color-gray;

            span {
                font-size: 48px;
                font-family: OPPOSansR;
                font-weight: normal;
                line-height: 72px;
            }
        }
    }

    .info {
        position: absolute;
        bottom: 86px;

        .button {
            width: 960px;
            color: #ffffff;
            border-radius: 32px;
            margin: 0 60px 24px 60px;

            .button-top,
            .button-top2 {
                // height: 216px;
                border-radius: 32px;
                text-align: center;
                font-size: 48px;
                line-height: 63px;
                padding: 62px 0;
                box-sizing: border-box;

                span {
                    display: inline-block;
                    font-size: 32px;
                    font-family: OPPOSansR, OPPOSans;
                    font-weight: normal;
                    color: @color-white;
                    line-height: 48px;
                }
            }

            .button-msg {
                width: 880px;
                margin: 17px 40px 32px 40px;
            }

            .button-top2 {
                line-height: 96px;
            }

            .button-button {
                height: 216px;
                border-radius: 32px;
                text-align: center;
                font-size: 48px;
                line-height: 216px;
                box-sizing: border-box;
            }

            &.it {
                .button-button2 {
                    font-size: 35px !important;
                    font-family: OPPOSansR, OPPOSans;
                    font-weight: normal;
                    height: 216px;
                    text-align: center;
                    color: #999999;
                    line-height: 216px;
                    background: none;

                    span {
                        font-size: 40px;
                        font-family: OPPOSansR, OPPOSans;
                        font-weight: normal;
                        color: #ff791f;
                    }
                }
            }

            .button-button2 {
                font-size: 40px;
                font-family: OPPOSansR, OPPOSans;
                font-weight: normal;
                height: 216px;
                text-align: center;
                color: #999999;
                line-height: 216px;
                background: none;

                span {
                    font-size: 40px;
                    font-family: OPPOSansR, OPPOSans;
                    font-weight: normal;
                    color: #ff791f;
                }
            }
        }
    }
}
</style>
