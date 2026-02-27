<!--
 * @Description: 公共组件-消息提醒弹窗
 * @Author: gaoyuanyuan
 * @Date: 2019-10-18 14:44:59
 * @LastEditors: liutq
 * @LastEditTime: 2022-05-24 18:48:55
 -->
<template>
    <div :class="[prefixCls]">
        <transition name="fade">
            <div :class="[prefixCls + '-mask']" v-if="maskable" v-show="visible"></div>
        </transition>
        <transition v-on:after-leave="actionEnd" name="fade">
            <div :class="[prefixCls + '-wrap']" v-show="visible">
                <div :class="[prefixCls + '-main']">
                    <slot name="icon"></slot>
                    <p>{{ title }}</p>
                    <slot name="content"></slot>
                    <i18n path="shut-down.msg-box-duration" tag="p" class="duration" v-if="isAutoClose">
                        <span place="num" class="num">{{ count }}</span>
                    </i18n>
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
        // 弹窗显示秒数
        duration: {
            type: Number,
            default: 5
        },
        // 显示标题
        title: {
            type: String,
            default: ''
        },
        // 是否自动关闭
        isAutoClose: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            prefixCls: 'msg-box',
            visible: this.value,
            count: this.duration,
            timer: null,
            isHandleClose: false
        }
    },
    watch: {
        value(val, oldVal) {
            if (val === oldVal) {
                return
            }
            this.visible = val
            if (val) {
                this.cutdown = this.duration
                this.open()
            } else {
                this.closeBox()
            }
        }
    },
    methods: {
        open() {
            this.clearTimer()
            if (this.duration > 0 && this.isAutoClose) {
                this.visible = true
                this.timer = setInterval(() => {
                    if (this.count === 1) {
                        this.isHandleClose = false
                        this.closeBox()
                    } else {
                        this.count--
                    }
                }, 1000)
            }
        },
        closeBox() {
            this.visible = false
            this.clearTimer()
        },
        handleClose() {
            this.isHandleClose = true
            this.closeBox()
        },
        clearTimer() {
            clearInterval(this.timer)
        },
        // 动画结束后
        actionEnd() {
            this.count = this.duration
            this.$emit('on-close', this.isHandleClose)
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
        height: 564px;
        top: 50%;
        left: 50%;
        text-align: center;
        transform: translate(-50%, -50%);
        border-radius: 32px;
        background: #1f2429;
        p {
            margin: 52px 0 24px;
            font-size: 48px;
            font-family: OPPOSansR;
            font-weight: normal;
            line-height: 72px;
        }
        .duration {
            font-size: 32px;
            font-weight: normal;
            line-height: 60px;
            margin: 0;
            color: @text-gray-3;
            span {
                font-size: 32px;
                font-family: OPPOSansR;
                vertical-align: middle;
                &.num {
                    color: #ff791f;
                }
            }
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
</style>
