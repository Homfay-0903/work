<template>
    <div :class="['report-result', $i18n.locale]">
        <div :class="{'result-wrapper': true,'isDeviceReport': isDeviceReport}">
            <div class="last-conclusion">
                <img src="@/assets/images/new-report/report_completion_icon.png" alt />
                <div>
                    <h5>风险提示</h5>
                    <p>{{ tishi }}</p>
                </div>
            </div>
            <div class="last-suggest">
                <img src="@/assets/images/new-report/report_suggest_icon.png" alt />
                <div>
                    <h5>结果建议</h5>
                    <p>{{ jianyi }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        obj: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            tishi: '',
            jianyi: '',
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },
    watch: {
        obj: {
            handler(newVal, oldVal) {
                this.waistassessment()
            }
        }
    },
    mounted() {
        this.waistassessment()
    },
    methods: {
        waistassessment() {
            console.log(this.obj)
            if ((this.obj.value < 0.85 && this.obj.gender === 1) || (this.obj.value < 0.75 && this.obj.gender === 2)) {
                this.tishi = '腰臀比低于正常范围，可能存在营养不良或其他疾病风险。'
                this.jianyi = '建议进行物理塑形干预1~2个疗程以上，促进胶原蛋白再生，恢复肌肤弹性。同时增加优质蛋白质和健康脂肪的摄入，并结合力量训练和有氧运动。'
            } else if ((this.obj.value >= 0.85 && this.obj.gender === 1 && this.obj.value <= 0.9) || (this.obj.value >= 0.75 && this.obj.gender === 2 && this.obj.value <= 0.8)) {
                this.tishi = '腰臀比在正常范围，健康风险较低。'
                this.jianyi = '建议进行周期性物理塑性干预以更好地保持身材，同时维持健康饮食，定期锻炼。'
            } else {
                this.tishi = '腰臀比超过正常范围，健康风险较高。'
                this.jianyi = '建议进行较长周期疗程的物理塑形干预，塑形紧致身材，再生胶原蛋白。减少高热量食物，增加膳食纤维，并加强有氧运动和核心训练。'
            }
        }
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
        padding-top: 10px;
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
            }

            .unit {
                margin-left: 2px;
                font-size: 12px;
                color: #8aa3be !important;
            }
        }

        .last-conclusion {
            margin: 10px 14px;
        }

        .last-suggest {
            margin: 0 14px;
            padding-bottom: 20px;
        }

        >div {
            display: flex;
            align-items: flex-start;
            padding-bottom: 10px;

            img {
                display: block;
                width: 19px;
                // 禁止部分安卓机下图片自动放大
                pointer-events: none;
            }

            >div {
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
    .isDeviceReport {
        img {
            display: inline-block;
            padding-top: 3px;
            width: 14px!important;
        }
        .last-conclusion {
            img{
                width: 14px!important;
            }
        }

    }
}
</style>
