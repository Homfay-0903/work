<template>
    <div class="containerBox">
        <!-- 标准生长曲线定位 -->
        <echartsbox :boxData="boxData" />
        <!-- 生长潜力 -->
        <potentialScore :growth="growthPotential" />
        <!-- 未来一年 -->
        <nextYear :suggestConclusion="suggestConclusion" />
    </div>
</template>

<script>
import echartsbox from '@/components/youngSpecialReport/echartsbox.vue'
import potentialScore from '@/components/youngSpecialReport/potentialScore'
import nextYear from '@/components/youngSpecialReport/nextYear'
import { getTeenagerReport } from '@/assets/js/apolloGql.js'
export default {
    components: {
        echartsbox,
        potentialScore,
        nextYear
    },
    props: {
        // 报告信息 scanId、scanMode等记录信息
        reportInfo: {
            type: Object,
            default: null
        },
        // 记忆信息 性别、年龄、身高、体重等
        memberInfo: {
            type: Object,
            default: null
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
                sex: 0,
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
                age: this.teenagerReportData.age,
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
    mounted() {
        // 页面加载完成后可以执行一些初始化操作
        console.log('青少年成长发育专项报告加载完成')
        if (this.reportInfo.scanId) {
            this.getTeenagerReport()
        }
    },
    methods: {
        // 获取脊柱专项结论
        async getTeenagerReport() {
            // 处理数据的逻辑
            const resd = await this.$apollo
                .query({
                    query: getTeenagerReport,
                    variables: {
                        scanId: this.reportInfo.scanId
                    }
                }).catch(e => {
                })
            this.teenagerReportData = {
                ...resd.data.getTeenagerReport.data
            }
            console.log('AAAAAAAAAAAAAAAAAA', this.teenagerReportData)
            this.growthPotential = { ...this.teenagerReportData.growthPotential, sex: this.teenagerReportData.sex }
            this.suggestConclusion = { ...this.teenagerReportData.suggestConclusion }
        },
    }
}
</script>

<style scoped lang="less">
.containerBox {
    font-family: OPPOSans M !important;

    width: 100%;
    height: 100%;
    box-sizing: border-box;

    /deep/ p {
        margin: 0;
    }

    /deep/ i {
        line-height: 30px;
    }
    // /deep/ * {
    // font-family: OPPOSans M !important;
    // }
}
</style>