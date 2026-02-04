<!--
 * @Description: 底部倒计时组件
 * @Author: WendyGao
 * @Date: 2022-02-14 17:32:51
 * @LastEditors: liutq
 * @LastEditTime: 2025-05-20 17:45:19
-->
<template>
    <div :class="{ 'cut-down-container': true, hidden: displayNone }">
        <i18n path="common.error.count-down1" tag="span" class="text-container" v-if="textShow && suffixType === 1">
            <span place="num" class="cut-down-num">{{ remainingNum }}</span>
        </i18n>
        <i18n
            path="common.error.count-down2"
            tag="span"
            class="text-container"
            v-else-if="textShow && suffixType === 2"
        >
            <span place="num" class="cut-down-num">{{ remainingNum }}</span>
        </i18n>
        <i18n
            path="common.error.count-down3"
            tag="span"
            class="text-container"
            v-else-if="textShow && suffixType === 3"
        >
            <span place="num" class="cut-down-num">{{ remainingNum }}</span>
        </i18n>
        <i18n
            path="common.error.count-down4"
            tag="span"
            class="text-container"
            v-else-if="textShow && suffixType === 4"
        >
            <span place="num" class="cut-down-num">{{ remainingNum }}</span>
        </i18n>
        <div class="load-progress">
            <div :style="{ width: remainingWidth }" class="active-progress"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'CutDownLoad',
    props: {
        // 倒计时时长
        duration: {
            type: Number,
            default: 0
        },
        // 倒计时结束后隐藏
        endToHide: {
            type: Boolean,
            default: false
        },
        // 是否显示倒计时文案
        textShow: {
            type: Boolean,
            default: true
        },
        // 倒计时文案是否添加 “返回”
        backSuffix: {
            type: Boolean,
            default: true
        },
        // 倒计时返回文案 1 60秒后返回首页 2 60秒后将结束测量 3 倒计时15秒 4 倒计时5s
        suffixType: {
            type: Number,
            default: 0
        },
        type: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            // 剩余时长
            remainingNum: 0,
            // 未操作定时器
            clockTimer: null,
            // 隐藏组件
            displayNone: false,
            // 总时长
            totalDuration: 0
        }
    },
    computed: {
        // 计算剩余进度条长度
        remainingWidth() {
            return Math.floor((this.remainingNum / this.totalDuration) * 100) + '%'
        }
    },
    watch: {
        duration(newVal) {
            if (newVal > 0) {
                this.init(newVal)
            }
        }
    },
    created() {
        this.remainingNum = this.duration
        this.totalDuration = this.duration
    },
    mounted() {
        this.runClockTimer()
    },
    // 离开页面
    beforeDestroy() {
        this.clearClockTimer()
    },
    methods: {
        init(durationNum) {
            this.remainingNum = durationNum
            this.totalDuration = durationNum
            this.runClockTimer()
        },
        // 启动定时器
        runClockTimer() {
            this.clearClockTimer()

            this.clockTimer = setInterval(() => {
                this.remainingNum--
                if (this.remainingNum === this.type) {
                    this.$emit('cut-down-over')
                    this.clearClockTimer()
                    if (this.endToHide) {
                        this.displayNone = true
                    }
                }
            }, 1000)
        },
        // 销毁未操作定时器
        clearClockTimer() {
            if (this.clockTimer) {
                clearInterval(this.clockTimer)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.cut-down-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 20px;
    width: 100%;
    color: @text-gray-3;
    align-items: center;
    transition: all 0.3s;

    &.hidden {
        display: none;
    }

    .text-container {
        // display: flex;
        // align-items: center;
        // justify-content: center;
        font-size: 32px;
        margin-bottom: 15px;
        font-family: 'OPPOSansR';
        span {
            font-size: 32px;
            font-family: 'OPPOSansR';
        }
        .cut-down-num {
            color: @color-orange;
            // margin-right: 10px;
        }
    }

    .load-progress {
        width: 960px;
        background: #000000;
        border-radius: 32px;
        height: 16px;

        .active-progress {
            width: 50%;
            height: 16px;
            margin: 0;
            border-radius: 32px;
            background-color: @color-blue;
            transition: all 0.3s;
        }
    }
}
</style>
