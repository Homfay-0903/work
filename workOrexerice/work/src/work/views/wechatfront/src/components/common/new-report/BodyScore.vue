<template>
    <div :class="['report-result', $i18n.locale]">
        <div class="result-wrapper" v-if="bodyScore.massScore && bodyScore.massScore > 0">
            <div class="conent-box">
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
        </div>
    </div>
</template>
<script>
import { findBodyScore } from '@/assets/js/apolloGql.js'
export default {
    props: {
        scoreType: Number,
        massInfo: Object,
        isStatus: Boolean,
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
        }
    },
    computed: {
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
    mounted() {
        // 获取身体分数
        this.findBodyScore()
    },
    methods: {
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
                    console.log('=================')
                    console.log(data)
                    console.log('=================')
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

    },
}
</script>

<style lang="less" scoped>
.report-result {
    margin: 5px 15px 0 11px;
    .result-wrapper {
        width: 353px;
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

        .last-suggest {
            margin: 0 14px;
            padding-bottom: 20px;
        }

        > div {
            display: flex;
            align-items: flex-start;
            padding-bottom: 1px;

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
    }
}
</style>

