<template>
    <div class="content1">
        <p class="title"><span>标准生长曲线定位</span><span>生长百分位仅反映群体中位置，个体差异正常存在。如对生长发育有疑问，建议结合骨龄检测、专业医生评估综合判断。数据来源:2005年九省/市儿童体格发育调查。</span></p>
        <div class="chartbox">
            <div class="chart">
                <growthHeightWeight :userInfo="boxData"/>
            </div>
            <div class="lineC"></div>
            <div class="chart">
                <growCureView :boxData="boxData"/>
            </div>
        </div>
        <div class="chartInfoBox">
            <div class="chartInfo">
                <div class="chartInfoTitle">
                    <p class="chartInfoTxt">身高：<span class="redcolor">{{ boxData.height }}</span> <i>cm</i> 百分位：<span>P{{
                        hP }}</span></p>
                    <p class="chartTips">{{ hPMessage }}</p>
                </div>
                <div class="chartInfoContent">
                    <p class="chartInfoTxt">体重：<span class="bluecolor">{{ boxData.weight }}</span> <i>kg</i>
                        百分位：<span>P{{ wP }}</span></p>
                    <p class="chartTips">{{ wPMessage }}</p>
                </div>
            </div>
            <div class="lineC"></div>
            <div class="chartInfo noflex">
                <p class="chartInfoTxt">BMI：<span class="yellocolor">{{ boxData.BMI.toFixed(1) }}</span> <i>kg/㎡</i> 百分位：<span>P{{
                    BmiP }}</span></p>
                <p class="chartTips">{{ BmiPMessage }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import growCureView from './growCureView.vue'
import growthHeightWeight from './growthHeightWeight.vue'
import { MakeHeightWeightP, MakeBMIP } from './config/baseData'
const pHeightWeight = [3, 10, 90]
const pHeightWeightMessage = [
    '明显低于同龄儿童，应关注生长发育',
    '低于平均值，需要持续跟踪',
    '处于正常范围，建议继续保持',
    '高于平均水平，关注是否早熟或其他因素'
]
const pBMI = [5, 85, 95]
const pBMIMessage = [
    '明显低于同龄儿童，建议及时就医评估生长发育状况并制定营养改善计划',
    '处于正常范围，建议继续保持',
    '略超标准，建议调整饮食结构并增加体育活动',
    '严重超出正常范围，建议在医生指导下进行体重管理和生活方式调整'
]
export default {
    components: {
        growthHeightWeight,
        growCureView
    },
    props: {
        boxData: {
            type: Object,
            default: () => ({
                BMI: 0,
                // 体重
                weight: 50,
                // 身高
                height: 160,
                age: 15,
                sex: 1,
            })
        }
    },
    data() {
        return {

        }
    },
    computed: {
        hP() {
            return MakeHeightWeightP(this.boxData.age, this.boxData.sex, this.boxData.height, this.boxData.weight)[0]
        },
        hPMessage() {
            if (this.hP < pHeightWeight[0]) {
                return pHeightWeightMessage[0]
            } else if (this.hP >= pHeightWeight[0] && this.hP < pHeightWeight[1]) {
                return pHeightWeightMessage[1]
            } else if (this.hP >= pHeightWeight[1] && this.hP < pHeightWeight[2]) {
                return pHeightWeightMessage[2]
            } else if (this.hP >= pHeightWeight[2]) {
                return pHeightWeightMessage[3]
            }
        },
        wP() {
            return MakeHeightWeightP(this.boxData.age, this.boxData.sex, this.boxData.height, this.boxData.weight)[1]
        },
        wPMessage() {
            if (this.wP < pHeightWeight[0]) {
                return pHeightWeightMessage[0]
            } else if (this.wP >= pHeightWeight[0] && this.wP < pHeightWeight[1]) {
                return pHeightWeightMessage[1]
            } else if (this.wP >= pHeightWeight[1] && this.wP < pHeightWeight[2]) {
                return pHeightWeightMessage[2]
            } else if (this.wP >= pHeightWeight[2]) {
                return pHeightWeightMessage[3]
            }
        },
        BmiP() {
            return MakeBMIP(this.boxData.age, this.boxData.sex, this.boxData.BMI)
        },
        BmiPMessage() {
            if (this.BmiP < pBMI[0]) {
                return pBMIMessage[0]
            } else if (this.BmiP >= pBMI[0] && this.BmiP < pBMI[1]) {
                return pBMIMessage[1]
            } else if (this.BmiP >= pBMI[1] && this.BmiP < pBMI[2]) {
                return pBMIMessage[2]
            } else if (this.BmiP >= pBMI[2]) {
                return pBMIMessage[3]
            }
        }
    }
}
</script>

<style lang="less" scoped>
.content1 {

    .redcolor {
        color: #C32613;
    }

    .bluecolor {
        color: #5698F5;
    }

    .yellocolor {
        color: #E6B12A;
    }

    .noflex {
        display: block !important;
    }

    i {
        font-style: normal;
    }

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 24px auto 8px;
        line-height: 1;

        span {
            font-weight: 400;
            font-size: 24px;
            color: #333333;

            &:last-child {
                position: relative;
                font-weight: 400;
                font-size: 12px;
                color: #666666;
                width: 447px;
                line-height: 18px;

                &::before {
                    position: absolute;
                    content: '*';
                    left: -8px;
                }
            }
        }
    }

    .chartbox {
        width: 863px;
        height: 307px;
        border: 1px solid #009FE8;
        margin: 0 auto;
        display: flex;

        .chart {
            flex: 1;
            width: 431px;

            &:first-child {
                // border-right: 1px solid #009FE8;
            }
        }
    }

    .chartInfoBox {
        width: 863px;
        height: 82px;
        border: 1px solid #009FE8;
        border-top: none;
        margin: 0 auto;
        display: flex;

        .chartInfo {
            flex: 1;
            display: flex;
            width: 431px;

            .chartInfoContent {
                flex: 1;

                &:nth-child(2) {
                    border-left: 1px solid #CED7E0;
                }
            }

            &:first-child {
                // border-right: 1px solid #009FE8;
            }

            .chartInfoTxt {
                height: 34px;
                background: #F2F8FF;
                text-align: center;
                line-height: 34px;
                font-weight: 400;
                font-size: 15px;
                color: #333333;

                span {
                    // font-weight: bold;
                    margin-left: 3px;
                    &:last-child{
                        color: #666;
                    }
                }

                i {
                    font-size: 12px;
                    color: #666666;
                    margin-right: 12px;
                }
            }

            .chartTips {
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 400;
                font-size: 12px;
                color: #666666;
                height: 48px;
                text-align: center;
                padding: 0 3px;
            }
        }
    }
}

.lineC {
    position: relative;
    flex-shrink: 0;
    width: 1px;
    height: 100%;
    background-color: #009FE8;
}
.chartInfoTitle{
    position: relative;
                flex: 1;
}
</style>