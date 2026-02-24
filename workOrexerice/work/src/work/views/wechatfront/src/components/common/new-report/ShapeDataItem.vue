<!--
 * @Description: Description
 * @Author: zhaoqianqian
 * @Date: 2022-07-04 17:19:10
 * @LastEditors: liutq
 * @LastEditTime: 2025-12-15 18:35:33
-->
<template>
    <!-- 体态数据  -->
    <div :class="['thermal-item', $i18n.locale]">
        <div class="data-list">
            <div :class="['heard', { 'isDeviceReport': isDeviceReport }]">
                <i></i>
                <span class="posture-name">{{ item.name }}<img class="help-icon"
                        src="@/assets/images/new-report/report/help.png" alt
                        @click.prevent="handelHelp(item.name)" /></span>
            </div>
            <div v-if="!isOnly" class="shape-list">
                <span class="title">测量值</span>
                <div alt="" class="symbol-ico"></div>
                <span :class="['val-list', { 'val-color': item.status !== '正常' && item.status !== '--' }]" v-if="unit === 'metric'">{{ item.val |
                    onHandler }}</span>
                <span :class="['val-list', { 'val-color': item.status !== '正常' && item.status !== '--' }]" v-else>{{ item.val |
                    onHandler }}</span>
                <div alt="" class="symbol-ico"></div>

                <span class="shape-status">
                    <span :class="['status', { 'status-color': item.status !== '正常' && item.status !== '--' }]">{{
                        item.status
                    }}</span>
                </span>
            </div>

            <div v-else style="padding: 0 25px;  position: relative;">
                    <div v-if="item.val !== '--' " :class="index === 3 ? 'pelvis-div-new': 'pelvis-div' ">
                        <img v-for="(items, ty) in imgList[index]" :key="ty" :src="items.path" alt="">
                    </div>
                    <div v-else class="pelvis-div-span">
                        <span><img v-if="commonIndex(item.val) !==0 && item.status" src="@/assets/images/gup/error-warning-fill@2x.png" alt="">测量未成功</span>
                    </div>
                    <div v-if="index === 3" class="pelvis-box-tags" :style="{'left': commonIndex(item.val)*33 + 12 +'%'}">
                        <img v-if="handelDate(item.val) !==0 && item.status" :src="handelDateIcon" />
                    </div>
                    <div v-else class="pelvis-box-tags" :style="{'left': commonIndex(item.val)*20 + 7 +'%'}">
                        <img v-if="handelDate(item.val) !==0 && item.status" :src="handelDateIcon" />
                    </div>
                    <div :class="[getClass(pIndex), index === 3 ? 'new-shap' : '']" v-for="(items, pIndex) in pelvisList[index]" :key="pIndex">
                        <span>{{items}}</span>
                    </div>
            </div>

        </div>
    </div>
</template>

<script>
import { _toDecimal } from '@/assets/js/util.js'
export default {
    filters: {
        onHandler(value) {
            if (value.indexOf('undefined') > -1 || value.indexOf('NaN') > -1) {
                return '-'
            } else {
                return value
            }
        }
    },
    props: {
        item: Object,
        isLeg: Boolean,
        isOnly: {
            type: Boolean,
            default: false
        },
        index: Number,
        pelvisForwardState: Number
    },
    data() {
        return {
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport'),
            unit: window.localStorage.getItem('unit'),
            pelvisList: [
                ['前移异常', '前移风险', '正常', '后移风险', '后移异常'],
                ['前倾异常', '前倾风险', '正常', '后倾风险', '后倾异常'],
                ['左长异常', '左长风险', '正常', '右长风险', '右长异常'],
                ['异常', '可能异常', '正常'],
            ],
            imgList: [
                [
                    {
                        path: require('@/assets/images/gup/qianyiyichang2x.png')
                    },
                    {
                        path: require('@/assets/images/gup/qianhouyi2x.png')
                    },
                    {
                        path: require('@/assets/images/gup/houyiyichang1@2x.png')
                    },
                ],
                [
                    {
                        path: require('@/assets/images/gup/qianqingyichang.png')
                    },
                    {
                        path: require('@/assets/images/gup/qianqingzhengchang.png')
                    },
                    {
                        path: require('@/assets/images/gup/houqingyichang.png')
                    },
                ],
                [
                    {
                        path: require('@/assets/images/gup/zuochang.png')
                    },
                    {
                        path: require('@/assets/images/gup/zhenchang.png')
                    },
                    {
                        path: require('@/assets/images/gup/youzhang.png')
                    },
                ],
                [
                    {
                        path: require('@/assets/images/gup/qianyiyichang2x.png')
                    },
                    {
                        path: require('@/assets/images/gup/qianhouyi2x.png')
                    },
                ]
            ],
            select: [
                { path: require('@/assets/images/gup/alert-fill@2x.png') },
                { path: require('@/assets/images/gup/alert-fill2@2x.png') }
            ]
        }
    },
    computed: {
        handelDateIcon() {
            return [1, -1].indexOf(this.handelDate(this.item.val)) > -1 ? this.select[1].path : this.select[0].path
        },
    },
    methods: {
        handelHelp(name) {
            console.log(`当前体态类型${JSON.stringify(JSON.stringify(this.item))}`)
            this.$emit('handelHelp', name)
        },
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        },
        // 处理iCON
        handlerIcon(index, second, img) {
            this.imgList[index][second].path = require(`@/assets/images/gup/${img}.png`)
        },
        handelDate(value) {
            if (!value) return
            let v = parseFloat(value.replace(/°|cm/g, ''))
            if (this.index === 0) {
                if (170 <= v && v < 175) {
                    this.handlerIcon(0, 0, 'qianyiyichang1@2x')
                    return -1
                } else if (170 > v) {
                    this.handlerIcon(0, 0, 'qianyiyichang1@2x')
                    return -2
                } else if (185 < v && v <= 190) {
                    this.handlerIcon(0, 2, 'houyiyichang@2x')
                    return 1
                } else if (v > 190) {
                    this.handlerIcon(0, 2, 'houyiyichang@2x')
                    return 2
                } else if (175 <= v && v <= 185) {
                    this.handlerIcon(0, 1, 'qianhouyi1@2x')
                }
                return 0
            } else if (this.index === 1) {
                if (15 < v && v <= 20) {
                    this.handlerIcon(1, 0, 'qianqingyichang1@2x')
                    return -1
                } else if (20 < v) {
                    this.handlerIcon(1, 0, 'qianqingyichang1@2x')
                    return -2
                } else if (v < 0 && v >= -5) {
                    this.handlerIcon(1, 2, 'houqingyichang2')
                    return 1
                } else if (v < -5) {
                    this.handlerIcon(1, 2, 'houqingyichang2')
                    return 2
                } else if (0 <= v && v <= 15) {
                    this.handlerIcon(1, 1, 'qianqingzhengchang1@2x')
                }
                return 0
            } else if (this.index === 2) {
                if (1 < v && v <= 2) {
                    this.handlerIcon(2, 0, 'zuochang@2')
                    return -1
                } else if (2 < v) {
                    this.handlerIcon(2, 0, 'zuochang@2')
                    return -2
                } else if (v < -1 && v >= -2) {
                    this.handlerIcon(2, 2, 'youzhang@2')
                    return 1
                } else if (v < -2) {
                    this.handlerIcon(2, 2, 'youzhang@2')
                    return 2
                } else if (-1 <= v && v <= 1) {
                    this.handlerIcon(2, 1, 'zhenchang@2')
                }
                return 0
            } else if (this.index === 3) {
                 if ([1].includes(this.pelvisForwardState)) {
                    this.handlerIcon(3, 0, 'qianyiyichang1@2x')
                    return -2
                } else if ([2].includes(this.pelvisForwardState)) {
                    this.handlerIcon(3, 0, 'qianyiyichang1@2x')
                    return -1
                } else if ([0].includes(this.pelvisForwardState)) {
                    this.handlerIcon(3, 1, 'qianhouyi1@2x')
                }
                return 0
            }

        },
        commonIndex(val) {
            let key = this.handelDate(val)

            switch (key) {
                case -2:
                    return 0
                case -1:
                    return 1
                case 0:
                    return 2
                case 1:
                    return 3
                case 2:
                    return 4
                default:
                    break
            }
        },
        getClass(ind) {
            return this.commonIndex(this.item.val) === ind && this.item.val !== '--' ? this.index === 3 ? 'pelvis-box-active-new' : 'pelvis-box-active' : this.index === 3 ? 'pelvis-box-new' : 'pelvis-box'
        }
    }
}
</script>
<style lang="less" scoped>
.data-list {
    width: 351px;
    min-height: 92px;
    height: fit-content;
    text-align: left;
    background: url(../../../assets/images/new-report/report/bj31.png) center no-repeat;
    background-size: 100% 100%;
    margin-bottom: 10px;
    padding-bottom: 10px;

    .heard {
        padding-top: 12px;
        display: flex;
        flex-direction: row;
        padding-right: 10px;
        align-items: center;

        .posture-name {
            font-size: 12px;
            color: #ffffff;
        }

        .help-icon {
            width: 10px;
            height: 10px;
            margin-left: 5px;
        }
    }

    i {
        font-style: normal;
        margin: 10px 10px;
        background: linear-gradient(90deg, #00E3C9 0%, #009FE8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        padding: 0 0.01px;  /* 防止文本裁剪异常 */
    }
    .isDeviceReport{
        i{
            display: inline-block;
            width: 2px;
            height: 10px;
            -webkit-background-clip: unset;
            background-clip: unset;
            -webkit-text-fill-color: unset;
            color: inherit;
        }
    }

    .shape-list {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;

        .title {
            font-size: 12px;
            color: #8AA3BE;
            width: 66px;
            // padding-left: 28px;
        }

        .symbol-ico {
            width: 30px;
            height: 2px;
            // margin-left: 16px;
            background: url('../../../assets/images/new-report/report/symbol_ico_long.png') repeat-x;
            background-size: cover;
        }

        img {
            width: 46px;
            height: 2px;
            margin: 0px 16px 3px 16px;
        }

        .val-list {
            display: inline-block;
            width: 70px;
            height: 22px;
            font-size: 16px;
            line-height: 22px;
            text-align: center;
            background-color: #33C070;
            border-radius: 10px;
            color: #ffffff;
        }

        .status {
            font-size: 12px;
            color: #33C070;
        }

        .status-color {
            color: #E64444;
        }

        .val-color {
            background-color: #CB4745;
        }

        .shape-status {

            text-align: left;
            width: 66px;

        }
    }
    .pelvis-div{
            padding: 0 6%;
            display: flex;
            justify-content: space-around;
            img{
                width: 30px;
                height: 48px;
            }
        }
        .pelvis-div-new {
            padding: 0 0 0 29%;
             img{
                width: 30px;
                height: 48px;
                &:first-of-type{
                    margin-right: 54%;
                }
            }

        }
        .pelvis-box, .pelvis-box-active, .pelvis-box-active-new, .pelvis-box-new {
                display: inline-block;
                width: 20%;
                height: 4px;
                background: #009FE8;
                position: relative;
                top: -7px;
                &:nth-of-type(6N+1), &:nth-of-type(3){
                    background: #E02020;
                }
                span{
                    display: inline-block;
                    letter-spacing: 1px;
                    font-size: 12px;
                    color: #8AA3BE;
                    line-height: 34px;
                    width: 100%;
                    text-align: center;
                }
                &:nth-of-type(6N+1){
                    border-bottom-right-radius: 3px;
                    border-top-right-radius: 3px;
                }
                &:nth-of-type(3){
                    border-bottom-left-radius: 3px;
                    border-top-left-radius: 3px;
                }
                &:nth-of-type(4N),  &:nth-of-type(4N+2){
                    background: #F7B500;
                }
            }
            .pelvis-box-new, .pelvis-box-active-new {
                width: 33.3%;
            }
            .new-shap{
                &:last-child{
                    border-bottom-right-radius: 3px;
                    border-top-right-radius: 3px;
                }
            }
            .pelvis-box-active, .pelvis-box-active-new{
                span{
                    // font-weight: bold;
                    color: #fff;
                    opacity: 0.8;
                }
            }
            .pelvis-box-tags{
                position: relative;
                top: -8px;
                z-index: 10;
                height: 10px;
                img {
                    width: 17px;
                    height: 17px;
                }
            }
            .pelvis-div-span{
                font-size: 14px;
                color: #8AA3BE;
                line-height: 36px;
                font-style: normal;
                text-align: center;
                span {
                    img{
                        display: inline;
                        position: relative;
                        top: 4px;
                        left: -2px;
                        width: 17px;
                        height: 17px;
                    }
                }
            }
}
</style>

