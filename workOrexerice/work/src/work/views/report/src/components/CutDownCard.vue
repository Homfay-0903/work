<!--
 * @Description: 底部蓝色状态倒计时卡片
 * @Author: WendyGao
 * @Date: 2022-02-14 17:32:29
 * @LastEditors: zhaoqianqian
 * @LastEditTime: 2022-12-02 16:30:08
-->
<template>
    <transition name="out-in">
        <div :class="[prefixCls + '-wrap']">
            <div :class="[prefixCls + '-main']">
                <slot name="icon"></slot>
                <p class="title">{{ title }}</p>
                <div class="content">
                    <slot name="content"></slot>
                </div>
            </div>
            <cut-down-load
                v-if="count !== 0"
                :duration="count"
                :suffix="suffix"
                :suffixType="suffixType"
                @cut-down-over="countDownCallback"
                class="progress"
            ></cut-down-load>
        </div>
    </transition>
</template>
<script>
import CutDownLoad from './CutDownLoad.vue'
export default {
    name: 'CutDownCard',
    components: {
        CutDownLoad
    },
    props: {
        // 显示标题
        title: {
            type: String,
            default: ''
        },
        // 倒计时 0 时不显示倒计时
        duration: {
            type: Number,
            default: 5
        },
        // 倒计时返回文案
        suffix: {
            type: String,
            default: '首页'
        },
        suffixType: {
            type: Number,
            default: 4
        }
    },
    data() {
        return {
            prefixCls: 'state-card',
            count: this.duration
        }
    },
    methods: {
        countDownCallback() {
            this.$emit('on-close')
        }
    }
}
</script>
<style lang="less" scoped>
.state-card {
    &-wrap {
        position: relative;
    }
    &-main {
        position: relative;
        width: 960px;
        text-align: center;
        margin: 0 auto 144px;
        background: @color-blue;
        border-radius: 32px;
        padding: 80px 0;
        .title {
            color: #ffffff;
            text-align: center;
            margin: 0 0 32px;
            font-size: 48px;
        }
        .content {
            font-family: 'OPPOSansR';
            font-size: 36px;
            font-weight: normal;
            color: @text-gray;
            line-height: 56px;
        }
    }
}
.progress {
    bottom: -124px !important;
}
</style>
