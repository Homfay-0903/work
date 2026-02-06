<template>
    <div class="print" v-cloak>

        <!-- 解读报告 -->
        <div class="page">
            <report-header :reportInfo="reportInfo" :memberInfo="memberInfo" :type="1" />
            <report-interpret :data="reportInfo.interpretInfo" :showInterpretList="true" :showBsAbnormalItemList="reportInfo.interpretInfo.interpretList.length === 1" />
            <pagination></pagination>
        </div>
        <div v-if="showBsAbnormalItem" class="page">
            <report-header :reportInfo="reportInfo" :memberInfo="memberInfo" :type="1" />
            <report-interpret :data="reportInfo.interpretInfo" :showInterpretList="false" :showBsAbnormalItemList="true" />
            <pagination :num="2"></pagination>
        </div>
        <!-- 运动建议 -->
        <div class="page">
            <report-header :reportInfo="reportInfo" :memberInfo="memberInfo" :type="2" />
            <exercise-advice :data="reportInfo.exerciseAdviceInfo" :showTips="!reportInfo.dietAdviceInfo" />
            <pagination :num="showBsAbnormalItem ? 3 : 2"></pagination>
        </div>
        <!-- 营养建议 -->
        <div class="page">
            <report-header :reportInfo="reportInfo" :memberInfo="memberInfo" :type="3" />
            <diet-advice :data="reportInfo.dietAdviceInfo" />
            <pagination :num="showBsAbnormalItem ? 4 : 3"></pagination>
        </div>
    </div>
</template>

<script>
import ReportHeader from './components/Header'
import Pagination from './components/Pagination'
import ReportInterpret from './components/reportInterpret'
import ExerciseAdvice from './components/exerciseAdvice.vue'
import DietAdvice from './components/dietAdvice.vue'
import http from '@/assets/js/http.js'
import { formatDateTime } from '@/assets/js/util.js'
import { getMemberInfo } from '@/assets/js/apolloGql.js'
export default {
    name: 'assistant',
    components: {
        ReportHeader,
        Pagination,
        ReportInterpret,
        ExerciseAdvice,
        DietAdvice
    },
    data() {
        return {
            scanId: '',
            reportInfo: {
                createTime: '2023-06-01 12:30:59',
                interpretInfo: {},
                exerciseAdviceInfo: {},
                dietAdviceInfo: {}
            },
            memberInfo: {},
        }
    },
    computed: {
        showBsAbnormalItem() {
            return this.reportInfo.interpretInfo.interpretList.length === 4
        }
    },
    created() {
        // 获取报告数据
        this.paraMeter()
    },
    methods: {
        paraMeter() {
            const url = window.location.search.split('?')[1].split('&')
            let pointInfo = {}
            url.forEach(el => {
                let key = el.split('=')[0]
                let val = el.substring(el.indexOf('=') + 1)
                pointInfo[key] = val
            })
            if (pointInfo['scanId']) {
                const scanId = pointInfo['scanId']
                this.scanId = scanId
                this.getMemberInfo()
                this.getReportInfo(scanId)
            } else {
                this.errorMsg = '参数无效'
            }
        },
        // 请求报告数据
        async getReportInfo(scanId) {
            const reportData = await http.get(`/assistant/ai-report/${scanId}`)
            // 组合报告数据
            const bm = JSON.parse(reportData.data.interpret.bm || null) || null
            const bs = JSON.parse(reportData.data.interpret.bs || null) || null
            const interpretList = []
            const bsAbnormalItemList = []
            const interpretQuestions = []
            if (bm) {
                const bmInterpret = [
                    {
                        name: '体型分析',
                        interpret: bm.bodyTypeAnalysis.replace(/\n\n/g, '\n')
                    },
                    {
                        name: '基础代谢分析',
                        interpret: bm.bmiAnalysis.replace(/\n\n/g, '\n')
                    },
                    {
                        name: '水分分析',
                        interpret: bm.tbwAnalysis.replace(/\n\n/g, '\n')
                    }
                ]
                interpretList.push(...bmInterpret)
                interpretQuestions.push(...bm.questions)
            }

            if (bs) {
                interpretList.push({
                    name: '体态综述',
                    interpret: bs.summary
                })
                bsAbnormalItemList.push(...bs.abnormalsAnalysis)
                interpretQuestions.push(...bs.questions)
            }

            // 运动建议类数据
            const exerciseAdviceData = JSON.parse(reportData.data.advice.exercise)
            // 运动建议咨询类问题
            const exerciseAdviceQuestions = exerciseAdviceData.questions || []
            // 运动建议改进类问题
            const exerciseAdviceSuggestions = exerciseAdviceData.suggestions || []
            // 运动建议form改进类问题
            const exerciseAdviceFormSuggestions = exerciseAdviceData.formSuggestions || []

            const exerciseTableData = {
                aerobics: [],
                strength: [],
                trainingIntensity: [],
                trainingVolume: [],
            }

            const exerciseFormJson = JSON.parse(exerciseAdviceData.form || null)
            const adaptationStageJson = exerciseFormJson['适应阶段']
            const promotionStageJson = exerciseFormJson['提升阶段']
            let consolidationStageJson = exerciseFormJson['巩固阶段']
            if (consolidationStageJson.length > 3) consolidationStageJson = consolidationStageJson.slice(0, 3)

            const stageJson = [...adaptationStageJson, ...promotionStageJson, ...consolidationStageJson]
            for (let index = 0; index < stageJson.length; index++) {
                const weekData = stageJson[index]
                const aerobics = weekData['有氧']
                exerciseTableData.aerobics.push(aerobics)
                const strength = weekData['力量']
                exerciseTableData.strength.push(strength)
                const load = weekData['负荷']
                const trainingIntensity = load['强度']
                exerciseTableData.trainingIntensity.push(trainingIntensity > 5 ? 5 : trainingIntensity)
                const trainingVolume = load['训练量']
                exerciseTableData.trainingVolume.push(trainingVolume > 5 ? 5 : trainingVolume)
            }

            const exerciseAdviceInfo = {
                text: exerciseAdviceData.text,
                tableData: exerciseTableData,
            }

            console.log('运动建议数据', exerciseAdviceInfo)

            // 营养建议类数据
            const dietAdviceData = JSON.parse(reportData.data.advice.diet || 'null')
            // 营养建议咨询类问题
            const dietAdviceQuestions = dietAdviceData ? dietAdviceData.questions : []
            // 营养建议改进类问题
            const dietAdviceSuggestions = dietAdviceData ? dietAdviceData.suggestions : []
            // 营养建议form改进类问题
            const dietAdviceFormSuggestions = dietAdviceData ? dietAdviceData.formSuggestions : []

            const dietTableData = {
                breakfastList: [],
                lunchList: [],
                dinnerList: []
            }
            const dietFormJson = dietAdviceData ? JSON.parse(dietAdviceData.form || 'null') : {}
            // eslint-disable-next-line guard-for-in
            for (const key in dietFormJson) {
                const dayMenu = dietFormJson[key]
                console.log(dayMenu)
                const breakfast = dayMenu['早餐']
                dietTableData.breakfastList.push(breakfast)
                const lunch = dayMenu['午餐']
                dietTableData.lunchList.push(lunch)
                const dinner = dayMenu['晚餐']
                dietTableData.dinnerList.push(dinner)
            }

            const dietAdviceInfo = dietAdviceData ? {
                text: dietAdviceData.text,
                tableData: dietTableData,
                disclaimer: '请根据您的个人需求和宗教信仰，适当调整以上建议，切勿过度限制饮食，以避免对身体造成不良影响。',
            } : null

            console.log(dietAdviceInfo)

            // 解读时间
            this.reportInfo.createTime = formatDateTime(reportData.data.interpret.createdAt)
            // 解读报告数据
            this.reportInfo.interpretInfo = {
                interpretList,
                bsAbnormalItemList,
            }
            // 运动建议数据
            this.reportInfo.exerciseAdviceInfo = exerciseAdviceInfo
            // 营养建议数据
            this.reportInfo.dietAdviceInfo = dietAdviceInfo

            // 交互问题
            this.interpretQuestions = [...interpretQuestions]
            this.exerciseQuestions = [...exerciseAdviceQuestions, ...exerciseAdviceSuggestions, ...exerciseAdviceFormSuggestions]
            this.dietQuestions = [...dietAdviceQuestions, ...dietAdviceSuggestions, ...dietAdviceFormSuggestions]
            console.log('完整数据', this.reportInfo)
        },
        // 获取扫描用户信息
        getMemberInfo() {
            const userInfo = {
                scanId: this.scanId
            }
            this.$apollo
                .query({
                    query: getMemberInfo,
                    variables: userInfo,
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.getMemberInfo
                    console.log(data)
                    if (data.code === 200) {
                        this.memberInfo = data.data
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
    }
}
</script>

<style lang="less">
.print {
    width: 1070px;
    margin: 0 auto;
    .page {
        position: relative;
        height: 1383px;
        padding: 84px 89px 47px 89px;
        overflow: hidden;
    }
}
</style>
