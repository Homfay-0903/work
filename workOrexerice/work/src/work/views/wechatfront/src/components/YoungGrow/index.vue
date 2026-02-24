<template>
    <div class="containerBox">
        <!-- 标准生长曲线定位 -->
        <growthCurve :boxData="boxData"></growthCurve>
        <!-- 生长潜力评分 -->
        <ptentialRate :growth="growthPotential"></ptentialRate>
        <!-- 个性化建议 -->
        <tips :suggestConclusion="suggestConclusion"></tips>
        <appFooter></appFooter>
    </div>
</template>

<script>
// public components
import appFooter from "./foot.vue"

// custom components
import growthCurve from "./growthCurve.vue"
import ptentialRate from "./potentialRate.vue"
import tips from "./tips.vue"
import { getTeenagerReport } from '@/assets/js/apolloGql.js'
export default {
    components: {
        appFooter,
        growthCurve,
        ptentialRate,
        tips
    },
    props: {
        massInfo: {
            type: Object,
            default: null
        },
        scanIdAge: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            // 接口返回数据
            teenagerReportData: {
                age: 0,
            },

            // 生长潜力评分
            growthPotential: {
                //  "父身高"
                fatherHeight: 0,
                // "母身高"
                motherHeight: 0,
                // "遗传得分"
                getGeneticScore: 0,
                // "生长速率得分"
                growthRateRatioScore: 0,
                // "体态影响得分"
                evalScore: 0,
                // "指数发育得分"
                BMIScore: 0,
                // "遗传空间"
                geneticSpace: 0,
                // "遗传目标"
                targetHeight: 0,
                // "生长潜力总分"
                totalScore: 0,
                // "性别"
                sex: 1,
            },
            // 建议
            suggestConclusion: {
                suggestion: '暂无建议',
                personalizedRec: '暂无建议',
                personExerciseRec: '暂无建议',
            }
        }
    },
    computed: {
        boxData() {
            return {
                BMI: this.teenagerReportData.BMI,
                // 体重
                weight: this.teenagerReportData.weightKg,
                // 身高
                height: this.teenagerReportData.height,
                age: this.scanIdAge,
                sex: this.teenagerReportData.sex
            }
        },
    },
    watch: {
        reportInfo(newVal) {
            if (newVal.scanId) {
                // 获取目标scanId脊柱专项结论
                this.getTeenagerReport()
            }
        },
    },
    created() {
        console.clear()
        console.log('青少年专项加载完成')
        this.getTeenagerReport()
    },
    methods: {
        // 获取脊柱专项结论
        async getTeenagerReport() {
            // 处理数据的逻辑
            const resd = await this.$apollo
                .query({
                    query: getTeenagerReport,
                    variables: {
                        scanId: this.massInfo.scanId,
                    },
                    fetchPolicy: 'network-only',
                })
            this.teenagerReportData = {
                ...resd.data.getTeenagerReport.data
            }
            console.log('AAAAAAAAAAAAAAAAAA', this.teenagerReportData)
            this.growthPotential = { ...this.teenagerReportData.growthPotential, sex: this.teenagerReportData.sex }
            this.conclusionLeval = this.teenagerReportData.conclusionLeval
            this.suggestConclusion = { ...this.teenagerReportData.suggestConclusion }
        },
    }
}
</script>

<style scoped lang="less">
.containerBox {
    background: #0B0D21;
    min-height: 100vh;
    padding-bottom: 60px;
}

:deep(.van-tab) {
    color: #8AA3BE;
    /* 默认颜色 */
}

:deep(.van-tab) {
    background: #0B0D21;
}

:deep(.van-tabs__line) {
    background: linear-gradient(to right, #00E3C9 0%, #009FE8 100%) !important;
}

:deep(.van-tabs__wrap) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.gradient-text {
    background: linear-gradient(to right, #00E3C9, #009FE8);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 12px;
}

.emptybox {
    height: 80px;
}
</style>