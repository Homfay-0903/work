<!--
 * @Description: 公共组件-消息提醒卡片
 * @Author: WendyGao
 * @Date: 2022-02-14 17:00:35
 * @LastEditors: liutq
 * @LastEditTime: 2025-10-15 13:48:47
-->
<template>
    <div :class="[prefixCls]">
        <div :class="[prefixCls + '-wrap']">
            <span :class="['msg-icon', type]" v-if="showTypeIcon">
                <i :class="['iconfont', icons[type]]"></i>
            </span>
            <div
                :class="[
                    prefixCls + '-main',
                    type,
                    deviceInfo.deviceType === 5 || deviceInfo.deviceType === 3 ? 'pro5-style' : ''
                ]"
            >
                <!-- 标题 -->
                <slot name="title"></slot>

                <!-- 消息内容 -->
                <slot name="info-content"></slot>

                <!-- 错误内容 -->
                <p v-if="type === 'error'" class="error-content">
                    <svg aria-hidden="true">
                        <use xlink:href="#icon-warn" />
                    </svg>
                    <slot name="error-content"></slot>
                </p>

                <!-- 成功内容 -->
                <slot name="success-content"></slot>

                <!-- 倒计时 -->
                <p v-if="duration !== 0" class="msg-duration">
                    <span class="num">{{ count }}</span>
                    <span>秒后</span><slot name="error-duration"></slot>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'MsgCard',
    props: {
        // 弹窗类型 info success error
        type: {
            type: String,
            default: 'info'
        },
        // 是否显示类型图标
        showTypeIcon: {
            type: Boolean,
            default: true
        },
        // 弹窗显示秒数
        duration: {
            type: Number,
            default: 0
        },
        // 显示内容
        content: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters(['deviceInfo'])
    },
    data() {
        return {
            prefixCls: 'msg-card',
            count: this.duration,
            countDownInter: null,
            icons: {
                info: 'icon-info',
                success: 'icon-success',
                error: 'icon-failure',
                warning: 'icon-info'
            }
        }
    },
    created() {
        if (this.duration !== 0) {
            this.startCountDownInter()
        }
    },
    // 离开页面
    beforeDestroy() {
        // 销毁倒计时计时器
        this.clearCountDownInter()
    },
    methods: {
        // 倒计时结束
        handleClose() {
            this.clearCountDownInter()
            this.count = this.duration
            this.$emit('on-count-down')
        },
        // 启动倒计时计时器
        // dur: 外部传入的倒计时时间
        startCountDownInter(dur) {
            if (dur) {
                this.count = dur
            }
            this.clearCountDownInter()
            if (this.duration > 0) {
                this.countDownInter = setInterval(() => {
                    if (this.count === 1) {
                        this.handleClose()
                    } else {
                        this.count--
                    }
                }, 1000)
            }
        },
        // 销毁倒计时计时器
        clearCountDownInter() {
            clearInterval(this.countDownInter)
        },
        open() {
            this.clearTimer()
            if (this.duration > 0) {
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
        }
    }
}
</script>
<style lang="less" scoped>
.msg-card {
    &-wrap {
        position: relative;
        width: 960px;
        margin: 0 auto;
        z-index: 100;
        .msg-icon {
            position: absolute;
            left: 48px;
            top: -40px;
            z-index: 1;
            width: 120px;
            height: 96px;
            border-radius: 12px;
            &.info,
            &.print {
                background: @color-blue;
            }
            &.success {
                background: #2ea33d;
            }
            &.error {
                background: #ff3d1f;
            }
            &.warning {
                background: linear-gradient(180deg, #ef670c 0%, #f49e13 100%);
            }
            i {
                position: absolute;
                left: 50%;
                top: 50%;
                font-size: 80px;
                color: #ffffff;
                transform: translate(-50%, -50%);
            }
        }
    }
    &-main {
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: auto;
        height: auto;
        max-height: 480px;
        padding: 96px 0;
        border-radius: 32px;
        background: @color-background;
        ul {
            margin: 0;
            padding: 0;
            list-style: none;
            li {
                position: relative;
                margin: 0 0 0 auto;
                width: calc(100% - 50px);
                text-align: left;
                font-size: 48px;
                font-family: 'OPPOSansR';
                font-weight: normal;
                line-height: 72px;
                // 样式调整
                &::before {
                    content: '';
                    position: absolute;
                    top: 24px;
                    left: -50px;
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    border-radius: 50em;
                    margin: 0px 28px 5px 0;
                    background: linear-gradient(180deg, rgba(239, 103, 12, 1) 0%, rgba(244, 158, 19, 1) 100%);
                }
                span {
                    font-family: 'OPPOSansR';
                }
            }
        }
        h3 {
            margin: 0px 0 48px;
            text-align: center;
            font-size: 64px;
            font-family: 'OPPOSansM';
            font-weight: normal;
            line-height: 72px;
        }

        .msg-duration {
            font-size: 32px;
            text-align: center;
            margin: 24px 0 0;
            span {
                font-size: 32px;
                font-family: 'OPPOSansR';
                font-weight: normal;
                line-height: 48px;
                color: #ffffff;
            }
            .num {
                color: #ff791f;
            }
        }
        &.info {
            padding: 96px 48px 96px 92px;
        }
        &.tips {
            padding: 96px 48px 96px 92px;
            background: @color-blue;
        }
        &.error {
            .error-content {
                margin: 0;
                text-align: center;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                svg {
                    display: inline-block;
                    width: 36px;
                    height: 36px;
                    margin: 4px 22px 0 0;
                }
                div {
                    display: inline-block;
                    max-width: 758px;
                    color: #ffffff;
                    text-align: left;
                    font-size: 36px;
                    font-family: 'OPPOSansR';
                    font-weight: normal;
                    * {
                        font-size: 36px;
                        font-family: 'OPPOSansR';
                        font-weight: normal;
                        line-height: 48px;
                    }
                }
            }
        }
        &.success {
            padding: 120px 48px 120px;
            p {
                margin: 0;
                text-align: center;
                font-size: 36px;
                font-family: 'OPPOSansR';
                font-weight: normal;
                color: #ffffff;
                line-height: 48px;
            }
        }
        &.warning {
            padding: 96px 48px 96px 92px;
        }
    }
}
</style>
