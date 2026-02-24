<!--
 * @Author: wang Don lc819781590@gmail.com
 * @Date: 2024-04-19 11:07:05
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @LastEditTime: 2024-04-19 19:56:50
 * @FilePath: \vr-pro3-report-frontend\src\pages\report\nutrition-report.vue
 * @Description:
-->
<template>
    <div class="nutrition-report" v-cloak>
        <div class="right-part">
            <h2>身体概况</h2>
            <box-table :contentList="bodyInfo" :title="this.newData.pregnancy | pregnancyDeal(newData.week)"/>
            <h2>每日营养建议</h2>
            <box-table :contentList1="advices"/>
            <h2>饮食建议</h2>
            <diet-table :diets="diets"/>
        </div>
        <div class="left-part">
            <div class="top-title">
                <h2>常见食物营养表</h2>
                <span class="right-tips">(每100g)</span>
            </div>
            <nutrition-table title="叶酸含量" :contents="folicAcid"/>
            <nutrition-table style="margin-top: 21px;" title="钙含量" :contents="calciums"/>
            <nutrition-table style="margin-top: 21px;" title="铁含量" :contents="irons"/>
            <report-footer style="margin-top: 25px;" :scanId="reportInfo.scanId" tips="扫码查看详细营养分析报告"></report-footer>
        </div>
    </div>
</template>
<script>
import boxTable from '@/components/box-table.vue'
import dietTable from '@/components/diet-table.vue'
import nutritionTable from '@/components/nutrition-table.vue'
import { getAnalysis } from '@/assets/js/apolloGql.js'
import { NutritionConfig, footContent } from '@/assets/js/nutrition-config.js'
import ReportFooter from '@/components/Footer'
export default {
    name: 'NutritionReport',
    filters: {
        pregnancyDeal(text, week) {
            switch (text) {
                case 1:
                    return '备孕期'
                case 5:
                    return '产后期'
                default:
                    return `孕期${week}周`
            }

        }

    },
    components: {
        boxTable,
        dietTable,
        nutritionTable,
        ReportFooter
    },
    props: {
        reportInfo: Object,
        memberInfo: Object
    },
    data() {
        return {
            bodyInfo: [],
            advices: [],
            diets: [],
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
                    otherQuestion: '[1]'
                }
            },
            folicAcid: footContent[0],
            calciums: footContent[1],
            irons: footContent[2],
            nutritionContentConfig: NutritionConfig
        }
    },
    created() {
        this.analysis()
    },
    methods: {
        analysis() {
            this.$apollo
                .query({
                    query: getAnalysis,
                    variables: {
                        scanId: this.reportInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const date = res.data.getAnalysis
                    if (date.code === 200) {
                        this.newData = date.data
                        this.showBodyInfo()
                        this.adviceConfig()
                        this.showFootAdvice()
                    }

                })
        },
        showBodyInfo() {
            this.bodyInfo.push({
                title: '基础代谢',
                value: `${this.newData.BMR} kcal/d`
            })
            this.bodyInfo.push({
                title: 'BMI',
                value: `${this.newData.BMI}`
            })
            this.bodyInfo.push({
                title: '体力活动水平',
                value: `${this.nutritionContentConfig.levelHandler[this.newData.activityLevel - 1]}`
            })
            this.bodyInfo.push({
                title: '体重分析',
                value: `${this.nutritionContentConfig.weightHandler[this.newData.weightAnalysis - 1]}`
            })
            this.bodyInfo.push({
                title: '体重增长建议',
                value: `${this.weightAdviceHandler(this.newData.weightAdvice)}`
            })
        },
        adviceConfig() {
            this.advices.push({
                title: '基础能量需要',
                value: `${this.newData.energyRequire} kcal/d`
            })
            this.advices.push({
                title: '蛋白质推荐摄入量',
                value: `${this.newData.proteinRequire} g`
            })
            this.advices.push({
                title: '碳水化合物推荐摄入量',
                value: `${this.newData.cRequires} g`
            })
            this.advices.push({
                title: '脂肪推荐摄入量',
                value: `${this.newData.fatRequire} g`
            })
        },
        weightAdviceHandler(value) {
            if (value === '') {
                return '--'
            } else {
                return value.indexOf('-') > -1 ? '体重增长超标' : value + ' kg'

            }
        },
        async showFootAdvice() {
            let diets = this.nutritionContentConfig.footAdvice[this.newData.nutritionAnalysis - 1]
            await diets.forEach((item, index) => {
                if (index === 0) {
                    // 主食
                    item.detail = item.detail.replace('xg', (this.newData.cRequires / 0.7).toFixed(1))
                }
                if (index === 6) {
                    if (this.newData.questionnaire.otherQuestion.indexOf(1) > -1) {
                        item.detail = item.detail.replace(/{(\d+)}/, function (match, p1) {
                            // eslint-disable-next-line radix
                            let num = parseInt(p1) + 500
                            return num.toString()
                        })
                    } else {
                        item.detail = item.detail.replace(/{(\d+)}/, function (match, p1) {
                            // eslint-disable-next-line radix
                            let num = parseInt(p1)
                            return num.toString()
                        })
                    }
                }
                // const stitch = this.nutritionContentConfig.stitchData[index]
                // const content = []
                // for (let i = 0; i < stitch.length; i++) {
                //     if (this.newData.questionnaire.otherQuestion.indexOf(i + 1) > 0) {
                //         content.push(stitch[i])
                //     }
                // }
                item.content = `${item.content}`
            })
            this.diets = diets
        }

    }
}
</script>
<style scoped lang="less" media="all">
[v-cloak] {
    display: none;
}
.nutrition-report {
    position: relative;
    display: flex;
    width: 100%;
    justify-content: space-between;
    .right-part {
        width: 565px;
        h2 {
            font-family: OPPOSans, OPPOSans;
            font-weight: normal;
            font-size: 24px;
            color: #333333;
            line-height: 10px;
            text-align: left;
            font-style: normal;
        }
    }
    .left-part {
        width: 267px;
        height: 100%;
        .top-title{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: first baseline;
            width: 100%;
            h2 {
                font-family: OPPOSans, OPPOSans;
                font-weight: normal;
                font-size: 24px;
                color: #333333;
                line-height: 10px;
                text-align: left;
                font-style: normal;
             }
             .right-tips {
                font-family: OPPOSans, OPPOSans;
                font-weight: normal;
                font-size: 16px;
                color: #666666;
                line-height: 18px;
                text-align: left;
                font-style: normal;
             }
        }
    }
}
</style>
