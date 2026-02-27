<template>
    <div class="assistant">
        <el-container style="height: calc(100vh)">
            <el-container class="report-container">
                <el-main class="report">
                    <!-- 解读报告 -->
                    <div class="box">
                        <report-header :reportInfo="reportInfo" :memberInfo="memberInfo" :type="1" />
                        <report-interpret :data="reportInfo.interpretInfo" :showInterpretList="true"
                            :showBsAbnormalItemList="reportInfo.interpretInfo.interpretList.length === 1" />
                        <pagination></pagination>
                    </div>
                    <div v-if="reportInfo.interpretInfo.interpretList.length === 4" class="box">
                        <report-header :reportInfo="reportInfo" :memberInfo="memberInfo" :type="1" />
                        <report-interpret :data="reportInfo.interpretInfo" :showInterpretList="false"
                            :showBsAbnormalItemList="true" />
                        <pagination :num="2"></pagination>
                    </div>
                    <!-- 运动建议 -->
                    <div class="box">
                        <report-header :reportInfo="reportInfo" :memberInfo="memberInfo" :type="2" />
                        <exercise-advice :data="reportInfo.exerciseAdviceInfo" :showTips="!reportInfo.dietAdviceInfo" />
                        <pagination :num="showBsAbnormalItem ? 3 : 2"></pagination>
                    </div>
                    <!-- 营养建议 -->
                    <div class="box">
                        <report-header :reportInfo="reportInfo" :memberInfo="memberInfo" :type="3" />
                        <diet-advice :data="reportInfo.dietAdviceInfo" />
                        <pagination :num="showBsAbnormalItem ? 4 : 3"></pagination>
                    </div>
                </el-main>
            </el-container>
            <el-aside class="aside" width="730px">
                <el-main class="chat-window">
                    <div class="content">
                        <template v-for="(message, index) in formatMessages">
                            <div v-if="message.role === 'answer'" :key="index" class="message l">
                                <div v-if="message.type === 3" class="text answer err">
                                    <p>
                                    <pre>{{ message.msg }}</pre>
                                    </p>
                                </div>
                                <div v-else class="text answer">
                                    <p>
                                    <pre>{{ message.msg }}</pre>
                                    </p>
                                    <el-row v-if="message.type === 2">
                                        <el-button class="chat-btn dl-report" :disabled="false"
                                            @click="downloadPdf(message.url)">
                                            <img src="@/assets/images/ai_report.svg" alt="">
                                            下载解读报告
                                        </el-button>
                                    </el-row>
                                </div>
                            </div>
                            <div v-if="message.role === 'question'" :key="index" class="message r">
                                <div class="text question">
                                    <p>
                                    <pre>{{ message.msg }}</pre>
                                    </p>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="foot">
                        <el-row>
                            <div v-if="showReportTooltip" aria-hidden="false" class="el-tooltip__popper is-light" x-placement="top">
                                报告内容已变更，请点击重新生成
                                <div x-arrow="" class="popper__arrow" style="left: 95px;"></div>
                            </div>
                            <el-button class="chat-btn gen-report" :disabled="!interactive" @click="getReportPdf()">
                                <img src="@/assets/images/brain.svg" alt="">
                                生成解读报告
                            </el-button>
                            <span class="residue-degree">剩余交互次数: {{ remainingChats }}次</span>
                        </el-row>
                    </div>
                </el-main>
                <el-main class="question-window">
                    <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
                        <el-tab-pane label="#报告解读#" name="first">
                            <el-row>
                                <el-button :key="index" v-for="(item, index) in interpretQuestions"
                                    @click="buttonClick(item.question, item.itemName)" type="primary" size="small" plain
                                    :disabled="!interactive">{{ item.question
                                    }}</el-button>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="#运动计划#" name="second">
                            <el-row>
                                <el-button :key="index" v-for="(item, index) in exerciseQuestions"
                                    @click="buttonClick(item.question, item.itemName)" type="success" size="small" plain
                                    :disabled="!interactive">{{ item.question
                                    }}</el-button>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane v-if="dietQuestions.length" label="#饮食计划#" name="third">
                            <el-row>
                                <el-button :key="index" v-for="(item, index) in dietQuestions"
                                    @click="buttonClick(item.question, item.itemName)" type="warning" size="small" plain
                                    :disabled="!interactive">{{ item.question
                                    }}</el-button>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="显示全部" name="fourth">
                            <el-row>
                                <el-button :key="index" v-for="(item, index) in interpretQuestions"
                                    @click="buttonClick(item.question, item.itemName)" type="primary" size="small" plain
                                    :disabled="!interactive">{{ item.question
                                    }}</el-button>
                            </el-row>
                            <el-row>
                                <el-button :key="index" v-for="(item, index) in exerciseQuestions"
                                    @click="buttonClick(item.question, item.itemName)" type="success" size="small" plain
                                    :disabled="!interactive">{{ item.question
                                    }}</el-button>
                            </el-row>
                            <el-row v-if="dietQuestions.length">
                                <el-button :key="index" v-for="(item, index) in dietQuestions"
                                    @click="buttonClick(item.question, item.itemName)" type="warning" size="small" plain
                                    :disabled="!interactive">{{ item.question
                                    }}</el-button>
                            </el-row>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="测试工具" name="testTool">
                            <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px"
                                class="demo-dynamic" size="small">
                                <el-form-item v-for="(scanId, index) in dynamicValidateForm.scanIds"
                                    :label="'扫描ID-' + index" :key="scanId.key" :prop="'scanIds.' + index + '.value'" :rules="{
                                        required: true, message: '扫描ID不能为空', trigger: 'blur'
                                    }">
                                    <el-input class="scan-id" v-model="scanId.value"></el-input><el-button
                                        @click.prevent="removeDomain(scanId)">删除</el-button>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
                                    <el-button @click="addDomain">新增扫描ID</el-button>
                                    <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane> -->
                    </el-tabs>
                </el-main>
            </el-aside>
        </el-container>
    </div>
</template>

<script>
import ReportHeader from './components/Header'
import Pagination from './components/Pagination'
import ReportInterpret from './components/reportInterpret'
import ExerciseAdvice from './components/exerciseAdvice.vue'
import DietAdvice from './components/dietAdvice.vue'
import http from '@/assets/js/http.js'
import { formatDateTime, formatSecond } from '@/assets/js/util.js'
import { assistantApiHost } from '@/assets/js/config.js'
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
            activeName: 'fourth',
            interpretQuestions: [],
            exerciseQuestions: [],
            dietQuestions: [1],
            messages: [
                {
                    role: 'answer',
                    type: 1,
                    time: '2023-06-06 22:00:00',
                    msg:
                        '尊敬的教练员您好，我是您的AI助理，左侧是我根据学员报告生成的建议及计划，如需调整，请点击下方的沟通按钮告诉我，我会竭诚为您服务！'
                }
                // {
                //     role: 'answer',
                //     type: 2,
                //     time: '2023-06-06 22:00:01',
                //     msg: '您的解读报告已经生成，请点击下方按钮进入打印：'
                // },
                // {
                //     role: 'answer',
                //     type: 3,
                //     time: '2023-06-06 22:00:07',
                //     msg: '您的交互次数已用完，将在 2 小时 59 分 58 秒后恢复，请稍后再试。'
                // }
            ],
            dynamicValidateForm: {
                scanIds: [
                    {
                        value: ''
                    }
                ]
            },
            // 当前是否可交互
            interactive: true,
            // 可对话次数
            remainingChats: 10,
            // 显示报告已更新Tooltip
            showReportTooltip: false
        }
    },
    computed: {
        formatMessages() {
            return this.messages.sort((a, b) => {
                return new Date(a.time.replace(/-/g, '/')).getTime() - new Date(b.time.replace(/-/g, '/')).getTime()
            })
        },
        showBsAbnormalItem() {
            return this.reportInfo.interpretInfo.interpretList.length === 4
        }
    },
    created() {
        // 获取报告数据
        this.paraMeter()
        // this.sse()
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
                this.getRemainingChats(scanId)
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
                const bmQuestions = bm.questions.map(v => ({ itemName: 'bodyCompositionQuestions', question: v }))
                interpretQuestions.push(...bmQuestions)
            }

            if (bs) {
                interpretList.push({
                    name: '体态综述',
                    interpret: bs.summary
                })
                bsAbnormalItemList.push(...bs.abnormalsAnalysis)
                const bsQuestions = bs.questions.map(v => ({ itemName: 'bsQuestions', question: v }))
                interpretQuestions.push(...bsQuestions)
            }

            // 运动建议类数据
            const exerciseAdviceData = JSON.parse(reportData.data.advice.exercise)

            // 运动建议咨询类问题
            const exerciseAdviceQuestions = exerciseAdviceData.questions || []
            const formatExerciseAdviceQuestions = exerciseAdviceQuestions.map(v => ({
                itemName: 'exerciseQuestions',
                question: v
            }))

            // 运动建议改进类问题
            const exerciseAdviceSuggestions = exerciseAdviceData.suggestions || []
            const formatExerciseAdviceSuggestions = exerciseAdviceSuggestions.map(v => ({
                itemName: 'exerciseSuggestions',
                question: v
            }))

            // 运动建议form改进类问题
            const exerciseAdviceFormSuggestions = exerciseAdviceData.formSuggestions || []
            const formatExerciseAdviceFormSuggestions = exerciseAdviceFormSuggestions.map(v => ({
                itemName: 'exerciseFormSuggestions',
                question: v
            }))

            const exerciseTableData = {
                aerobics: [],
                strength: [],
                trainingIntensity: [],
                trainingVolume: []
            }

            const exerciseFormJson = JSON.parse(exerciseAdviceData.form || null)
            const adaptationStageJson = exerciseFormJson['适应阶段']
            const promotionStageJson = exerciseFormJson['提升阶段']
            let consolidationStageJson = exerciseFormJson['巩固阶段']
            if (consolidationStageJson.length > 3) consolidationStageJson = consolidationStageJson.slice(0, 3)
            // eslint-disable-next-line guard-for-in
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
                tableData: exerciseTableData
            }

            console.log('运动建议数据', exerciseAdviceInfo)

            // 营养建议类数据
            const dietAdviceData = JSON.parse(reportData.data.advice.diet || 'null')
            // 营养建议咨询类问题
            const dietAdviceQuestions = dietAdviceData ? dietAdviceData.questions : []
            const formatDietAdviceQuestions = dietAdviceQuestions.map(v => ({ itemName: 'dietQuestions', question: v }))

            // 营养建议改进类问题
            const dietAdviceSuggestions = dietAdviceData ? dietAdviceData.suggestions : []
            const formatDietAdviceSuggestions = dietAdviceSuggestions.map(v => ({
                itemName: 'dietSuggestions',
                question: v
            }))

            // 营养建议form改进类问题
            const dietAdviceFormSuggestions = dietAdviceData ? dietAdviceData.formSuggestions : []
            const formatDietAdviceFormSuggestions = dietAdviceFormSuggestions.map(v => ({
                itemName: 'foodFormSuggestions',
                question: v
            }))

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

            const dietAdviceInfo = dietAdviceData
                ? {
                    text: dietAdviceData.text,
                    tableData: dietTableData,
                    disclaimer:
                        '请根据您的个人需求和宗教信仰，适当调整以上建议，切勿过度限制饮食，以避免对身体造成不良影响。'
                }
                : null

            console.log(dietAdviceInfo)

            // 解读时间
            this.reportInfo.createTime = formatDateTime(reportData.data.interpret.createdAt)
            // 解读报告数据
            this.reportInfo.interpretInfo = {
                interpretList,
                bsAbnormalItemList
            }
            // 运动建议数据
            this.reportInfo.exerciseAdviceInfo = exerciseAdviceInfo
            // 营养建议数据
            this.reportInfo.dietAdviceInfo = dietAdviceInfo

            // 交互问题
            this.interpretQuestions = [...interpretQuestions]
            this.exerciseQuestions = [
                ...formatExerciseAdviceQuestions,
                ...formatExerciseAdviceSuggestions,
                ...formatExerciseAdviceFormSuggestions
            ]
            this.dietQuestions = [
                ...formatDietAdviceQuestions,
                ...formatDietAdviceSuggestions,
                ...formatDietAdviceFormSuggestions
            ]
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
        // 获取剩余交互次数
        async getRemainingChats(scanId) {
            const remainingChatsData = await http.get(`/assistant/remaining-chats/${scanId}`)
            this.remainingChats = remainingChatsData.data
        },
        async testGenerateAiReport(scanIds) {
            const result = await http.post('/assistant/test-generate-ai-report', { scanIds })
            console.log('返回结果', result)
            const msgItem = {
                role: 'answer',
                time: formatDateTime(),
                msg: result
            }
            this.handleAddAnswerMsg(msgItem)
        },
        // 下载PDF文件
        downloadPdf(url) {
            window.open(url, '_blank')
        },
        // 获取PDF文件
        getReportPdf() {
            this.interactive = false
            this.showReportTooltip = false
            const time = formatDateTime()
            const msgItem = {
                role: 'answer',
                type: 1,
                time,
                msg: '...',
                url: ''
            }
            this.handleAddAnswerMsg(msgItem)

            http.get(`/assistant/ai-report-pdf/${this.scanId}`).then(res => {
                const url = res.data
                const msgItem = this.messages.find(v => v.time === time)
                msgItem.msg = '您的解读报告已经生成，请点击下方按钮进入打印：'
                msgItem.type = 2
                msgItem.url = url
                this.interactive = true
            })
        },
        chat(scanId, question, itemName) {
            this.interactive = false
            const msgItem = {
                role: 'answer',
                type: 1,
                time: formatDateTime(),
                msg: '...'
            }
            this.handleAddAnswerMsg(msgItem)
            const eventSource = new EventSource(
                `${assistantApiHost}/assistant/chat?scanId=${scanId}&question=${question}&itemName=${itemName}`
            )
            let responseText = ''
            eventSource.onmessage = ({ data }) => {
                console.log('sse', data)
                // 后端返回报告已更新
                if (data === '[REPORT-UPDATED]') {
                    this.showReportTooltip = true
                }
                // 后端返回结束后关闭请求
                if (data === '[DONE]') {
                    this.getReportInfo(this.scanId)
                    this.interactive = true
                    return eventSource.close()
                }
                const json = JSON.parse(data)
                const delta = json.content
                // 判断是聊天回复内容
                if (delta) {
                    responseText += delta
                    this.messages[this.messages.length - 1].msg = responseText
                    this.$nextTick(() => {
                        let ele = document.getElementsByClassName('chat-window')[0]
                        ele.scrollTop = ele.scrollHeight
                    })
                }
                const remainingChats = json.remainingChats
                const expiry = json.expiry
                // 判断是剩余对话次数返回
                if (remainingChats) {
                    this.remainingChats = remainingChats
                }
                if (expiry) {
                    this.messages[this.messages.length - 1].msg = `您的交互次数已用完，将在 ${formatSecond(
                        expiry
                    )}后恢复，请稍后再试。`
                    this.messages[this.messages.length - 1].type = 3
                }
            }
            eventSource.onerror = err => {
                console.log(err)
                this.interactive = true
            }
        },
        handleClick(tab, event) {
            console.log(tab, event)
        },
        handleAddAnswerMsg(msgItem) {
            this.messages.push(msgItem)
            this.$nextTick(() => {
                let ele = document.getElementsByClassName('chat-window')[0]
                ele.scrollTop = ele.scrollHeight
            })
        },
        buttonClick(question, itemName) {
            const item = {
                role: 'question',
                time: formatDateTime(),
                msg: question
            }
            console.log(item)
            this.messages.push(item)
            this.$nextTick(() => {
                let ele = document.getElementsByClassName('chat-window')[0]
                ele.scrollTop = ele.scrollHeight
            })
            if (question && itemName) this.chat(this.scanId, question, itemName)
        },
        submitForm(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    const scanIds = this.dynamicValidateForm.scanIds.map(v => v.value)
                    const msg = `开始生成AI报告解读：\n${scanIds.join('\n')}`
                    this.buttonClick(msg)
                    await this.testGenerateAiReport(scanIds)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        removeDomain(item) {
            let index = this.dynamicValidateForm.scanIds.indexOf(item)
            if (index !== -1) {
                this.dynamicValidateForm.scanIds.splice(index, 1)
            }
        },
        addDomain() {
            this.dynamicValidateForm.scanIds.push({
                value: '',
                key: Date.now()
            })
            this.$nextTick(() => {
                let ele = document.getElementsByClassName('question-window')[0]
                ele.scrollTop = ele.scrollHeight
            })
        }
    }
}
</script>

<style lang="less">
.assistant {
    width: 1920px;
    background-color: #d8d8d8;

    .report-container {
        padding: 24px 16px 0 24px;

        .report {
            width: 1150px;
            padding: 57px 40px 57px;
            background: #ffffff;
            border-radius: 8px 8px 0px 0px;

            .box {
                position: relative;
                height: 1516px;
                padding: 84px 89px 47px 89px;
            }
        }
    }

    .aside {
        padding-top: 24px;
    }

    .chat-window {
        width: 706px;
        height: calc(60vh);
        background: #f2f2f7;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .message {
            position: relative;
            width: 100%;
            display: flex;
            margin-bottom: 12px;

            &.l {
                justify-content: flex-start;
            }

            &.r {
                justify-content: flex-end;
            }
        }

        .text {
            max-width: 514px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            line-height: 24px;
            border-radius: 8px;
            padding: 12px 17px;

            p {
                margin: 0;
            }

            pre {
                margin: 0;
                white-space: break-spaces;
            }
        }

        .answer {
            color: #636366;
            background-color: #ffffff;

            &.err {
                background: rgba(224, 32, 32, 0.06);
                color: #e02020;
            }
        }

        .question {
            background: linear-gradient(45deg, #079379 0%, #18b38f 100%);
            color: #ffffff;
        }

        .chat-btn {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 500;
            line-height: 24px;
            color: #ffffff;
            border-radius: 8px;
            padding: 8px 50px;
            margin: 12px 0 0 12px;

            img {
                position: relative;
                top: -1px;
                width: auto;
                height: 14px;
                vertical-align: middle;
                margin-right: 2px;
                color: #ffffff;
            }

            &.gen-report {
                background: linear-gradient(45deg, #079379 0%, #18b38f 100%);

                &.is-disabled {
                    background: linear-gradient(45deg, #079379 0%, #18b38f 100%);
                    opacity: 0.24;
                }
            }

            &.dl-report {
                background: linear-gradient(225deg, #87d509 0%, #79bd09 100%);
            }
        }

        .el-tooltip__popper.is-light {
            position: absolute;
            top: -30px;
            left: 14px;
            transform-origin: center bottom;
            background: #fff;
            border: 1px solid #303133;
            margin-bottom: 24px;
            border-radius: 4px;
            padding: 10px;
            font-size: 12px;
            line-height: 1.2;
            min-width: 10px;
            .popper__arrow {
                border-top-color: #303133;
                bottom: -12px;
                border-bottom-width: 0;
                border-width: 6px;
            }
            .popper__arrow::after {
                content: " ";
                border-width: 5px;
                position: absolute;
                display: block;
                width: 0;
                height: 0;
                border-color: transparent;
                border-style: solid;
                bottom: 1px;
                margin-left: -5px;
                border-top-color: #303133;
                border-bottom-width: 0;
                border-top-color: #fff;
            }
        }

        .foot {
            margin-top: 20px;
            padding-left: 17px;

            .residue-degree {
                margin-left: 285px;
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(60, 60, 67, 0.6);
                line-height: 18px;
            }
        }
    }

    .question-window {
        width: 706px;
        height: calc(35vh);
        margin-top: 16px;
        background: #f2f2f7;
        border-radius: 8px;

        .el-row {
            margin-bottom: 16px;

            .el-button {
                margin-right: 12px;
                margin-bottom: 16px;
            }

            .el-button + .el-button {
                margin-left: 0;
            }
        }

        .demo-dynamic {
            width: 600px;

            .scan-id {
                width: 86%;
            }
        }
    }
}
</style>
