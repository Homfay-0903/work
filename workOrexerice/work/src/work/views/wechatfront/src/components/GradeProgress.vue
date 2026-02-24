<!--
 * @Description: 内脏脂肪进度条组件
 * @Author: gaoyuanyuan
 * @Date: 2019-12-06 21:46:29
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2025-01-16 11:18:57
 -->
<template>
    <div :class="isTangCenBei ? 'progress-bar1' : isvapro7 ? 'progress-bar2' : 'progress-bar'">
        <div class="progress">
            <div class="item" :style="{ width: `${progress}px` }">
                <div class="active-bg">
                    <i></i>
                    <i></i>
                </div>
            </div>
            <span class="val" ref="val">{{ value }}</span>
        </div>
        <div :class="isTangCenBei ? 'bg-bei' : isvapro7 ? 'bg-pro7' : 'bg'">
            <i></i>
            <i></i>
        </div>
    </div>
</template>
<script>
import { _toDecimal } from '@/assets/js/util.js'
export default {
    name: 'GradeProgress',
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
        // kangbeijian
        isTangCenBei: {
            type: Boolean,
            default: false
        },
        isvapro7: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        value() {
            return _toDecimal(this.val, this.digit)
        },
        progress() {
            let width = 0
            // 低标准进度
            if (this.val < this.low) {
                width = 0
                // 标准进度
            } else {
                if (this.isTangCenBei) {
                    width = this.val * 22.1
                } else if (this.isvapro7) {
                    width = this.val * 20
                } else {
                    width = this.val * 12.2
                }
            }
            // 极值处理
            if (this.isTangCenBei) {
                return width > 442 ? 442 : width
            } else if (this.isvapro7) {
                return width > 410 ? 410 : width
            } else {
                return width > 230 ? 230 : width
            }
        }
    }
}
</script>
<style lang="less" scoped>
.progress-bar,
.progress-bar1,
.progress-bar2 {
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
                    width: 121px;
                    height: 2px;
                    background: #5698f5;
                }
            }
        }

        .val {
            position: relative;
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

    .bg,
    .bg-bei,
    .bg-pro7 {
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
            width: 122px;
            height: 1px;
            background: #ced7e0;
        }
    }

    .bg-bei {
        width: 442px;

        i {
            width: 222px;
        }
    }

    .bg-pro7 {
        width: 410px !important;

        i {
            width: 200px !important;
        }
    }
}

.progress-bar1 {
    .progress {
        .item {
            .active-bg {
                width: 442px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;

                i {
                    display: inline-block;
                    width: 442px;
                    height: 2px;
                    background: #5698f5;
                }
            }
        }
    }
}

.progress-bar2 {
    .progress {
        width: 410px;
        .item {
            .active-bg {
                width: 410px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;

                i {
                    display: inline-block;
                    width: 200px;
                    height: 2px;
                    background: #5698f5;
                }
            }
        }
    }
}
</style>
