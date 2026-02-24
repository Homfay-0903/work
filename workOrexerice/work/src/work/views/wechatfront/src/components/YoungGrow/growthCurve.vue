<template>
    <div class="cardBox">
        <div class="cardTitle">标准生长曲线定位</div>
        <div class="itembox">
            <div class="scorebg"></div>
            <div class="item">
                <p>身高</p>
                <p>
                    <span :style="{ color: '#FA4552' }">{{ boxData.height }}</span> cm
                </p>
            </div>
            <div class="item">
                <p>百分位</p>
                <p>P{{ hP }}</p>
            </div>
            <div class="item itemCard">
                {{ hPMessage }}
            </div>
        </div>
        <div class="itembox">
            <div class="scorebg"></div>
            <div class="item">
                <p>体重</p>
                <p>
                    <span :style="{ color: '#0180FE' }">{{ boxData.weight }}</span> kg
                </p>
            </div>
            <div class="item">
                <p>百分位</p>
                <p>P{{ wP }}</p>
            </div>
            <div class="item itemCard">
                {{ wPMessage }}
            </div>
        </div>
        <!-- 图表1 -->
        <div class="chartBox">
            <growth :userInfo="whData" />
        </div>

        <div class="splitLine">
            <div class="line"></div>
            <img src="../../assets/image/spine/refrech.png" alt="">
            <div class="line"></div>
        </div>
        <div class="itembox">
            <div class="scorebg"></div>
            <div class="item w72">
                <p>BMI</p>
                <p>
                    <span :style="{ color: '#E6B12A' }">{{ boxData.BMI.toFixed(1) }}</span> kg/㎡
                </p>
            </div>
            <div class="item">
                <p>百分位</p>
                <p>P{{ BmiP }}</p>
            </div>
            <div class="item itemCard">
                {{ BmiPMessage }}
            </div>
        </div>
        <!-- BMI标准生长曲线 -->
        <div class="growthCure">
            <GrowthCurveView :GrowthCurveViewData="GrowthCurveViewData" />
        </div>
        <div class="tipsbox">
            <span>!</span>
            <p>生长百分位仅反映群体中位置，个体差异正常存在。如对生长发育有疑问，建议结合骨龄检测、专业医生评估综合判断。数据来源:2005年九省/市儿童体格发育调查。</p>
        </div>
    </div>
</template>

<script>
import GrowthCurveView from "./growCureView.vue"
import growth from "./growth.vue"
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
        GrowthCurveView,
        growth
    },
    props: {
        boxData: {
            type: Object,
            default: () => ({
                BMI: 0,
                // 体重
                weight: 55,
                // 身高
                height: 170,
                age: 17,
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
        },
        // BMI曲线数据
        GrowthCurveViewData() {
            return {
                BMI: this.boxData.BMI,
                age: this.boxData.age,
            }
        },
        // 身高体重曲线数据
        whData() {
            return {
                birthday: '1514736000', // 时间戳
                height: this.boxData.height, // 身高
                weight: this.boxData.weight, // 体重
                sex: this.boxData.sex, // 1: 男, 2: 女
                age: this.boxData.age,
            }
        }
    }
}
</script>

<style lang="less" scoped>
.cardBox {
    margin: 17px auto 24px;
    width: 350px;
    // height: 1348px;
    padding-bottom: 3px;
    background: #192141 url(../../assets/image/spine/bg2.png) no-repeat;
    background-size: 100% auto;
    border-radius: 6px 6px 6px 6px;
    border: 1px solid #63A5C1;
    position: relative;

    .cardTitle {
        font-weight: 500;
        font-size: 16px;
        color: #FFFFFF;
        text-align: center;
        background: url(../../assets/image/spine/titlebg.png) 0 0;
        background-size: 100% 100%;
        width: 100%;
        height: 44px;
        line-height: 44px;
        margin-bottom: 21px;
    }

    .itembox {
        width: 325px;
        height: 82px;
        border-radius: 6px 6px 6px 6px;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 15px 9px 15px 16px;
        margin: 0 auto 10px;
        position: relative;
        overflow: hidden;

        .scorebg {
            position: absolute;
            left: 0;
            top: 0;
            width: 325px;
            height: 82px;
            background: linear-gradient(90deg, #C05AE4 0%, #016FFF 100%);
            filter: blur(65px);
        }

        .item {
            width: 54px;
            height: 52px;
            text-align: center;
            font-weight: 500;
            font-size: 14px;
            color: #FFFFFF;
            display: flex;
            flex-direction: column;
            z-index: 5;
            white-space: nowrap;

            p {
                line-height: 20px;

                &:first-child {
                    margin-bottom: 11px;
                }

                span {
                    font-size: 18px;
                    font-weight: bold;
                }
            }

        }

        .w72 {
            width: 72px;
        }

        .itemCard {
            width: 143px;
            height: 52px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px 6px 6px 6px;
            padding: 8px 6px;
            font-size: 12px;
            font-weight: 400;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: normal;
        }
    }

    .chartBox {
        width: 330px;
        height: 468px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 6px 6px 6px 6px;
        margin: 0 auto;
    }

    .splitLine {
        display: flex;
        width: 330px;
        height: 14px;
        justify-content: space-between;
        align-items: center;
        margin: 10px auto;

        img {
            width: 19px;
            height: 14px;
        }

        .line {
            width: 145px;
            height: 0px;
            border-top: 1px dashed #8A90A2;
        }
    }

    .growthCure {
        width: 330px;
        height: 417px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 6px 6px 6px 6px;
        margin: 0 auto;
    }

    .tipsbox {
        width: 330px;
        background: #364869;
        border-radius: 6px 6px 6px 6px;
        display: flex;
        margin: 10px auto;
        padding: 10px 17px 10px 11px;
        box-sizing: border-box;
        text-align: left;

        span {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1px solid #8AA3BE;
            line-height: 17px;
            text-align: left;
            color: #8AA3BE;
            font-size: 12px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        p {
            width: calc(100% - 16px);
            font-weight: 400;
            font-size: 12px;
            color: #FFFFFF;
        }
    }
}
</style>