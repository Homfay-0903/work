<!--
 * @Description: Description
 * @Author: zhaoqianqian
 * @Date: 2022-06-29 15:31:33
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2026-01-05 22:22:47
-->
<template>
    <!-- 体成分数据组件 -->
    <div :class="[styleChildren > 1 ? 'report-components' : 'report-style', $i18n.locale]">
        <!-- 身体成分 -->
        <div :class="['re-body-shell', charts.dataColumn]">
            <div class="re-body-cont">
                <div class="echarts-bg"></div>
                <div class="components-box" v-if="chart.contrast || (chart.contrast === 0 && chart.contrastData)">
                    <span>{{ $t('shoulder.model.diff') }}</span>
                    <img v-if="chart.diff > 0" src="@/assets/images/new-report/icon1_rise.png" alt />
                    <img v-else-if="chart.diff === 0" src="@/assets/images/new-report/icon1_just.png" alt />
                    <img v-else src="@/assets/images/new-report/icon1_decline.png" alt />
                    <span class="re-body-mark" v-if="chart.contrast && chart.diff > 0">
                        <span class="body-rise"></span>
                        <span class="mark-num" v-if="chart.dataColumn === 'WHR'">{{
                            toDecimal2(Math.abs(chart.diff), 2)
                        }}</span>
                        <span class="mark-num" v-else>{{
                            toDecimal2(Math.abs(chart.diff), 1)
                        }}</span>
                    </span>
                    <span class="re-body-mark re-body-mark-lower" v-if="chart.contrast && chart.diff < 0">
                        <span class="body-rise"></span>
                        <span class="mark-num" v-if="chart.dataColumn === 'WHR'">{{
                            toDecimal2(Math.abs(chart.diff), 2)
                        }}</span>
                        <span class="mark-num" v-else>{{
                            toDecimal2(Math.abs(chart.diff), 1)
                        }}</span>
                    </span>
                    <span
                        class="re-body-mark"
                        v-if="(chart.contrast && chart.diff === 0) || !chart.contrast"
                    >
                        <span class="body-rise"></span>
                        <span class="mark-num" v-if="chart.dataColumn === 'WHR'">{{
                            toDecimal2(Math.abs(chart.diff), 2)
                        }}</span>
                        <span class="mark-num" v-else>{{
                            toDecimal2(Math.abs(chart.diff), 1)
                        }}</span>
                    </span>
                </div>
                <div class="components-no-box" v-else></div>
                <div :class="[styleChildren > 1 ? 'body-weight-title' : 'body-weight-style', $i18n.locale]">
                    <div class="name">
                        <span class="weight-icon">
                            <img src="../../../assets/images/new-report/svg/WT.svg" alt v-if="charts.dataColumn === 'WT'" />
                            <img src="../../../assets/images/new-report/svg/BFM.svg" alt v-if="charts.dataColumn === 'BFM'" />
                            <img src="../../../assets/images/new-report/svg/BMI.svg" alt v-if="charts.dataColumn === 'BMI'" />
                            <img src="../../../assets/images/new-report/svg/BMR.svg" alt v-if="charts.dataColumn === 'BMR'" />
                            <img src="../../../assets/images/new-report/svg/FFM.svg" alt v-if="charts.dataColumn === 'FFM'" />
                            <img src="../../../assets/images/new-report/svg/LM.svg" alt v-if="charts.dataColumn === 'LM'" />
                            <img src="../../../assets/images/new-report/svg/PBF.svg" alt v-if="charts.dataColumn === 'PBF'" />
                            <img src="../../../assets/images/new-report/svg/PLM.svg" alt v-if="charts.dataColumn === 'PLM'" />
                            <img src="../../../assets/images/new-report/svg/PROTEIN.svg" alt v-if="charts.dataColumn === 'PROTEIN'" />
                            <img src="../../../assets/images/new-report/svg/PTBW.svg" alt v-if="charts.dataColumn === 'PTBW'" />
                            <img src="../../../assets/images/new-report/svg/SM.svg" alt v-if="charts.dataColumn === 'SM'" />
                            <img src="../../../assets/images/new-report/svg/TBW.svg" alt v-if="charts.dataColumn === 'TBW'" />
                            <img src="../../../assets/images/new-report/svg/TM.svg" alt v-if="charts.dataColumn === 'TM'" />
                            <img src="../../../assets/images/new-report/svg/WHR.svg" alt v-if="charts.dataColumn === 'WHR'" />
                            <img src="../../../assets/images/new-report/svg/ICW.svg" alt v-if="charts.dataColumn === 'ICW'" />
                            <img src="../../../assets/images/new-report/svg/ECW.svg" alt v-if="charts.dataColumn === 'ECW'" />
                            <img src="../../../assets/images/new-report/svg/NZZF.svg" alt v-if="charts.dataColumn === 'vaGrade'" />
                            <img
                                src="../../../assets/images/new-report/svg/METABOLICAGE.svg"
                                alt
                                v-if="charts.dataColumn === 'METABOLICAGE'"
                            />
                        </span>
                        {{ charts.name }}
                        <span v-if="charts.unit && charts.dataColumn !== 'METABOLICAGE'" class="unit">&nbsp;/&nbsp;</span>
                        <span class="unit" v-if="charts.dataColumn !== 'METABOLICAGE'">{{ unitTranslation(charts.unit) }}</span>
                        <!-- <span class="unit" v-else>{{ unitTranslation(charts.unit) }}</span> -->
                        <img
                            class="help-icon"
                            src="../../../assets/images/new-report/report/help.png"
                            alt
                            @click.prevent="handelHelp(charts.name)"
                        />
                    </div>
                </div>
                <div class="shell-title" ref="box" v-if="charts.dataColumn !== 'METABOLICAGE'">
                    <div class="box">
                        <div
                            :class="[
                                'standard-box-wrapper',
                                toDecimal2(charts.latestData.v, 2) !== '--' ? '' : 'opacity',
                            ]"
                            :style="charts.dataColumn === 'vaGrade' ? 'text-align: left' : ''"
                        >
                            <span v-if="charts.dataColumn === 'vaGrade'" class="standard-box-vaGrade">
                                <span class="standard-box-inners">
                                    <span>{{
                                        isUnit
                                            ? toDecimal(charts.latestData.l * 0.45359237, 1)
                                            : toDecimal(charts.latestData.l, 1)
                                    }}</span>
                                    <span class="standard-value">{{
                                        isUnit
                                            ? toDecimal(charts.latestData.h * 0.45359237, 1)
                                            : toDecimal(charts.latestData.h, 1)
                                    }}</span>
                                </span>
                            </span>
                            <span v-else-if="charts.dataColumn === 'WHR'" class="standard-box-WHR">
                                <span class="standard-box-inner">
                                    <span>{{
                                        isUnit
                                            ? toDecimal(charts.latestData.l * 0.45359237, 2)
                                            : toDecimal(charts.latestData.l, 2)
                                    }}</span>
                                    <span>{{
                                        isUnit
                                            ? toDecimal(charts.latestData.h * 0.45359237, 2)
                                            : toDecimal(charts.latestData.h, 2)
                                    }}</span>
                                </span>
                            </span>
                            <span v-else class="standard-box">
                                <span class="standard-box-inner">
                                    <span>{{
                                        isUnit
                                            ? toDecimal(charts.latestData.l * 0.45359237, 1)
                                            : toDecimal(charts.latestData.l, 1)
                                    }}</span>
                                    <span>{{
                                        isUnit
                                            ? toDecimal(charts.latestData.h * 0.45359237, 1)
                                            : toDecimal(charts.latestData.h, 1)
                                    }}</span>
                                </span>
                            </span>
                        </div>
                        <div
                            v-if="charts.dataColumn === 'vaGrade'"
                            :class="['inner-box', toDecimal2(charts.latestData.v, 2) !== '--' ? '' : 'opacity']"
                            ref="innerWidth"
                        >
                            <span :class="['speed-box', isDeviceReport ? 'isDeviceReport-box' : '']" :style="{ left: speedWidth }">
                                <img src="@/assets/images/new-report/report/nabla.png" alt class="nabla" />
                            </span>
                        </div>
                        <div
                            v-else
                            :class="['inner-box', toDecimal2(charts.latestData.v, 2) !== '--' ? '' : 'opacity']"
                            ref="innerWidth"
                        >
                            <span :class="['speed-box', isDeviceReport ? 'isDeviceReport-box' : '']" :style="{ left: speedWidth }">
                                <img src="@/assets/images/new-report/report/nabla.png" alt class="nabla" />
                            </span>
                        </div>
                        <div :class="['speed-bjcolor', isDeviceReport ? 'isDeviceReport' : '']" v-if="charts.dataColumn === 'vaGrade'">
                            <span>
                                <img src="@/assets/images/new-report/report/speed_color4.png" alt class="line-color" />
                            </span>
                            <span>
                                <img src="@/assets/images/new-report/report/speed_color5.png" alt class="line-color" />
                            </span>
                        </div>
                        <div :class="['speed-bjcolor', isDeviceReport ? 'isDeviceReport' : '']" v-else>
                            <span>
                                <img src="@/assets/images/new-report/report/speed_color1.png" alt class="speed-color" />
                            </span>
                            <span>
                                <img
                                    src="@/assets/images/new-report/report/speed_color2.png"
                                    alt
                                    class="speed-color speed-green"
                                />
                            </span>
                            <span>
                                <img src="@/assets/images/new-report/report/speed_color3.png" alt class="speed-color" />
                            </span>
                        </div>
                        <div>
                            <span
                                class="toolip-box"
                                :class="{
                                    'toolip-box-red':
                                        charts.latestData.v > charts.latestData.h ||
                                        charts.latestData.v < charts.latestData.l,
                                }"
                                :style="{ background: speedColor }"
                            >
                                <span v-if="charts.dataColumn === 'WHR'" class="latestData-val">
                                    {{ toDecimal2(charts.latestData.v, 2) }}
                                    <span v-if="toDecimal2(charts.latestData.v, 2) !== '--'" class="latestData-unit">{{
                                        unitTranslation(charts.unit)
                                    }}</span>
                                </span>
                                <span v-else class="latestData-val">
                                    {{ toDecimal2(charts.latestData.v, 1) }}
                                    <span v-if="toDecimal2(charts.latestData.v, 2) !== '--'" class="latestData-unit">{{
                                        unitTranslation(charts.unit)
                                    }}</span>
                                </span>
                            </span>
                        </div>

                        <div :class="['standard-text', isDeviceReport ? 'isDeviceReport-text' : '']">
                            <span v-if="charts.dataColumn !== 'vaGrade'">{{ $t('mass.segment.lowStandard') }}</span>
                            <span>{{ $t('mass.segment.standard') }}</span>
                            <span>{{ $t('mass.segment.superStandard') }}</span>
                        </div>
                    </div>
                </div>
                <div class="shell-title METABOLICAGE" v-else>
                    <span class="toolip-box">
                        <span class="latestData-val">{{ isVAPro7 ? Math.floor(charts.latestData.v) : charts.latestData.v }}</span>
                        {{ $t('userInfo.unit') }}
                    </span>
                </div>
            </div>
        </div>
        <!--体成分-弹出说明-->
        <van-popup v-model="popupAssess" class="body-composition-popup" popup-transition="popup-fade">
            <!-- 防止在pupop里滚动，body也跟着滚 -->
            <div class="popup-container" @touchmove.prevent>
                <div class="content pop center">
                    <h4>{{ charts.name }} {{ $t('shape.item.result') }}</h4>
                </div>
                <div
                    class="first-intro content first-charts center">
                    <p>{{ charts.desc }}</p>
                </div>
                <div class="pop-btn-action" @click="popupAssess = false">{{ $t('model.know') }}</div>
            </div>
        </van-popup>
    </div>
</template>

<script type="text/ecmascript-6">
import { _toDecimal } from '@/assets/js/util.js'
import { isVAPro7 } from '@/types/device.js'
export default {
    props: {
        chart: Object,
        index: Number,
        styleChildren: Number,
    },
    data() {
        return {
            charts: this.chart,
            popupAssess: false,
            unit: window.localStorage.getItem('unit'),
            isVAPro7: isVAPro7(),
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },
    computed: {
        isUnit() {
            return this.charts.unit === 'kg' && this.unit === 'metric'
        },
        // eslint-disable-next-line vue/return-in-computed-property
        speedWidth() {
            let unit = 1
            if (this.isUnit) {
                unit = 0.45359237
            }
            let clientWidth = document.body.clientWidth
            const d = this.charts
            const clineSlide = this.isDeviceReport ? 126 : 46
            const inner = clientWidth - clineSlide
            const half = Math.ceil(inner * 0.334)
            const halfs = Math.ceil(inner * 0.5)
            let speed = d.latestData.v - this.toDecimal(d.latestData.l * unit, 2)
            let ruler = this.toDecimal(d.latestData.h * unit, 2) - this.toDecimal(d.latestData.l * unit, 2)
            if (speed < 0 && d.latestData.v !== 0) {
                let a = (d.latestData.v / this.toDecimal(d.latestData.l * unit, 2)) * half
                return `${(a / clientWidth) * 100}vw`
            } else if (speed === 0) {
                console.log('>>>>>>>>>>speed === 0')
                if (d.dataColumn === 'vaGrade' && d.latestData.v === '1.0') {
                        return `${3}vw`
                    }
                return `${(half / clientWidth) * 100}vw`
            } else if (speed > 0) {
                let b = (speed / ruler) * half + half
                if (b > inner) {
                    return `${(inner * 95) / clientWidth}vw`
                } else {
                    if (d.dataColumn === 'vaGrade') {
                        return `${(((speed / ruler) * halfs) / clientWidth) * 100}vw`
                    } else {
                        return `${(b / clientWidth) * 100}vw`
                    }
                }
            }
        },
        speedColor() {
            let unit = 1
            if (this.isUnit) {
                unit = 0.45359237
            }
            const d = this.charts
            if (
                parseFloat(d.latestData.v) <= this.toDecimal(d.latestData.h * unit, 2) &&
                parseFloat(d.latestData.v) >= this.toDecimal(d.latestData.l * unit, 2)
            ) {
                return '#33C070'
            } else if (parseFloat(d.latestData.v) > this.toDecimal(d.latestData.h * unit, 2)) {
                return '#E04C45'
            } else {
                return '#4FA0F7'
            }
        },
    },
    methods: {
        unitTranslation(unit) {
            return unit
        },

        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        },
        toDecimal2(x, y) {
            let f = Math.round(x * 100) / 100
            let s = f.toString()
            let rs = s.indexOf('.')
            if (rs < 0) {
                rs = s.length
                s += '.'
            }
            while (s.length <= rs + y) {
                s += '0'
            }
            if (Number(s) === 0) {
                return 0
            }
            return s
        },
        handelHelp(name) {
            this.charts.name = name
            console.log(this.charts.name, 111, this.charts)
            console.log(this.$t('mass.explain[1].title'))
            if (name === this.$t('mass.explain[0].title')) {
                this.charts.desc = this.$t('mass.explain[0].msg')
            }
            if (name === this.$t('mass.explain[1].title')) {
                this.charts.desc = this.$t('mass.explain[1].msg')
            }
            if (name === this.$t('mass.explain[2].title')) {
                this.charts.desc = this.$t('mass.explain[2].msg')
            }
            if (name === this.$t('mass.explain[3].title')) {
                this.charts.desc = this.$t('mass.explain[3].msg')
            }
            if (name === this.$t('mass.explain[4].title')) {
                this.charts.desc = this.$t('mass.explain[4].msg')
            }
            if (name === this.$t('mass.explain[5].title')) {
                this.charts.desc = this.$t('mass.explain[5].msg')
            }
            if (name === this.$t('mass.explain[6].title')) {
                this.charts.desc = this.$t('mass.explain[6].msg')
            }
            if (name === this.$t('mass.explain[7].title')) {
                this.charts.desc = this.$t('mass.explain[7].msg')
            }
            if (name === this.$t('mass.explain[8].title')) {
                this.charts.desc = this.$t('mass.explain[8].msg')
            }
            if (name === this.$t('mass.explain[9].title')) {
                this.charts.desc = this.$t('mass.explain[9].msg')
            }
            if (name === this.$t('mass.explain[10].title')) {
                this.charts.desc = this.$t('mass.explain[10].msg')
            }
            if (name === this.$t('mass.explain[11].title')) {
                this.charts.desc = this.$t('mass.explain[11].msg')
            }
            if (name === this.$t('mass.explain[12].title')) {
                this.charts.desc = this.$t('mass.explain[12].msg')
            }
            if (name === this.$t('mass.explain[13].title')) {
                this.charts.desc = this.$t('mass.explain[13].msg')
            }
            if (name === this.$t('mass.explain[14].title')) {
                this.charts.desc = this.$t('mass.explain[14].msg')
            }
            if (name === this.$t('mass.explain[15].title')) {
                this.charts.desc = this.$t('mass.explain[15].msg')
            }
            if (name === '代谢年龄') {
                this.charts.desc = '代谢年龄是指身体及其健康相关的代谢功能的表现'
            }
            this.popupAssess = true
        },
    },
}
</script>
<style scoped lang="less">
// .body-composition-popup>div.content.first-intro{
//     background: url(../../../assets/images/new-report/svg/WT.svg) no-repeat 12px top;
// }
.popup-container {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
}

.body-composition-popup .popup-container > div.content.first-intro.wtinfo {
    background: url(../../../assets/images/new-report/svg/WT.svg) no-repeat 80px;
}

.body-composition-popup .popup-container > div.content.first-intro.ffminfo {
    background: url(../../../assets/images/new-report/svg/FFM.svg) no-repeat 75px;
}

.body-composition-popup .popup-container > div.content.first-intro.bfminfo {
    background: url(../../../assets/images/new-report/svg/BFM.svg) no-repeat 80px;
}

.body-composition-popup .popup-container > div.content.first-intro.lminfo {
    background: url(../../../assets/images/new-report/svg/LM.svg) no-repeat 80px;
}

.body-composition-popup .popup-container > div.content.first-intro.tbwinfo {
    background: url(../../../assets/images/new-report/svg/TBW.svg) no-repeat 80px;
}

.body-composition-popup .popup-container > div.content.first-intro.bmiinfo {
    background: url(../../../assets/images/new-report/svg/BMI.svg) no-repeat 90px;
}

.body-composition-popup .popup-container > div.content.first-intro.pbfinfo {
    background: url(../../../assets/images/new-report/svg/PBF.svg) no-repeat 80px;
}

.body-composition-popup .popup-container > div.content.first-intro.bmrinfo {
    background: url(../../../assets/images/new-report/svg/BMR.svg) no-repeat 75px;
}

.body-composition-popup .popup-container > div.content.first-intro.whrinfo {
    background: url(../../../assets/images/new-report/svg/WHR.svg) no-repeat 80px;
}

.body-composition-popup .popup-container > div.content.first-intro.visinfo {
    background: url(../../../assets/images/new-report/svg/NZZF.svg) no-repeat 55px;
}

.body-composition-popup .popup-container > div.content.first-intro.sminfo {
    background: url(../../../assets/images/new-report/svg/SM.svg) no-repeat 80px;
}

.body-composition-popup .popup-container > div.content.first-intro.tminfo {
    background: url(../../../assets/images/new-report/svg/TM.svg) no-repeat 80px;
}

.body-composition-popup .popup-container > div.content.first-intro.proteininfo {
    background: url(../../../assets/images/new-report/svg/PROTEIN.svg) no-repeat 80px;
}

.name img {
    width: 16px;
    margin-left: 5px;
}

.name {
    display: flex;
    width: 65%;
    align-items: center;
}

.report-components {
    padding: 5px 0 5px 0;
}

.report-style {
    padding: 10px 0 10px 0;
}

.popup-container {
    .content {
        h4 {
            color: #000000;
            font-size: 17px;
            font-weight: 540;
            margin-top: 10px;
            font-family: PingFangSC-Regular, PingFang SC;
        }
    }

    .center {
        text-align: center !important;
    }
}

.shell-title {
    width: 100%;

    .standard-box-wrapper {
        margin-top: 6px;
        &.opacity {
            opacity: 0;
        }
    }

    .speed-bjcolor {
        position: relative;
        top: -16px;
        display: flex;
        margin: 0 12px 0 15px;
        // background-color: #fff;
        span {
            flex: 1;
            // width: 30%;
            margin-right: 3px;
        }
        .speed-color {
            width: 100%;
            height: 6px;
        }

        .speed-green {

        }

        .line-color {
            width: 160px;
            height: 6px;
            // margin-right: 3px;
        }
    }
    .isDeviceReport{
        top: -2px;
    }
}

.re-body-shell {
    padding: 0 10px;
    border-radius: 5px;
    min-height: 122px;
    &.METABOLICAGE {
        min-height: 58px;
        .re-body-cont {
            height: 58px;
            position: relative;
            .toolip-box {
                display: inline-block;
                position: absolute;
                left: 140px;
                top: 18px;
                min-width: 34px;
                height: 24px;
                line-height: 22px;
                font-size: 11px;
                color: #fff;
                text-align: center;
                background-size: 100%;
                padding: 0 3px;
                width: 90px;
                height: 22px;
                line-height: 22px;
                border-radius: 10px;
                background: rgba(79, 160, 247, 1);
                .latestData-val {
                    font-size: 16px;
                }
            }
        }
    }
}

.re-body-cont {
    position: relative;
    // min-height: 50px;
    width: 353px;
    max-height: 142px;
    background: url(../../../assets/images/new-report/report/bj31.png) center no-repeat;
    background-size: 100% 100%;

    .components-box {
        color: #bcd0e5;
        background-image: url(../../../assets/images/new-report/report/contrast_last.png);
        background-repeat: no-repeat;
        background-position: right;
        background-size: 110px 21px;
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

    .components-no-box {
        height: 14px;
        width: 110px;
    }
}

.body-weight-title {
    width: 100%;
    margin-top: -10px;
    text-align: left;
    color: #fff;
    font-size: 14px;

    .help-icon {
        width: 10px;
        height: 10px;
    }

    .unit {
        color: #8aa3be;
        word-break: keep-all;
    }
}

.body-weight-style {
    width: 100%;
    margin-top: -10px;
    text-align: left;
    color: #fff;
    font-size: 14px;
    position: relative;
    top: 10px;

    .help-icon {
        width: 10px;
        height: 10px;
    }

    .unit {
        color: #8aa3be;
        word-break: keep-all;
    }
}

.METABOLICAGE {
    .body-weight-title {
        margin-top: -4px;
    }
    .body-weight-style {
        top: 15px;
    }
}

.es-ES,.it-IT,.fr-FR,.ru-RU,.pt-PT,.id-ID {
    .METABOLICAGE {
        .re-body-cont{
            height: 81px;
             .toolip-box{
                margin-top: 16px;
             }
        }
        .body-weight-title {
            margin-top: -12px !important;
        }
    }
}

.body-weight {
    width: 345px;
    height: 80px;
}

.weight-icon {
    display: inline-block;
    margin: 0 5px;
    background-size: contain;
    vertical-align: middle;

    img {
        margin-top: 2px;
        // 禁止部分安卓机下图片自动放大
        pointer-events: none;
    }
}

.pop {
    width: 100%;
    display: flex;
    padding-left: 40px;
    padding-right: 40px;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;

    .pop-span {
        margin-top: 11px;
        margin-right: 5px;
        display: flex;
        width: 20px;
        justify-content: center;

        img {
            background-size: cover;
            width: 20px;
        }
    }
}

.icon-qt {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url(../../../assets/images/sidebar/check/help_icon.png) no-repeat;
    background-size: cover;
    vertical-align: middle;
    margin-left: 7px;
}

.echarts-bg {
    width: 100%;
    // height: 32px;
    position: absolute;
    left: 0;
    // top: 46px;
    background-size: cover;
}

.box {
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 30px 0 0px;
    text-align: center;
}

.inner-box {
    background-size: 100%;
    text-align: left;
    position: relative;
    top: -5px;
    &.opacity {
        opacity: 0;
    }
}

.speed-box {
    display: inline-block;
    position: relative;
    left: 0;
    top: 4px;
    height: 10px;
    width: 100px;
    z-index: 5;

    .nabla {
        width: 15px;
        height: 11px;
    }
}
.isDeviceReport-box{
    top: 8px;
}

.inner-speed {
    display: inline-block;
    height: 100%;
    width: 100%;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    background: red;
    vertical-align: top;
    -webkit-animation: speed linear 1s;
    animation: speed linear 1s;
}

.toolip-box {
    display: inline-block;
    position: absolute;
    left: 140px;
    top: 40px;
    min-width: 34px;
    height: 24px;
    line-height: 22px;
    font-size: 11px;
    color: #fff;
    text-align: center;
    background-size: 100%;
    padding: 0 3px;
    width: 90px;
    height: 22px;
    line-height: 22px;
    border-radius: 10px;
    background: #33c070;

    span {
        text-align: center;
    }

    .latestData-val {
        font-size: 16px;
    }

    .latestData-unit {
        font-size: 10px;
    }
}

.standard-text {
    position: relative;
    top: -13px;
    display: flex;
    justify-content: space-around;
    color: rgba(255, 255, 255, 0.4);
    font-size: 12px;
    padding: 0 0 15px 0;
}
.isDeviceReport-text{
    top: 2px;
}

.standard-box {
    display: inline-block;
    height: 10px;
    width: 40%;
    font-size: 12px;
    text-align: center;
}

.standard-box-inner {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 100%;
    width: 100%;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

    span {
        color: rgba(255, 255, 255, 0.4);
    }
}

.standard-box-inners {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 100%;
    width: 100%;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

    span {
        color: rgba(255, 255, 255, 0.4);
    }

    .standard-value {
        position: absolute;
        left: 175px;
    }
}

.standard-box-vaGrade {
    display: inline-block;
    height: 10px;
    width: 60%;
    font-size: 12px;
    padding-left: 5%;
}

.standard-box-WHR {
    display: inline-block;
    height: 10px;
    width: 38%;
    font-size: 12px;
}

@-webkit-keyframes speed {
    from {
        width: 0px;
    }

    to {
        width: 100%;
    }
}

@keyframes speed {
    from {
        width: 0px;
    }

    to {
        width: 100%;
    }
}

@-webkit-keyframes speedLabel {
    from {
        right: 100%;
    }

    to {
        right: -19px;
    }
}

@keyframes speedLabel {
    from {
        right: 100%;
    }

    to {
        right: -19px;
    }
}

.first-charts {
    padding: 1px 24px 24px 35px !important;
}

</style>
