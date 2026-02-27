<!--
 * @Description: 公共组件-消息提醒弹窗
 * @Author: gaoyuanyuan
 * @Date: 2019-10-18 14:44:59
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2025-12-10 10:54:49
 -->
<template>
    <div :class="[prefixCls]">
        <transition name="fade">
            <div :class="[prefixCls + '-mask']" v-if="maskable" v-show="visible"></div>
        </transition>
        <transition v-on:after-leave="actionEnd" name="fade">
            <div :class="[prefixCls + '-wrap']" v-show="visible">
                <div :class="[prefixCls + '-main']">
                    <!-- 是否断开当前网络连接  -->
                    <h3 class="h3">{{ $t('wifi.box-title') }}</h3>
                    <span class="title">{{ title }}</span>
                    <!-- 操作按钮 -->
                    <div class="btn-area">
                        <div class="btn" @touchend="closeBox" :style="white ? 'background: #1D66E6;' : ''">
                            {{ $t('wifi.tip-btn-cancel') }}
                        </div>
                        <div class="ok-btn" :style="white ? 'background: #888888;' : ''" @touchend="handleOk">
                            {{ $t('wifi.tip-btn-disconnected') }}
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'MsgBox',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        // 背景遮罩
        maskable: {
            type: Boolean,
            default: true
        },
        // 显示标题
        title: {
            type: String,
            default: ''
        },
        // 断开连接的回调
        callback: {
            type: Function,
            default: null
        },
        activeBgc: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            prefixCls: 'msg-box',
            visible: this.value,
            count: this.duration,
            timer: null,
            isHandleClose: false,
            white: false
        }
    },
    watch: {
        activeBgc(val) {
            if (val === false) {
                this.white = false
                console.log('true')
            } else {
                this.white = true
                console.log('false')
            }
        }
    },
    mounted() {
        this.open()
    },
    methods: {
        open() {
            this.visible = true
        },
        closeBox() {
            this.white = true
            this.visible = false
            this.callback(false)
        },
        // 动画结束后
        actionEnd() {
            this.count = this.duration
            this.$emit('on-close', this.isHandleClose)
        },

        handleOk() {
            this.visible = false
            this.callback(true)
        }
    }
}
</script>
<style lang="less" scoped>
.msg-box {
    &-mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: 104;
        background: rgba(0, 0, 0, 0.7);
    }
    &-wrap {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 105;
    }
    &-main {
        position: absolute;
        height: auto;
        width: 960px;
        padding: 80px 64px !important;
        top: 50%;
        left: 50%;
        text-align: center;
        transform: translate(-50%, -50%);
        border-radius: 32px;
        background: #565656;
        box-sizing: border-box;
        .h3 {
            margin-bottom: 40px;
            font-family: OPPOSans, OPPOSans;
            font-weight: normal;
            font-size: 48px;
            color: #ffffff;
            line-height: 72px;
            text-align: center;
            font-style: normal;
        }
        p {
            margin: 52px 0 24px;
            font-size: 48px;
            font-family: OPPOSansR;
            font-weight: normal;
            line-height: 72px;
        }
        img {
            width: 266px;
            height: 280px;
        }
    }
    .open-box-enter-active,
    .open-box-leave-active {
        transition: opacity 0.2s cubic-bezier(0.4, 0.6, 0.5, 1.32);
    }
    .open-box-enter,
    .open-box-leave-to {
        opacity: 0;
    }
}
.title {
    background: #666666;
    border-radius: 12px;
    padding: 10px 30px;
    font-family: OPPOSans, OPPOSans;
    font-weight: normal;
    font-size: 32px;
    color: #e7e9f0;
    line-height: 48px;
    text-align: left;
    font-style: normal;
}

.btn-area {
    width: 100%;
    margin-top: 120px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .btn {
        width: 384px;
        height: 132px;
        background: #888888;
        border-radius: 12px;
        font-size: 40px;
        line-height: 132px;
        color: #e7e9f0;
        &:active {
            background: @color-blue;
        }
    }

    .ok-btn {
        .btn();
        background: @color-blue;
    }
}
</style>
