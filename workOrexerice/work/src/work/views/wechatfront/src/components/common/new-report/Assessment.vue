<template>
    <div :class="['report-result', $i18n.locale]">
        <div class="result-title" v-if="scoreType === 1">
            <span>{{ $t('mass.title') }}</span>
        </div>
        <div v-else class="shape-title">
            <span>{{ $t('shape.title') }}</span>
        </div>
        <div :class="{'result-wrapper': true,'isDeviceReport': isDeviceReport}">
            <div class="conent-box" v-if="scoreType === 1">
                <div class="con-box">
                    <img src="@/assets/images/new-report/left_icon.png" alt />
                    <div class="mass-score">
                        <p class="score">{{ bodyScore.massScore }}</p>
                        <span class="unit">{{ $t('mass.score') }}</span>
                    </div>
                    <img src="@/assets/images/new-report/right_icon.png" alt />
                </div>
                <div class="cont-box" v-if="bodyScore.massConScore">
                    <span class="cont-box-span">{{ $t('mass.measure.comparedNet') }}</span>
                    <img v-if="trendMassStatus === 0" src="@/assets/images/new-report/icon_just.png" alt />
                    <img v-else-if="trendMassStatus == 1" src="@/assets/images/new-report/icon_rise.png" alt />
                    <img v-else src="@/assets/images/new-report/icon_decline.png" alt />
                    <span
                        :class="trendMassStatus == 0 ? 'cont-box-font' : trendMassStatus == 1 ? 'cont-box-font1' : 'cont-box-font2'"
                    >
                        {{
                        Math.abs(bodyScore.massScore - bodyScore.massConScore) }}
                    </span>
                </div>
            </div>
            <div class="conent-box" v-else>
                <div class="con-box">
                    <img src="@/assets/images/new-report/left_icon.png" alt />
                    <div class="eval-score">
                        <p class="score">{{ bodyScore.evalScore }}</p>
                        <span class="unit">{{ $t('mass.score') }}</span>
                    </div>
                    <img src="@/assets/images/new-report/right_icon.png" alt />
                </div>
                <div class="cont-box" v-if="bodyScore.evalConScore">
                    <span class="cont-box-span">{{ $t('mass.measure.comparedNet') }}</span>
                    <img v-if="trendStatus == 0" src="@/assets/images/new-report/icon_just.png" alt />
                    <img v-else-if="trendStatus == 1" src="@/assets/images/new-report/icon_rise.png" alt />
                    <img v-else src="@/assets/images/new-report/icon_decline.png" alt />
                    <span
                        :class="trendStatus == 0 ? 'cont-box-font' : trendStatus == 1 ? 'cont-box-font1' : 'cont-box-font2'"
                    >
                        {{
                        bodyScore.evalConScore
                        ? Math.abs(bodyScore.evalScore - bodyScore.evalConScore) : 0 }}
                    </span>
                </div>
            </div>
            <div class="last-conclusion">
                <img src="@/assets/images/new-report/report_completion_icon.png" alt />
                <div>
                    <h5>{{ $t('shoulder.conclusion') }}</h5>
                    <p v-if="scoreType === 1">
                        {{ $t('mass.status') }}{{ bodyScore.massLevel.conclusion }}，
                        {{ $t('mass.PBF') }}{{ bodyState.ptType }}，
                        {{ $t('mass.WT') }}{{ bodyState.weightType }}{{ $t('mass.endSymbol') }}
                    </p>
                    <!-- 体态成功显示体态相关结论 -->
                    <p v-if="scoreType === 2" class="bs-conclusion">
                        <span>{{ $t('shape.status') }}{{ bodyScore.evalLevel.conclusion }}</span>
                        <template v-if="problemList.length !== 0">
                            <span>{{ $t('shape.possibility') }}</span>
                            <span v-for="(pro, idx) in problemList" :key="'k_' + idx">
                                {{ idx !== (problemList.length - 1)
                                ? pro + '、' : pro }}
                            </span>
                            <span>{{ $t('mass.endSymbol') }}</span>
                            <!-- 1.12.0版本去掉 -->
                            <!-- <span>的{{ evalLevel.conclusion === '优秀' ? '概率。' : evalLevel.conclusion === '良好' ? '可能性。' : evalLevel.conclusion === '一般' ? '倾向。' : '风险。' }}</span> -->
                        </template>
                        <template v-else>
                            <span>{{ $t('mass.endSymbol') }}</span>
                        </template>
                    </p>
                </div>
            </div>
            <div class="last-suggest">
                <img src="@/assets/images/new-report/report_suggest_icon.png" alt />
                <div>
                    <h5>{{ $t('shape.suggest') }}</h5>
                    <p v-if="scoreType === 1">{{ bodyScore.massLevel.advice }}</p>
                    <!-- 体态成功显示体态相关建议 -->
                    <p v-if="scoreType === 2">{{ modelInfo.mpRecommend == 1 ? bodyScore.evalLevel.advice.replace(/教练/g, '深睡顾问') : bodyScore.evalLevel.advice }}</p>
                </div>
            </div>
            <div v-if="postureMsg" class="last-suggest-tips">
                <!-- <img src="@/assets/images/new-report/tips.svg" alt /> -->
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><title>information-2-fill</title><g fill="#556070"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path></g></svg>
                <div>
                    <!-- 体态成功显示tips -->
                    <p v-if="scoreType === 2">{{ postureMsg }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { findBodyScore, findBodyState, bsEvalInfo, findBsDataStateInfo } from '@/assets/js/apolloGql.js'
import { isVAPro7 } from '@/types/device.js'
import { mapState } from "vuex"
import { postureMsg } from '@/assets/js/config.js'
export default {
    props: {
        scoreType: Number,
        massInfo: Object,
        isStatus: {
            type: [Number, Boolean]
        },
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            bodyScore: {
                evalLevel: { conclusion: '' },
                massLevel: { conclusion: '' },
            },
            massScore: {},
            bodyState: {},
            massLevel: { conclusion: '' },
            evalLevel: { conclusion: '' },
            bodyTypeList: ['虚弱型', '肌肉型', '肥胖型', '健康型'],
            weightTypeList: [this.$t('shape.models.low'), this.$t('shape.models.normal'), this.$t('shape.models.high')],
            ptTypeList: [this.$t('shape.models.low'), this.$t('shape.models.normal'), this.$t('shape.models.high')],
            problemList: [],
            isVAPro7: isVAPro7(),
            bsDataState: {},
            postureMsg,
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },
    computed: {
        ...mapState(["newMathTtData", "isNewMathTt"]),
        trendMassStatus() {
            let number = this.bodyScore.massScore - this.bodyScore.massConScore
            if (number === 0) {
                return 0
            } else if (number > 0) {
                console.log(number)
                return 1
            } else {
                return 2
            }
        },
        trendStatus() {
            let number = this.bodyScore.evalScore ? this.bodyScore.evalScore - this.bodyScore.evalConScore : 0
            if (number === 0) {
                return 0
            } else if (number > 0) {
                console.log(number)
                return 1
            } else {
                return 2
            }
        },
    },
    watch: {
        newMathTtData: {
            handler() {
                this.mathTtData()
            },
            deep: true,
        },
    },
    mounted() {
        // 先注销
        // this.findBsDataStateInfo()
        // 获取身体分数
        this.findBodyScore()
        this.bsEvalInfo()
        this.findBodyState()
        // // bia成功则获取身体状态
        // if (this.modelInfo.biaStatus === 1) {
        //     this.findBodyState()
        // }
        // // 体态成功则获取体态评估数据
        // if (this.modelInfo.evalStatus === 1) {
        //     this.bsEvalInfo()
        // }
    },
    methods: {
        findBsDataStateInfo() {
            this.$apollo
                .query({
                    query: findBsDataStateInfo,
                    variables: {
                        scanId: this.massInfo.scanId,
                    },
                    // fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const data = res.data.findBsDataStateInfo
                    console.log(
                        data,
                        '我看看状态值>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
                    )
                    this.bsDataState = data.data
                    // this.loading = false
                    // console.log( this.bsDataState, "我看看状态值")
                })
        },
        // 获取身体分数数据
        findBodyScore() {
            const that = this
            this.$apollo
                .query({
                    query: findBodyScore,
                    variables: {
                        scanId: this.massInfo.scanId,
                        scanTime: this.modelInfo.createTime,
                        scanType: this.scoreType,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const data = res.data.findBodyScore
                    if (data.code === 200 && data.data !== null) {
                        let scoreInfo = JSON.parse(JSON.stringify(data.data))
                        if (this.scoreType === 1) {
                            scoreInfo.massScore = scoreInfo.massScore ? parseInt(scoreInfo.massScore, 10) : null
                            scoreInfo.massConScore = scoreInfo.massConScore
                                ? parseInt(scoreInfo.massConScore, 10)
                                : null
                        }
                        if (this.scoreType === 2) {
                            scoreInfo.evalScore = scoreInfo.evalScore ? parseInt(scoreInfo.evalScore, 10) : null
                            scoreInfo.evalConScore = scoreInfo.evalConScore
                                ? parseInt(scoreInfo.evalConScore, 10)
                                : null
                        }

                        this.bodyScore = scoreInfo
                    }
                    // 关闭加载动画
                    that.$indicator.close()
                })
        },
        // 获取身体状态
        findBodyState() {
            this.$apollo
                .query({
                    query: findBodyState,
                    variables: {
                        scanId: this.massInfo.scanId,
                    },
                })
                .then((res) => {
                    const data = res.data.findBodyState
                    if (data.code === 200) {
                        const status = data.data
                        const bodyState = {
                            weight: status.WT.v,
                            rate: status.PBF.v,
                            muscle: status.LM.v,
                            bodyType: this.bodyTypeList[status.bodyShare - 1],
                            weightType: this.weightTypeList[status.WT.status - 1],
                            ptType: this.ptTypeList[status.PBF.status - 1],
                        }
                        this.bodyState = bodyState
                    }
                })
        },
        // 体态评估
        bsEvalInfo() {
            this.$apollo
                .query({
                    query: bsEvalInfo,
                    variables: {
                        scanId: this.massInfo.scanId,
                    },
                })
                .then((res) => {
                    const data = res.data.bsEvalInfo
                    if (data.code === 200 && (!this.isVAPro7 && !this.isNewMathTt)) {
                        this.body = data.data
                        if (data.data.headForward > 0) {
                            this.problemList.push(this.$t('shape.item.head'))
                        }
                        if (data.data.headSlant > 0 || data.data.headSlant < 0) {
                            this.problemList.push(this.$t('shape.item.headSlant'))
                        }
                        if (data.data.roundShoulderLeft > 15) {
                            this.problemList.push(this.$t('shape.item.roundShoulderLeft'))
                        }
                        if (data.data.roundShoulderRight > 15) {
                            this.problemList.push(this.$t('shape.item.roundShoulderRight'))
                        }
                        if (data.data.highLowShoudler > 0 || data.data.highLowShoudler < 0) {
                            this.problemList.push(this.$t('shape.item.highLowShoudler'))
                        }
                        if (data.data.pelvisForward > 185) {
                            this.problemList.push(this.$t('shape.exception[4].title'))
                        } else if (data.data.pelvisForward < 175) {
                            this.problemList.push(this.$t('shape.exception[5].title'))
                        }
                        if (data.data.leftKneeCheck > 190) {
                            this.problemList.push(this.$t('shape.exception[6].title'))
                        } else if (data.data.leftKneeCheck < 160) {
                            this.problemList.push(this.$t('shape.exception[7].title'))
                        }
                        if (data.data.rightKneeCheck > 190) {
                            this.problemList.push(this.$t('shape.exception[8].title'))
                        } else if (data.data.rightKneeCheck < 160) {
                            this.problemList.push(this.$t('shape.exception[9].title'))
                        }
                        if (data.data.leftLegXo <= 190 && data.data.leftLegXo >= 170) {
                            if (data.data.rightLegXo >= 0 && data.data.rightLegXo < 170) {
                                this.problemList.push(this.$t('shape.exception[10].title'))
                            } else if (data.data.rightLegXo > 190 && data.data.rightLegXo <= 360) {
                                this.problemList.push(this.$t('shape.exception[11].title'))
                            }
                        } else if (data.data.leftLegXo >= 0 && data.data.leftLegXo < 170) {
                            if (data.data.rightLegXo <= 190 && data.data.rightLegXo >= 170) {
                                this.problemList.push(this.$t('shape.exception[10].title'))
                            } else if (data.data.rightLegXo >= 0 && data.data.rightLegXo < 170) {
                                this.problemList.push(this.$t('shape.exception[12].title'))
                            }
                        } else if (data.data.leftLegXo > 190 && data.data.leftLegXo <= 360) {
                            if (data.data.rightLegXo <= 190 && data.data.rightLegXo >= 170) {
                                this.problemList.push(this.$t('shape.exception[11].title'))
                            } else if (data.data.rightLegXo > 190 && data.data.rightLegXo <= 360) {
                                this.problemList.push(this.$t('shape.exception[13].title'))
                            }
                        }
                        if (data.data.pelvicForwardTiltStatus > 0 && this.isStatus) {
                            if (data.data.pelvicForwardTilt > 15) {
                                this.problemList.push(this.$t('shape.exception[14].title'))
                            } else if (data.data.pelvicForwardTilt < 0) {
                                this.problemList.push(this.$t('shape.exception[15].title'))
                            }
                        }
                        if (data.data.isLegLengthDiff > 0 && this.isStatus) {
                            if (data.data.legLengthDiff > 1) {
                                this.problemList.push('长短腿' + this.$t('shape.exception[16].title'))
                            } else if (data.data.legLengthDiff < -1) {
                                this.problemList.push('长短腿' + this.$t('shape.exception[17].title'))
                            }
                        }
                    } else {
                        this.mathTtData()
                    }
                })
        },
        mathTtData() {
            if (this.isVAPro7 || this.isNewMathTt) {
                this.problemList = []
                console.log('bsDataState', this.newMathTtData)
                if (this.newMathTtData.headForwardState > 0) {
                    this.problemList.push(this.$t('shape.item.head'))
                }
                if (this.newMathTtData.headSlantState > 0) {
                    this.problemList.push(this.$t('shape.item.headSlant'))
                }
                if (this.newMathTtData.leftRoundShoulderState > 0) {
                    this.problemList.push(this.$t('shape.item.roundShoulderLeft'))
                }
                if (this.newMathTtData.rightRoundShoulderState > 0) {
                    this.problemList.push(this.$t('shape.item.roundShoulderRight'))
                }
                if (this.newMathTtData.highLowShoudlerState > 0) {
                    this.problemList.push(this.$t('shape.item.highLowShoudler'))
                }
                if (this.newMathTtData.pelvisForwardState > 0) {
                    this.problemList.push(this.$t('shape.exception[5].title'))
                }

                if (this.newMathTtData.leftKneeCheckState > 0) {
                    switch (this.newMathTtData.leftKneeCheckState) {
                        case 1:
                            this.problemList.push(this.$t('shape.exception[7].title'))
                            break
                        case 2:
                            this.problemList.push(this.$t('shape.exception[6].title'))
                            break
                        case 3:
                            this.problemList.push(this.$t('shape.exception[7].title'))
                            break
                        case 4:
                            this.problemList.push(this.$t('shape.exception[6].title'))
                            break
                        default:
                            break
                    }
                }
                if (this.newMathTtData.rightKneeCheckState > 0) {
                    switch (this.newMathTtData.rightKneeCheckState) {
                        case 1:
                            this.problemList.push(this.$t('shape.exception[9].title'))
                            break
                        case 2:
                            this.problemList.push(this.$t('shape.exception[8].title'))
                            break
                        case 3:
                            this.problemList.push(this.$t('shape.exception[9].title'))
                            break
                        case 4:
                            this.problemList.push(this.$t('shape.exception[8].title'))
                            break
                        default:
                            break
                    }
                }
                if (this.newMathTtData.legType > 0) {
                    switch (this.newMathTtData.legType) {
                        case 1:
                            this.problemList.push(this.$t('shape.item.abnormal'))
                            break
                        case 2:
                            this.problemList.push(this.$t('shape.exception[10].title'))
                            break
                        case 3:
                            this.problemList.push(this.$t('shape.exception[11].title'))
                            break
                        case 4:
                            this.problemList.push(this.$t('shape.exception[12].title'))
                            break
                        case 5:
                            this.problemList.push(this.$t('shape.exception[13].title'))
                            break
                        default:
                            this.problemList.push(
                                `${this.$t('shape.item.leg')}${
                                    ['zh-CN', 'ja-JP', 'zh-TW', 'zh-HK'].indexOf(this.$i18n.locale) > -1 ? '' : ' '
                                }${this.$t('shape.item.keAbnormal')}`
                            )
                            break
                    }
                }
            }
        },
    },
}
</script>

<style lang="less" scoped>
.report-result {
    margin: 15px 15px 0 11px;

    .result-title {
        max-width: 301px;
        width: fit-content;
        min-height: 30px;
        margin-bottom: -2px;
        line-height: 26px;
        color: #222222;
        background: url(../../../assets/images/new-report/report/body_over_en.png) center no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;

        span {
            letter-spacing: 0.1px;
            margin-left: 10px;
            margin-right: 15px;
            font-size: 14px;
            text-align: left;
        }
    }

    .shape-title {
        width: 221px;
        height: 28px;
        margin-bottom: -2px;
        line-height: 26px;
        color: #222222;
        font-family: AppleSystemUIFont;
        background: url(../../../assets/images/new-report/report/shape_over_en.png) center no-repeat;
        background-size: 100% 100%;

        span {
            letter-spacing: 0.2px;
            width: 98px;
            height: 14px;
            margin-left: -25px;
            font-size: 14px;
        }
    }

    .result-wrapper {
        width: 353px;
        background: url(../../../assets/images/new-report/report/bj1.png) center no-repeat;
        background-size: 100% 100%;

        .conent-box {
            flex-direction: column;
        }

        .cont-box {
            margin-top: 7px;
            width: 353px;
            display: flex;
            align-items: center;
            justify-content: center;

            .cont-box-span {
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #8aa3be;
                line-height: 12px;
            }

            img {
                width: 14px;
                height: 14px;
            }

            .cont-box-font {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #1b9edb;
                line-height: 12px;
                letter-spacing: 10;
            }

            .cont-box-font1 {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #29d590;
                line-height: 12px;
            }

            .cont-box-font2 {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #db942c;
                line-height: 12px;
            }
        }

        .con-box {
            width: 353px;
            height: 36px;
            margin-top: 16px;
            display: flex;
            align-items: center;
            justify-content: center;

            // margin-top: 7px;
            // flex-direction: column;
            img {
                width: 44px;
                height: 4px;
            }

            .mass-score {
                display: flex;
                align-items: baseline;
                justify-content: center;
                padding: 0 31px;
            }

            .eval-score {
                display: flex;
                align-items: baseline;
                justify-content: center;
                padding: 0 31px;
            }

            p {
                font-size: 36px;
                background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                padding: 0 0.01px;  /* 防止文本裁剪异常 */
            }

            .unit {
                margin-left: 2px;
                font-size: 12px;
                color: #8aa3be !important;
            }
        }

        .last-conclusion {
            margin: 0 14px;
        }

        .last-suggest, .last-suggest-tips{
            margin: 0 14px;
            padding-bottom: 20px;
        }

        > div {
            display: flex;
            align-items: flex-start;
            padding-bottom: 10px;

            img {
                display: block;
                width: 19px;
                // 禁止部分安卓机下图片自动放大
                pointer-events: none;
            }

            > div {
                color: #fff;
                font-size: 14px;
                padding-left: 9px;

                h5 {
                    font-size: 14px;
                    font-weight: normal;
                    padding-bottom: 2px;
                    text-align: left;
                }

                p {
                    color: #8aa3be;
                    line-height: 1.29;
                    text-align: left;

                    &.bs-conclusion {
                        font-size: 0;

                        span {
                            font-size: 14px;
                        }
                    }
                }
            }
        }
        .last-suggest-tips{
            div{
                p{
                    color: #556070;
                    font-size: 12px;
                }
            }
           svg{
            // margin-left: 5px;
            width: 14px;
            height: 14px;
           }
        }
    }
    .isDeviceReport {
        .last-conclusion, .last-suggest{
            img {
                display: inline-block;
                padding-top: 4px;
            }
            img{
                width: 14px!important;
            }

        }
    }
}

&.ja-JP,
&.zh-CN {
    .result-title {
        font-family: AppleSystemUIFont;
        font-weight: 550;
    }

    .shape-title {
        width: 140px;

        span {
            font-weight: 550;
        }
    }
}

&.es-ES {
    .shape-title {
        width: 300px;

        span {
            font-weight: 550;
        }
    }
}
</style>

