<!--
 * @Description: 数据对比图标组件
 * @Author: gaoyuanyuan
 * @Date: 2020-01-08 15:16:01
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2023-07-27 11:50:01
 -->
<template>
    <div class="contrast-item">
        <template v-if="val !== '' && val !== null">
            <img src="@/assets/images/icon_up.svg" v-if="val > 0" />
            <img src="@/assets/images/icon_right.svg" v-else-if="val == 0" />
            <img src="@/assets/images/icon_down.svg" v-else />
            <span>{{ value }} {{ unit }}</span>
        </template>
        <span v-else>--</span>
    </div>
</template>
<script>
import { _toDecimal } from '@/assets/js/util.js'
export default {
    name: 'Contrast',
    props: {
        // 当前值
        val: {
            type: [Number, String],
            default: 0
        },
        // 单位
        unit: {
            type: String,
            default: ''
        }
    },
    computed: {
        value() {
            if (this.val !== '') {
                if (this.val === 0) {
                    return '0.0'
                } else {
                    return _toDecimal(Math.abs(this.val), 1)
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.contrast-item {
    max-width: 60px;
    margin: 0 auto;
    text-align: left;
    margin-left: 24px;
    img {
        width: 10px;
        height: 10px;
        vertical-align: middle;
    }

    span {
        font-size: 12px;
        font-family: OPPOSans M;
        font-weight: normal;
        color: #5698f5;
        line-height: 19px;
        vertical-align: middle;
    }
}
</style>
