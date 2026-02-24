<template>
    <!-- 体成分数据组件 -->
    <div class="report-components">
        <!-- 身体成分 -->
        <div class="re-body-shell">
            <div class="re-body-cont">
                <div class="echart-bg"></div>
                <span class="re-body-mark" v-if="showDiffValue() === 1">
                    <span class="body-rise"></span>
                    <span class="mark-num" v-if="chart.dataColumn === 'WHR'">{{ toDecimal2((Math.abs(chart.lates -
                        chart.contrast)), 2) }}</span>
                    <span class="mark-num" v-else-if="chart.dataColumn === 'METABOLICAGE'">{{ toDecimal2((Math.abs(chart.lates -
                        chart.contrast)), 0) }}</span>
                    <span class="mark-num" v-else>{{ toDecimal2((Math.abs(chart.lates - chart.contrast)), 1) }}</span>
                </span>
                <span class="re-body-mark re-body-mark-lower" v-if="showDiffValue() === 2">
                    <span class="body-rise"></span>
                    <span class="mark-num" v-if="chart.dataColumn === 'WHR'">{{ toDecimal2((Math.abs(chart.lates -
                        chart.contrast)), 2) }}</span>
                    <span class="mark-num" v-else-if="chart.dataColumn === 'METABOLICAGE'">{{ toDecimal2((Math.abs(chart.lates -
                        chart.contrast)), 0) }}</span>
                    <span class="mark-num" v-else>{{ toDecimal2((Math.abs(chart.lates - chart.contrast)), 1) }}</span>
                </span>
                <span class="re-body-mark" v-if="showDiffValue() === 0" style="display: none">
                    <span class="body-rise"></span>
                </span>
                <div class="body-weight-title">
                    <div class="name">
                        <span class="weight-icon">
                            <img src="../../assets/images/svg/WT.svg" alt v-if="chart.dataColumn === 'WT'" />
                            <img src="../../assets/images/svg/BFM.svg" alt v-if="chart.dataColumn === 'BFM'" />
                            <img src="../../assets/images/svg/BMI.svg" alt v-if="chart.dataColumn === 'BMI'" />
                            <img src="../../assets/images/svg/BMR.svg" alt v-if="chart.dataColumn === 'BMR'" />
                            <img src="../../assets/images/svg/FFM.svg" alt v-if="chart.dataColumn === 'FFM'" />
                            <img src="../../assets/images/svg/LM.svg" alt v-if="chart.dataColumn === 'LM'" />
                            <img src="../../assets/images/svg/PBF.svg" alt v-if="chart.dataColumn === 'PBF'" />
                            <img src="../../assets/images/svg/PLM.svg" alt v-if="chart.dataColumn === 'PLM'" />
                            <img src="../../assets/images/svg/PROTEIN.svg" alt v-if="chart.dataColumn === 'PROTEIN'" />
                            <img src="../../assets/images/svg/PTBW.svg" alt v-if="chart.dataColumn === 'PTBW'" />
                            <img src="../../assets/images/svg/SM.svg" alt v-if="chart.dataColumn === 'SM'" />
                            <img src="../../assets/images/svg/TBW.svg" alt v-if="chart.dataColumn === 'TBW'" />
                            <img src="../../assets/images/svg/TM.svg" alt v-if="chart.dataColumn === 'TM'" />
                            <img src="../../assets/images/svg/WHR.svg" alt v-if="chart.dataColumn === 'WHR'" />
                            <img src="../../assets/images/svg/ICW.svg" alt v-if="chart.dataColumn === 'ICW'" />
                            <img src="../../assets/images/svg/ECW.svg" alt v-if="chart.dataColumn === 'ECW'" />
                            <img src="../../assets/images/svg/NZZF.svg" alt v-if="chart.dataColumn === 'vaGrade'" />
                            <img src="../../assets/images/svg/age.svg" alt v-if="chart.dataColumn === 'METABOLICAGE'" />
                        </span>
                        {{ chart.name }}
                        <span v-if="chart.unit">&nbsp;|&nbsp;</span>
                        {{ chart.unit }}
                        <img src="../../assets/images/comp_help_icon.png" alt @click.prevent="handelHelp(chart.name)" />
                        <div v-if="chart.dataColumn === 'METABOLICAGE'" class="age-value-bg">{{ chart.latestData.v }}岁</div>
                    </div>
                </div>
                <div class="shell-title" ref="box" v-if="chart.dataColumn !== 'METABOLICAGE'">
                    <div class="box">
                        <div v-if="chart.dataColumn === 'vaGrade'" class="inner-box-vaGrade" ref="innerWidth">
                            <span class="speed-box" :style="{ width: speedWidth }">
                                <span class="inner-speed" :style="{ background: speedColor }"></span>
                                <span class="toolip-box"
                                    :class="{ 'toolip-box-red': chart.latestData.v > chart.latestData.h || chart.latestData.v < chart.latestData.l }">
                                    <span v-if="chart.dataColumn === 'WHR'">{{ toDecimal2(chart.latestData.v, 2) }}</span>
                                    <span v-else>{{ toDecimal2(chart.latestData.v, 1) }}</span>
                                </span>
                            </span>
                        </div>
                        <div v-else class="inner-box" ref="innerWidth">
                            <span class="speed-box" :style="{ width: speedWidth }">
                                <span class="inner-speed" :style="{ background: speedColor }"></span>
                                <span class="toolip-box"
                                    :class="{ 'toolip-box-red': chart.latestData.v > chart.latestData.h || chart.latestData.v < chart.latestData.l }">
                                    <span v-if="chart.dataColumn === 'WHR'">{{ toDecimal2(chart.latestData.v, 2) }}</span>
                                    <span v-else>{{ toDecimal2(chart.latestData.v, 1) }}</span>
                                </span>
                            </span>
                        </div>
                        <div class="standard-box-wrapper"
                            :style="chart.dataColumn === 'vaGrade' ? 'text-align: left' : ''">
                            <span v-if="chart.dataColumn === 'vaGrade'" class="standard-box-vaGrade">
                                <span class="standard-box-inner">
                                    <span>{{ toDecimal2(chart.latestData.l, 1) }}</span>
                                    <span>{{ toDecimal2(chart.latestData.h, 1) }}</span>
                                </span>
                            </span>
                            <span v-else class="standard-box">
                                <span class="standard-box-inner">
                                    <span>{{ toDecimal2(chart.latestData.l, 1) }}</span>
                                    <span>{{ toDecimal2(chart.latestData.h, 1) }}</span>
                                </span>
                            </span>
                        </div>
                        <div class="standard-text">
                            <span v-if="chart.dataColumn !== 'vaGrade'">低标准</span>
                            <span>标准</span>
                            <span>超标准</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--体成分-弹出说明-->
        <mt-popup v-model="popupAssess" class="body-composition-popup" popup-transition="popup-fade">
            <!-- 防止在pupop里滚动，body也跟着滚 -->
            <div class="popup-container" @touchmove.prevent>
                <h5>{{ chart.name }}说明</h5>
                <div class="first-intro content"
                    :class="{ 'wtinfo': chart.name === '体重', 'ffminfo': chart.name === '去脂体重', 'bfminfo': chart.name === '体脂肪', 'lminfo': chart.name === '肌肉量', 'tbwinfo': chart.name === '总水分', 'bmiinfo': chart.name === 'BMI', 'pbfinfo': chart.name === '体脂率', 'bmrinfo': chart.name === '基础代谢', 'whrinfo': chart.name === '腰臀比', 'visinfo': chart.name === '内脏脂肪等级', 'sminfo': chart.name === '骨骼肌', 'tminfo': chart.name === '无机盐', 'proteininfo': chart.name === '蛋白质', 'ageinfo': chart.name === '代谢年龄' }">
                    <p>{{ chart.desc }}</p>
                </div>
                <div class="pop-btn-action" @click="popupAssess = false">我知道了</div>
            </div>
        </mt-popup>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    props: {
        chart: Object
    },
    data() {
        return {
            popupAssess: false
        }
    },
    computed: {
        speedWidth() {
            // 优先使用模板中 ref 的真实宽度，保证在不同设备上表现一致
            const boxEl = this.$refs.innerWidth
            const containerWidth = boxEl ? boxEl.clientWidth : Math.max(1, document.documentElement.clientWidth - 46)
            const inner = Math.max(1, containerWidth) // px，防止除以 0
            const mid = Math.ceil(inner * 0.334) // 中间基准像素
            const halfs = Math.ceil(inner * 0.5) // vaGrade 专用半宽像素

            const d = this.chart || {}
            const ld = d.latestData || {}
            const v = Number(ld.v) || 0
            const l = Number(ld.l) || 0
            const h = Number(ld.h) || 0
            const speed = v - l
            const range = h - l

            // 将 px 转为相对于 inner 的百分比字符串，限制在 [0,100]
            const pxToPercent = px => {
                const pct = (px / inner) * 100
                const clamped = Math.max(0, Math.min(100, pct))
                return `${clamped.toFixed(2)}%`
            }

            // speed === 0：放在中间基准
            if (speed === 0) return pxToPercent(mid)

            // 低于低标准（左侧）
            if (speed < 0) {
                if (l <= 0) {
                    // 无法按比例计算时退回到 mid 的一半
                    return pxToPercent(mid * 0.5)
                }
                const leftPx = (v / l) * mid
                return pxToPercent(leftPx)
            }

            // 高于低标准（右侧）
            if (speed > 0) {
                if (range <= 0) {
                    // 无有效区间时回退到 mid + 少量偏移
                    return pxToPercent(Math.min(inner, mid + halfs * 0.2))
                }
                const b = (speed / range) * mid + mid
                if (b > inner) {
                    return pxToPercent(inner * 0.95)
                }
                if (d.dataColumn === 'vaGrade') {
                    return pxToPercent((speed / range) * halfs)
                }
                return pxToPercent(b)
            }

            return pxToPercent(mid)
        },
        speedColor() {
            const d = this.chart
            if (d.latestData.v <= d.latestData.h && d.latestData.v >= d.latestData.l) {
                return '#3bb684'
            } else if (d.latestData.v > d.latestData.h) {
                return '#cc285c'
            } else {
                return '#cc285c'
            }
        }
    },
    mounted() {
        // console.log(`当前接收到数据${JSON.stringify(this.chart)}`)
        if (this.chart.dataColumn === 'METABOLICAGE') {
            console.log(`当前接收到数据${JSON.stringify(this.chart)}`)
        }
    },
    methods: {
        toDecimal2(x, y) {
            let f = Math.round(x * 100) / 100
            let s = f.toString()
            let rs = s.indexOf('.')
            if (y === 0) {
                return rs > 0 ? s.substring(0, rs) : s
            }
            if (rs < 0) {
                rs = s.length
                s += '.'
            }
            while (s.length <= rs + y) {
                s += '0'
            }
            return s
        },
        // 是否显示对比值 0不显示
        showDiffValue() {
            if (this.chart.dataColumn === 'ICW' || this.chart.dataColumn === 'ECW') {
                if (this.chart.contrastData && ((this.chart.latestData.l === 0 && this.chart.latestData.h === 0) || (this.chart.contrastData.l === 0 && this.chart.contrastData.h === 0))) {
                    return 0
                }
            }
            if (this.chart.dataColumn === 'METABOLICAGE') {
                if (this.chart.lates === 0 || this.chart.contrast === 0) {
                    return 0
                }
            }
            if (this.chart.contrast && this.chart.lates > this.chart.contrast) {
                return 1
            }
            if (this.chart.contrast && this.chart.lates < this.chart.contrast) {
                return 2
            }
            return 0
        },
        handelHelp(name) {
            this.chart.name = name
            if (name === '体重') {
                this.chart.desc = '体重是身体水分、蛋白质、无机盐和体脂肪的总和。'
            }
            if (name === '去脂体重') {
                this.chart.desc = '去脂体重是体重扣除脂肪的部分。'
            }
            if (name === '体脂肪') {
                this.chart.desc = '体脂肪是皮下脂肪，内脏脂肪和肌肉之间脂肪的总和。'
            }
            if (name === '肌肉量') {
                this.chart.desc = '肌肉量是体重减去体脂肪含量和无机盐含量。'
            }
            if (name === '总水分') {
                this.chart.desc =
                    '身体水分在人体成分中占的含量最多，占体重的50%~70%，身体水分分布于人体细胞和体液中，其中大部分存在于肌肉细胞中。'
            }
            if (name === '骨骼肌') {
                this.chart.desc = '骨骼肌又称横纹肌，附着在骨骼上的肌肉，肌肉中的一种，此处计算的是骨骼肌的含量。'
            }
            if (name === '蛋白质') {
                this.chart.desc = '蛋白质是含氮的固态物质，存在于人体所有细胞内，参与细胞构成。是肌肉量的主要成分。'
            }
            if (name === '无机盐') {
                this.chart.desc =
                    '人体是由有机物、无机物和水组成的，人体里的无机物叫无机盐，无机盐大约占人体重量的5%。'
            }
            if (name === '基础代谢') {
                this.chart.desc =
                    '基础代谢指人体在清醒而安静的状况下，不受运动、食物、神经紧张、外界温度变化等影响时一天消耗的总能量。'
            }
            if (name === '腰臀比') {
                this.chart.desc = '腰臀比是腰围和臀围的比值，是判定中心性肥胖的重要指标。'
            }
            if (name === '内脏脂肪等级') {
                this.chart.desc = '内脏脂肪等级是评价是否属于隐性肥胖的重要指标。'
            }
            if (name === 'BMI') {
                this.chart.desc = '又称为BMI，主要用于评估外观肥胖度，国际上常作为衡量人体胖瘦程度的标准。'
            }
            if (name === '体脂率') {
                this.chart.desc = '体脂率是指体脂肪占体重的比率。'
            }
            if (name === '细胞内液') {
                this.chart.desc = '细胞内液是机体细胞总体所含的体液，是原生质的基本组成部分。'
            }
            if (name === '细胞外液') {
                this.chart.desc = '通常指位于细胞外的体液，包括血浆以及介于血管和组织细胞之间的组织间液'
            }
            if (name === '代谢年龄') {
                this.chart.desc = '代谢年龄是指身体及其健康相关的代谢功能的表现'
            }
            this.popupAssess = true
        }
    }
}
</script>
<style scoped lang="less">
// .body-composition-popup>div.content.first-intro{
//     background: url(../../assets/images/svg/WT.svg) no-repeat 12px top;
// }
.body-composition-popup .popup-container>div.content.first-intro.wtinfo {
    background: url(../../assets/images/svg/WT.svg) no-repeat 12px top;
}

.body-composition-popup .popup-container>div.content.first-intro.ffminfo {
    background: url(../../assets/images/svg/FFM.svg) no-repeat 12px top;
}

.body-composition-popup .popup-container>div.content.first-intro.bfminfo {
    background: url(../../assets/images/svg/BFM.svg) no-repeat 12px top;
}

.body-composition-popup .popup-container>div.content.first-intro.lminfo {
    background: url(../../assets/images/svg/LM.svg) no-repeat 12px top;
}

.body-composition-popup .popup-container>div.content.first-intro.tbwinfo {
    background: url(../../assets/images/svg/TBW.svg) no-repeat 12px top;
}

.body-composition-popup .popup-container>div.content.first-intro.bmiinfo {
    background: url(../../assets/images/svg/BMI.svg) no-repeat 12px top;
}

.body-composition-popup .popup-container>div.content.first-intro.pbfinfo {
    background: url(../../assets/images/svg/PBF.svg) no-repeat 12px top;
}

.body-composition-popup .popup-container>div.content.first-intro.bmrinfo {
    background: url(../../assets/images/svg/BMR.svg) no-repeat 12px top;
}

.body-composition-popup .popup-container>div.content.first-intro.whrinfo {
    background: url(../../assets/images/svg/WHR.svg) no-repeat 12px top;
}

.body-composition-popup .popup-container>div.content.first-intro.visinfo {
    background: url(../../assets/images/svg/NZZF.svg) no-repeat 12px top;
}

.body-composition-popup .popup-container>div.content.first-intro.sminfo {
    background: url(../../assets/images/svg/SM.svg) no-repeat 12px top;
}

.body-composition-popup .popup-container>div.content.first-intro.tminfo {
    background: url(../../assets/images/svg/TM.svg) no-repeat 12px top;
}

.body-composition-popup .popup-container>div.content.first-intro.proteininfo {
    background: url(../../assets/images/svg/PROTEIN.svg) no-repeat 12px top;
}
.body-composition-popup .popup-container>div.content.first-intro.ageinfo {
    background: url(../../assets/images/svg/age.svg) no-repeat 12px top;
}
.body-composition-popup .popup-container>div.content.first-intro {
    background-size: 18px !important;
}
.name img {
    width: 16px;
    margin-left: 5px;
}

.name {
    display: flex;
    width: 80%;
    align-items: center;
}

.report-components {
    margin-bottom: 10px;
}

.shell-title {
    width: 100%;
}

.re-body-shell {
    padding: 0 10px;
    background-color: rgba(45, 47, 86, 0.6);
    border-radius: 5px;
    overflow: hidden;
}

.re-body-cont {
    position: relative;
    min-height: 50px;
}

.re-body-mark {
    padding: 0 2px;
    min-width: 6.8%;
    min-height: 22px;
    font-size: 13px;
    color: #fff;
    background: #fcb127;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .body-rise {
        display: inline-block;
        width: 7px;
        height: 9px;
        margin-top: -2px;
        background: url(../../assets/images/comp_addTo_icon.png) no-repeat;
        background-size: cover;
        vertical-align: text-bottom;
        margin-right: 1px;
    }
}

.re-body-mark-lower {
    background-color: #069cfa;

    .body-rise {
        transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        /* IE 9 */
        -moz-transform: rotate(180deg);
        /* Firefox */
        -webkit-transform: rotate(180deg);
        /* Safari 和 Chrome */
        -o-transform: rotate(180deg);
        /* Opera */
    }
}

.body-weight-title {
    width: 100%;
    padding-top: 10px;
    text-align: left;
    color: #fff;
    font-size: 14px;
}

.body-weight {
    width: 345px;
    height: 80px;
}

.weight-icon {
    display: inline-block;
    margin: 0 5px;
    background-size: cover;
    vertical-align: middle;

    img {
        margin-top: 2px;
        // 禁止部分安卓机下图片自动放大
        pointer-events: none;
    }
}
.age-value-bg {
    height: 18px;
    padding-left: 9px;
    padding-right: 9px;
    border: 1px solid transparent;
    border-radius: 9px;
    margin-left: 16px;
    // border-image: linear-gradient(90deg, rgba(0, 227, 201, 1), rgba(0, 159, 232, 1)) 1 1;
    font-size: 12px;
    color: #FFFFFF;
    line-height: 18px;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(to right, #222, #222), linear-gradient(90deg, rgba(0, 227, 201, 1), rgba(0, 159, 232, 1));
}
.icon-qt {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url(../../assets/images/sidebar/check/help_icon.png) no-repeat;
    background-size: cover;
    vertical-align: middle;
    margin-left: 7px;
}

.echart-bg {
    width: 100%;
    height: 32px;
    position: absolute;
    left: 0;
    top: 46px;
    background-size: cover;
}

.box {
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 30px 0 10px;
    text-align: center;
}
.value-box {
    display: inline-block;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 15px;
    text-align: center;
    background-color: red;
    border-radius: 20px;
    color: #fff;
}

.inner-box {
    height: 32px;
    background: url(../../assets/images/lALPBbCc1kTWwA9AzQKL_651_64.png) no-repeat left top;
    background-size: 100%;
    text-align: left;
}

.inner-box-vaGrade {
    height: 32px;
    background: url(../../assets/images/size-bg.png) no-repeat left top;
    background-size: 100%;
    text-align: left;
}

.speed-box {
    display: inline-block;
    position: relative;
    left: 0;
    top: 4px;
    height: 10px;
    width: 100px;
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
    right: -15px;
    top: -23px;
    min-width: 34px;
    height: 24px;
    line-height: 22px;
    font-size: 11px;
    color: #fff;
    text-align: center;
    background: url(../../../static/01.svg) no-repeat left top;
    background-size: 100%;
    -webkit-animation: speedLabel linear 1s;
    animation: speedLabel linear 1s;
    margin-top: -5px;
    padding: 0 3px;
}

.toolip-box-red {
    background: url(../../../static/02.svg) no-repeat left top;
}

.standard-text {
    display: flex;
    justify-content: space-around;
    color: rgba(255, 255, 255, 0.4);
    font-size: 12px;
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

.standard-box-vaGrade {
    display: inline-block;
    height: 10px;
    width: 60%;
    font-size: 12px;
    padding-left: 2%;
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
</style>

