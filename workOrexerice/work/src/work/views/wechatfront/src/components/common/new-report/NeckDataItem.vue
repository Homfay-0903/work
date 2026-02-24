<!--
 * @Description: Description
 * @Author: zhaoqianqian
 * @Date: 2022-07-07 17:24:02
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2023-07-26 18:18:13
-->
<template>
    <div :class="['thermal-item', $i18n.locale]">
        <div class="data-list">
            <div class="contrast-box">
                <div class="contrast" v-if="item.contrast !== null">
                    <span>{{ $t('shoulder.model.diff') }}</span>
                    <img v-if="item.contrast > 0" src="@/assets/images/new-report/icon1_rise.png" alt="" />
                    <img v-else-if="item.contrast == null || item.contrast == 0"
                        src="@/assets/images/new-report/icon1_just.png" alt="" />
                    <img v-else src="@/assets/images/new-report/icon1_decline.png" alt="" />
                    <span class="diff-val">{{
                        item.contrast !== null
                        ? item.contrast >= 0
                            ? `${toDecimal2(item.contrast, 1)}°`
                            : `${toDecimal2(item.contrast, 1)}°`
                        : `${toDecimal2(item.contrast, 1)}°`
                    }}</span>
                </div>
            </div>
            <div class="heard">
                <i>|</i>
                <span>{{ item.name }}</span>
            </div>
            <div class="shape-list">
                <span class="title">{{ $t('shoulder.model.val') }}</span>
                <img src="@/assets/images/new-report/report/symbol.png" alt="" />
                <span :class="[
                    'val-list',
                    { 'val-color': item.conclusion && item.conclusion !== $t('shape.item.normal') },
                ]">{{ item.val === null || !item.val ? '--' : `${toDecimal2(item.val, 1)}°` }}</span>
                <img src="@/assets/images/new-report/report/symbol.png" alt="" />
                <span class="shoulder-status">
                    <span :class="[
                        'status',
                        { 'status-color': item.conclusion && item.conclusion !== $t('shape.item.normal') },
                    ]">
                        {{ item.conclusion !== null ? item.conclusion : '--' }}
                    </span>
                </span>
            </div>
            <div class="scope">{{ $t('shoulder.model.scope') }} {{ item.limit }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        item: Object,
    },
    mounted() {
        console.log(`传入信${JSON.stringify(this.item)}`)
    },
    methods: {
        handelHelp(name) {
            this.$emit('handelHelp', name)
        },
        toDecimal2(x, y) {
            let f = Math.round(x * 100) / 100
            // 取f的绝对值，去掉负数符号
            if (f < 0) {
                f = f * -1
            }
            let s = f.toString()
            let rs = s.indexOf('.')
            if (rs < 0) {
                rs = s.length
                s += '.'
            }
            while (s.length <= rs + y) {
                s += '0'
            }
            return s
        },
    },
}
</script>
<style lang="less" scoped>
.thermal-item {

    // padding: 0 11px;
    .data-list {
        width: 353px;
        text-align: left;
        background: url(../../../assets/images/new-report/report/shoulder_bj.png) center no-repeat;
        background-size: 100% 100%;
        padding-bottom: 21px;
        margin-bottom: 8px;
    }

    .contrast-box {
        min-height: 20px;
    }

    .contrast {
        color: #bcd0e5;
        background-image: url(../../../assets/images/new-report/report/contrast_last.png);
        background-repeat: no-repeat;
        background-position: right;
        background-size: 108px 21px;
        text-align: right;
        margin-right: 1px;

        img {
            width: 14px;
            height: 14px;
            margin-left: 2px;
            position: relative;
            top: 2px;
        }

        span {
            font-size: 11px;
            margin-right: 2px;
        }
    }

    span {
        font-size: 12px;
        color: #ffffff;
    }

    i {
        font-style: normal;
        margin: 10px 10px;
        background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        padding: 0 0.01px;  /* 防止文本裁剪异常 */
    }

    .shape-list {
        margin-top: 8px;

        .title {
            font-size: 12px;
            color: #8aa3be;
            padding-left: 28px;
        }

        img {
            width: 46px;
            height: 2px;
            margin: 0px 13px 3px 13px;
        }

        .val-list {
            display: inline-block;
            width: 70px;
            height: 22px;
            font-size: 16px;
            line-height: 22px;
            text-align: center;
            background-color: #33c070;
            border-radius: 10px;
        }

        .status {
            font-size: 12px;
            color: #33c070;
        }

        .status-color {
            color: #e64444;
        }

        .val-color {
            background-color: #cb4745;
        }
    }

    .scope {
        width: 351px;
        height: 13px;
        font-size: 13px;
        color: #8aa3be;
        text-align: center;
        margin-top: 5px;
    }
}

&.en-US,
&.it-IT,
&.es-ES {
    .shoulder-status {
        display: inline-flex;
        align-items: center;
        position: absolute;
        right: 10px;
        text-align: left;
        width: 75px;
        height: 24px;
        line-height: 12px;
    }

    .diff-val {
        margin-right: 10px !important;
    }
}

&.ja-JP {
    .shoulder-status {
        display: inline-flex;
        align-items: center;
        position: absolute;
        // right: 10px;
        text-align: left;
        width: 68px;
        height: 24px;
        line-height: 12px;
    }

    .contrast {
        background-size: 140px 21px;
    }
}
</style>
