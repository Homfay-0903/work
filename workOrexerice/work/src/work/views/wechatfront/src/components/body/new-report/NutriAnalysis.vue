<!--
 * @Description:
 * @Author: fanyunbo
 * @Date: 2024-04-16 15:29:37
 * @LastEditTime: 2024-06-14 15:19:52
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @Reference:
-->
<template>
    <div>
        <div class="nut-wrapper">
            <div class="nut-wrapper-top">身体概况</div>
            <div class="nut-wrapper-box">
                <p>
                    当前阶段: <span>{{ this.newData.pregnancy | pregnancyDeal(newData.week) }}</span>
                </p>
                <table style="border-collapse: collapse">
                    <tr>
                        <td>基础代谢</td>
                        <td>{{ newData.BMR }} kcal/d</td>
                    </tr>
                    <tr>
                        <td>BMI</td>
                        <td>{{ newData.BMI }}</td>
                    </tr>
                    <tr>
                        <td>体力活动水平</td>
                        <td>{{ newData.activityLevel | levelHandler }}</td>
                    </tr>
                    <tr>
                        <td>体重分析</td>
                        <td>{{ newData.weightAnalysis | weightHandler }}</td>
                    </tr>
                    <tr>
                        <td>体重增长建议</td>
                        <td>{{ newData.weightAdvice | weightAdviceHandler }}</td>
                    </tr>
                </table>
            </div>
        </div>
        <!-- 营养成分表 -->
        <div class="nut-wrapper1">
            <div class="nut-wrapper-top">每日营养建议</div>
            <div class="nut-wrapper-span" @click="jumpDept">
                常见食物营养表 <img src="@/assets/images/new-report/arrow-down-s-line.svg" alt="" />
            </div>
            <div class="nut-wrapper-box nut-wrapper-box-1">
                <table style="border-collapse: collapse">
                    <tr>
                        <td>基础能量需要</td>
                        <td>{{ newData.energyRequire }} kcal/d</td>
                    </tr>
                    <tr>
                        <td>蛋白质推荐摄入量</td>
                        <td>{{ newData.proteinRequire }} g</td>
                    </tr>
                    <tr>
                        <td>碳水化合物推荐摄入量</td>
                        <td>{{ newData.cRequires }} g</td>
                    </tr>
                    <tr>
                        <td>脂肪推荐摄入量</td>
                        <td>{{ newData.fatRequire }} g</td>
                    </tr>
                </table>
            </div>
        </div>
        <!-- 内容 -->
        <div class="nut-box">
            <p>{{ nutritionalNew[newData.nutritionAnalysis - 1].title }}</p>
            <div v-for="(item, index) in nutritionalNew[newData.nutritionAnalysis - 1].suggest" :key="index">
                <div class="nut-box-title"><img :src="icon[index]" alt="" />{{ item.title }}</div>
                <div v-for="(itemm, ind) in item.sugArray" :key="ind">
                    <!-- :class="itemm.h2 && ind > 1 ? 'suggest':''" -->
                    <h2>{{ itemm.h2 | cRequireHandle(newData.cRequires, newData.questionnaire.otherQuestion) }}</h2>
                    <p class="nut-box-p">
                        {{ itemm.content }}
                    </p>
                    <!-- 基础建议补充 -->
                    <div v-if="index === 0">
                        <p v-for="(itemmm, i) in stitchDataNew[0]" :key="i" class="suggest">
                            <span v-if="newData.questionnaire.otherQuestion.indexOf(i + 1) > 0">{{ itemmm }}</span>
                        </p>
                    </div>
                    <!-- 饮食建议补充 -->
                    <div v-else-if="index === 1">
                        <p v-for="(itemmm, i) in stitchDataNew[ind + 1]" :key="i" class="suggest">
                            <span v-if="newData.questionnaire.otherQuestion.indexOf(i + 1) > 0">{{ itemmm }}</span>
                        </p>
                    </div>
                    <!-- 其他建议补充 -->
                    <div v-else>
                        <p v-for="(itemmm, i) in stitchDataNew[index + 6]" :key="i" class="suggest">
                            <span v-if="newData.questionnaire.otherQuestion.indexOf(i + 1) > 0">{{ itemmm }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getAnalysis } from '@/assets/js/apolloGql.js'
import { nutritional, stitchData, stitchData1, stitchData2 } from '@/assets/js/nutritional.js'
export default {
    filters: {
        levelHandler(key) {
            switch (key) {
                case 1:
                    return '极轻体力活动水平'
                case 2:
                    return '轻体力活动水平'
                case 3:
                    return '中等活动水平'
                case 4:
                    return '高活动水平'
                default:
                    break
            }
        },
        pregnancyDeal(text, week) {
            switch (text) {
                case 1:
                    return '备孕期'
                case 5:
                    return '产后期'
                default:
                    return `孕期${week}周`
            }
        },
        weightHandler(key) {
            switch (key) {
                case 1:
                    return '体重增长正常'
                case 2:
                    return '体重增长偏高'
                case 3:
                    return '体重增长偏低'
                case 4:
                    return '孕早期消瘦'
                case 5:
                    return '体重下降幅度过大'
                case 6:
                    return '体重减少偏低'
                case 7:
                    return '体重减少正常'
                case 8:
                    return '体重恢复较慢'
                case 9:
                    return '产后体重滞留'
                case 10:
                    return '严重体重滞留'
                default:
                    break
            }
        },
        cRequireHandle(text, cRequire, otherQuestion) {
            if (/xg/g.test(text)) return text.replace(/xg/g, (cRequire / 0.7).toFixed(1))
            if (otherQuestion.indexOf(1) > -1) {
                return text.replace(/{(\d+)}/, function (match, p1) {
                    // eslint-disable-next-line radix
                    let num = parseInt(p1) + 500
                    return num.toString()
                })
            } else {
                return text.replace(/{(\d+)}/, function (match, p1) {
                    // eslint-disable-next-line radix
                    let num = parseInt(p1)
                    return num.toString()
                })
            }
        },
        weightAdviceHandler(value) {
            if (value) return value.indexOf('-') > -1 ? '体重增长超标' : value + ' kg'
            return '--'
        },
    },
    props: {
        scanId: String,
    },
    data() {
        return {
            nutritionalNew: nutritional,
            stitchDataNew: '',
            newData: {
                pregnancy: 1,
                BMR: 145,
                activityLevel: 3,
                activityRadio: 45.5,
                BMI: 888,
                weightAnalysis: 1,
                energyRequire: 123,
                fatRequire: 45,
                proteinRequire: 6,
                cRequires: 8,
                week: 32,
                stage: 1,
                nutritionAnalysis: 14,
                weightAdvice: '-5~10',
                questionnaire: {
                    otherQuestion: '[1]',
                },
            },
            icon: [
                require('@/assets/images/new-report/report/base.png'),
                require('@/assets/images/new-report/report/sug.png'),
                require('@/assets/images/new-report/report/jink.png'),
                require('@/assets/images/new-report/report/live.png'),
            ],
        }
    },
    mounted() {
        this.analysis()
    },
    methods: {
        analysis() {
            this.$apollo
                .query({
                    query: getAnalysis,
                    variables: {
                        scanId: this.scanId,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const date = res.data.getAnalysis
                    if (date.code === 200) {
                        this.newData = date.data
                        switch (this.newData.stage) {
                            case 1:
                                this.stitchDataNew = stitchData
                                break
                            case 2:
                                this.stitchDataNew = stitchData1
                                break
                            case 3:
                                this.stitchDataNew = stitchData2
                                break
                            default:
                                break
                        }
                    }
                })
        },
        jumpDept() {
            this.$router.push({ path: '/footDetail' })
        },
    },
}
</script>

<style lang="less" scoped>
.nut-wrapper,
.nut-wrapper1 {
    margin: 15px 11px 0;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400px;
    font-size: 14px;
    color: #222222;
    line-height: 14px;
    text-align: left;
    font-style: normal;
    text-indent: 12px;
    .nut-wrapper-top {
        background: url('../../../assets/images/new-report/report/shape_over_en.png');
        background-size: 100% 100%;
        width: 102px;
        height: 28px;
        line-height: 28px;
    }
    .nut-wrapper-box {
        background: url('../../../assets/images/new-report/report/bj2.jpg');
        height: 199+28px;
        background-size: 100% 100%;
        overflow: hidden;
        border-radius: 4px;
        p {
            margin: 17px 13px 0;
            padding-bottom: 12px;
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
            line-height: 20px;
            text-align: left;
            font-style: normal;
            text-indent: 0;
            span {
                font-size: 14px;
                color: #8aa3be;
                line-height: 12px;
            }
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        table {
            color: #8aa3be;
            // border: 0.5px solid #464D67;
            margin: 8px 12px;
            font-weight: 400;
            font-size: 14px;
            color: #8aa3be;
            line-height: 18px;
            width: 330px;
            tr {
                height: 28px;
                // display: flex;
                // justify-content: space-between;
                text-indent: 37px;
                td {
                    border: 1px solid #464d67;
                }
            }
        }
    }
    .nut-wrapper-box-1 {
        table {
            tr {
                text-indent: 30px;
            }
        }
    }
}
.nut-wrapper1 {
    height: 162px;
    position: relative;
    .nut-wrapper-top {
        width: 140px;
    }
    .nut-wrapper-span {
        position: absolute;
        top: 6px;
        right: 4px;
        background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        line-height: 17px;
        padding: 0 0.01px;  /* 防止文本裁剪异常 */
        img {
            transform: rotate(-90deg);
            width: 10px;
            height: 10px;
        }
    }
    .nut-wrapper-box {
        height: 134px;
        table {
            margin: 12px;
        }
    }
}
.nut-box {
    position: relative;
    font-weight: 400;
    font-size: 14px;
    color: #8aa3be;
    line-height: 18px;
    text-align: left;
    font-style: normal;
    padding: 23px 12px;
    overflow: hidden;
    p {
        margin: 0 14px 8px 14px;
    }
    .suggest {
        margin-bottom: 10px;
    }
    .nut-box-title {
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        line-height: 20px;
        text-align: left;
        font-style: normal;
        padding: 0px 0 10px 13px;
        img {
            display: inline-block;
            position: relative;
            top: 2px;
            margin-right: 9px;
            width: 16px;
            height: 16px;
        }
    }
    h2 {
        margin-left: 14px;
        font-weight: 500;
        font-size: 14px;
        color: #e4efff;
        line-height: 18px;
        text-align: left;
        font-style: normal;
        // margin-top: 10px;
        // &:first-child{
        //     margin-top: 0px;
        // }
    }
    .nut-box-p {
        padding-bottom: 10px;
    }
}
</style>
