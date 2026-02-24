<!--
 * @Description: 身体成分进度条组件
 * @Author: gaoyuanyuan
 * @Date: 2019-12-06 21:46:29
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2025-02-11 14:51:31
 -->
<template>
    <div :class="['progress-bar', {isM30: isM30}, {isTangCenBei:isTangCenBei}]">
        <div class="progress">
            <div class="item" :style="{ width: `${progress}px` }">
                <div class="active-bg">
                    <i></i>
                    <i></i>
                    <i></i>
                </div>
            </div>
            <span class="val" ref="val">{{ value }}</span>
        </div>
        <div class="bg">
            <i></i>
            <i></i>
            <i></i>
        </div>
    </div>
</template>
<script>
import { _toDecimal } from '@/assets/js/util.js'
export default {
    name: 'MassProgress',
    props: {
        // 当前值
        val: {
            type: Number,
            default: 0
        },
        // 低标准
        low: {
            type: Number,
            default: 0
        },
        // 高标准
        hight: {
            type: Number,
            default: 0
        },
        // 数据精度
        digit: {
            type: Number,
            default: 1
        },
        isM30: {
            type: Boolean,
            default: false
        },
        // kangbeijian
        isTangCenBei: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        value() {
            return _toDecimal(this.val, this.digit)
        },
        progress() {
            const standardWidth = this.isTangCenBei ? 146 : this.isM30 ? 138 : 80
            const standardMaxWidth = this.isTangCenBei ? 442 : this.isM30 ? 380 : 235
            const length1 = this.isTangCenBei ? 148 : this.isM30 ? 140 : 82
            const length2 = this.isTangCenBei ? 292 : this.isM30 ? 278 : 162
            let width = 0
            // 每格数值
            const unitLen = this.hight - this.low
            // 低标准进度
            if (this.val <= this.low) {
                width = ((this.val + unitLen - this.low) / unitLen) * standardWidth
                // 标准进度
            } else if (this.val <= this.hight) {
                width = ((this.val - this.low) / unitLen) * standardWidth + length1
                // 高标准进度
            } else if (this.val <= this.hight + unitLen) {
                width = ((this.val - this.hight) / unitLen) * standardWidth + length2
                // 超超标准
            } else {
                width = standardWidth * 3 + 4
            }
            // 极值处理
            return width < 4 ? 4 : width > standardMaxWidth ? standardMaxWidth : width
        }
    }
}
</script>
<style lang="less" scoped>
.progress-bar {
    height: 100%;
    .progress {
        position: relative;
        z-index: 1;
        height: 100%;
        text-align: left;
        .item {
            display: inline-block;
            vertical-align: middle;
            height: 100%;
            overflow: hidden;
            .active-bg {
                width: 247px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                i {
                    display: inline-block;
                    width: 81px;
                    height: 2.1px;
                    background: #5698f5;
                }
            }
        }
        .val {
            position: absolute;
            margin-left: 4px;
            top: 7px;
            display: inline-block;
            vertical-align: middle;
            font-size: 12px;
            // TODO:字体
            font-family: OPPOSans M;
            font-weight: normal;
            color: #5698f5;
            line-height: 19px;
        }
    }
    .bg {
        position: absolute;
        top: 0;
        z-index: 0;
        width: 247px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        i {
            display: inline-block;
            width: 81px;
            height: 1px;
            background: #ced7e0;
        }
    }
    &.isM30 {
        .active-bg {
            width: 420px !important;
            i {
                width: 138px !important;
            }
        }
        .bg {
            width: 420px !important;
            i {
                width: 138px !important;
            }
        }
    }
    &.isTangCenBei{
        .active-bg{
            width: 442px !important;
            i {
                width: 146px !important;
            }
        }
        .bg {
            width: 442px !important;
            i {
                width: 146px !important;
            }
        }
    }
}
</style>
