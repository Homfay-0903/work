<!--
 * @Description: 数据对比图标组件
 * @Author: gaoyuanyuan
 * @Date: 2020-01-08 15:16:01
 * @LastEditors: zhaoqianqian
 * @LastEditTime: 2022-04-07 14:12:47
 -->
<template>
    <div :class="['contrast-item', $i18n.locale]">
        <template v-if="val !== '' && val !== null && val !== undefined">
            <img src="@/assets/images/icon_up.svg" v-if="val >= 0" />
            <img src="@/assets/images/icon_down.svg" v-else /><span>{{ value }} {{ unit }}</span>
        </template>
        <span v-else>--</span>
    </div>
</template>
<script>
import { _toDecimal } from '@/assets/js/util.js'
export default {
    name: 'NewContrast',
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
        },
        type: {
            type: String,
            default: 'one'
        }
    },
    computed: {
        value() {
            if (this.val !== '') {
                if (this.val === 0) {
                    return '0.0'
                } else {
                    console.log(this.type)
                    if (this.type === 'two') {
                        return _toDecimal(Math.abs(this.val), 2)
                    } else {
                        return _toDecimal(Math.abs(this.val), 1)
                    }
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.contrast-item {
    max-width: 50px;
    margin: 0 auto;
    text-align: left;
    img {
        width: 10px;
        height: 10px;
        vertical-align: middle;
    }
    span {
        font-size: 12px;
        font-family: "OPPOSans-M", "Noto Kufi Arabic SemiBold";
        font-weight: normal;
        margin-left: 2px;
        letter-spacing: -0.6px;
        color: #5698f5;
        line-height: 19px;
        vertical-align: middle;
    }
}
&.ar-AR {
    span {
        margin-right: 2px;
    }
    .contrast-item {
        text-align: right;
        padding-right: 50px;
    }
}
</style>
