<!--
 * @Description: 调节量图表
 * @Author: gaoyuanyuan
 * @Date: 2020-04-10 09:41:27
 * @LastEditors: gaoyuanyuan
 * @LastEditTime: 2020-04-13 14:13:25
 -->
<template>
    <div class="adjust-chart">
        <span>{{ adjust > 0 ? '+' : '' }}{{ toDecimal(adjust, 1) }}</span>
        <div class="added" :style="{ 'height': `${addedHeight}px` }"></div>
        <div class="base" :style="{ 'height': `${height}px` }"></div>
    </div>
</template>
<script>
import { _toDecimal } from '@/assets/js/util.js'
export default {
    name: 'AdjustChart',
    props: {
        // 黄金比例
        val: {
            type: Number,
            default: 0
        },
        // 调节值
        adjust: {
            type: Number,
            default: 0
        }
    },
    computed: {
        height() {
            // 调节量大于0 满值
            if (this.adjust >= 0) {
                return 94
            } else {
                return ((this.val + this.adjust) * 94) / this.val
            }
        },
        addedHeight() {
            // 调节量小于0 不加
            if (this.adjust <= 0) {
                return 0
            } else {
                const height = (this.val * 20) / 50
                return height > 50 ? 50 : height
            }
        }
    },
    methods: {
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        }
    }
}
</script>
<style lang="less" scoped>
.adjust-chart {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    align-items: center;
    width: 27px;
    vertical-align: bottom;
    padding-bottom: 1px;
    span {
        font-size: 12px;
        color: #5698f5;
        font-family: OPPOSans M;
        font-weight: normal;
    }
    .added {
        width: 27px;
        background: #5698f5;
    }
    .base {
        width: 27px;
        background: #d8d8d8;
    }
}
</style>
