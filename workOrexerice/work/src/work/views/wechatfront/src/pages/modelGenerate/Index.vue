<template>
    <div class="model-generating">
        <div :class="{ 'generation-waiting-100': loadingOver }" class="generation-waiting">
            <div class="three-dimensional-bg"></div>
            <!-- 数据读取百分比 -->
            <div :class="{ 'bdaFalse': bdaFalse }">
                <p class="data-title" v-if="loadingOver">报告生成成功</p>
                <p class="data-title" v-else>模型生成中，请您稍等</p>
                <p class="data-title">
                    <span class="num">
                        <count-up
                            :decimals="1"
                            :duration="countDuration"
                            :endVal="endVal"
                            :startVal="startVal"
                            @ready="onReady"
                        />
                    </span>%
                </p>
            </div>
            <!-- 人体模型 -->
            <div class="body-model">
                <span :class="loadingOver && !bdaFalse ? 'body-box' : ''">
                    <img src="@/assets/images/failed_person.png" v-if="!bdaFalse" />
                    <report-model
                        :key="componentKey"
                        class="generating-model"
                        :open-overlay="false"
                        v-if="loadingOver"
                        type="modeling"
                    ></report-model>
                </span>
            </div>
            <!-- 与进步同步的遮挡层 -->
            <div class="speed-shadow" v-if="!loadingOver">
                <div class="speed-box" ref="shadow">
                    <div class="speed-padd"></div>
                </div>
            </div>
        </div>
        <!-- 提示信息的转换 -->
        <div class="hint-info" v-if="loadingOver">
            <!-- 提示信息 -->
            <div class="hint-msg">
                <div :class="['top-tips', projectItems.length < 3 ? 'top-tip-center' : '', isDeviceReport ? 'isDeviceReport' : '']">
                    <div
                        :class="['project-box', (index % 3 > 0 || projectItems.length === 1) ? 'project-box-center' : '']"
                        v-for="(item, index) in projectItems"
                        :key="item.name"
                    >
                        <img
                            v-if="item.status === 1"
                            src="@/assets/images/modeling/modeling_success.png"
                            width="12"
                            height="12"
                        />
                        <img v-else src="@/assets/images/modeling/modeling_failure.png" width="12" height="12" />
                        <span class="project-name">{{item.name}}</span>
                    </div>
                </div>
                <p class="msg-success">{{ tipsTitles }}</p>
            </div>
            <!-- 提示信息同步按钮 -->
            <div style="margin-top: 20px">
                <p v-if="loadingOver">
                    <span @click="successClick" v-if="!showCloseBtn" class="entry-report-but">{{ reportName }}</span>
                    <span @click="closePage" v-else class="entry-report-but">关闭页面</span>
                </p>
            </div>
        </div>
        <div class="hint-info" v-else>
            <mt-swipe :auto="6000" class="loading-tips">
                <mt-swipe-item>
                    <p class="msg-title">深度实感技术</p>
                    <p class="msg-cont">通过三维扫描准确采集身体局部细节，保证围度测量的毫米级精度，让健身后的体型变化清晰呈现。</p>
                </mt-swipe-item>
                <mt-swipe-item v-if="!isVAPro3 && !isVAPro5 ">
                    <p class="msg-title">BDA&BIA融合算法</p>
                    <p
                        class="msg-cont"
                    >{{ isShowLogo ? '维塑采用最前沿的人体成分测算体系——BDA算法确定人体成分，这项基于身体体积的测算方式将并更精确地评估肥胖带来的健康风险。' : '采用最前沿的人体成分测算体系——BDA算法确定人体成分，这项基于身体体积的测算方式将并更精确地评估肥胖带来的健康风险。' }}</p>
                </mt-swipe-item>
                <mt-swipe-item>
                    <p class="msg-title">误差产生因素</p>
                    <p class="msg-cont">宽松的着装、身上的异物等都会导致不同程度的误差，如您想获取最精确的数据，请您穿着紧身衣或减少身上的衣物。</p>
                </mt-swipe-item>
            </mt-swipe>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import {
    findScanTypeInfo,
    findScanTrueHistory,
    findLatestScanTypeInfo,
    updateScanTypeInfoRowByScanId,
    getWechatSignature,
} from '@/assets/js/apolloGql.js'
import ReportModel from '@/components/model/Report'
import countUp from 'vue-countup-v2' // 计数过渡组件
import { isVAPro3, showLogo, isVAPro5, isVAPro7 } from '@/types/device.js'
import { isWeiXin, getDomainFromString } from '@/assets/js/util.js'
import wx from 'weixin-js-sdk'
// import vConsole from '@/assets/js/vconsole'

export default {
    components: {
        ReportModel,
        countUp,
    },
    data() {
        return {
            startVal: 0,
            endVal: 0,
            countDuration: 15,
            // 模型加载动画
            loadingOver: false,
            iframeOptions: {
                url: 'measure.html',
                modelPath: '',
                width: '215px',
                height: '270px',
                failed: false,
            },
            reportName: '查看报告',
            tipsTitles: '您的报告已生成，可点击“查看报告”按钮查看。', // 温馨提示
            bdaFalse: false,
            evalStatus: '',
            biaStatus: '',
            bdaStatus: '',
            findHistory: null, // 历史记录信息
            allFalse: false, // 两者都合成失败
            findScanType: -1, // 当前扫描类型
            scanTypeInfo: '', // 请求返回信息
            loginInfo: JSON.parse(window.localStorage.getItem('loginInfo')),
            // 合成中集合
            loadResults: [-1, -10],
            // 失败集合
            errorResults: [0, 2],
            // 展示关闭按钮
            showCloseBtn: false,
            // 是否查询历史记录
            isFindHistory: false,
            isVAPro3: isVAPro3(),
            isVAPro5: isVAPro5(),
            isVAPro7: isVAPro7(),
            isShowLogo: showLogo(),
            // 是否分享进入
            isShare: 0,
            componentKey: 1,
            projectItems: [],
            isFirstStatus: false,
            // 设备端进入问卷调查是否填写完成
            questionReportStatus: false,
            getQuestionReportTimer: null,
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport')
        }
    },
    created() {
        // new vConsole()
        try {
            // 绑定方式
            const modelInfo = JSON.parse(window.localStorage.getItem('modelInfo'))
            console.log('modelInfo apro3 数据', modelInfo.scanMode, modelInfo.questionReport, this.isVAPro5)
            // console.log(scanMode, 9999, isVAPro3(), this.$route.query.quest)
            if (
                (this.isVAPro3 || this.isVAPro5) &&
                modelInfo.scanMode &&
                modelInfo.girthMeasure &&
                !modelInfo.questionReport &&
                !this.$route.query.quest &&
                (modelInfo.nutrition === 0 || modelInfo.nutrition === 1)
            ) {
                if (window.sessionStorage.getItem('isDeviceReport') && !this.questionReportStatus) {
                    console.log('设备端进入不进入问卷调查报告页面')
                    // 每间隔5s请求一下该设备问卷调查在手机端是否填写，填写完生成可查看的报告
                    this.getQuestionReportTimer = setInterval(() => {
                         this.getQuestStatus()
                    }, 10 * 1000)
                    return
                } else {
                    this.$router.push({
                        path: '/question',
                    })
                    return
                }

            }
        } catch (err) {
            console.log('获取modelInfo异常,非apro3报告', err)
        }
        this.isShare = sessionStorage.getItem('isShare')
        this.findScanTypeInfo()
        // this.findScanTrueHistory()
    },
    methods: {
        // 查询是否问卷调查填写完成
        async getQuestStatus() {
              const res = await this.$apollo.query({
                query: findScanTypeInfo,
                fetchPolicy: 'network-only'
            })
            const data = res.data.findScanTypeInfo.data
            console.log('>>>> [questionReport]', data.questionReport)
            if (data.questionReport === 1) {
                window.clearInterval(this.getQuestionReportTimer)
                this.getQuestionReportTimer = null
                this.findScanTypeInfo()
            }
        },
        // 设置报告为已查看
        updateViewStatus() {
            this.$apollo
                .query({
                    query: updateScanTypeInfoRowByScanId,
                    variables: {
                        scanId: this.scanTypeInfo.scanId,
                        viewStatus: 1,
                    },
                })
                .then((res) => {})
        },
        // 查询合成状态
        findScanTypeInfo() {
            const queryType = this.loginInfo.type === 'menuLogin' ? findLatestScanTypeInfo : findScanTypeInfo
            const variables = this.loginInfo.type !== 'menuLogin' && this.$route.query.scanId ? { scanId: this.$route.query.scanId } : {}
            try {
                 this.$apollo
                .query({
                    query: queryType,
                    fetchPolicy: 'network-only',
                    variables: variables
                    // variables: {
                    //     scanId: JSON.parse(window.localStorage.getItem('modelInfo')).scanId,
                    // }
                })
                .then((res) => {
                    let data =
                        this.loginInfo.type === 'menuLogin'
                            ? res.data.findLatestScanTypeInfo
                            : res.data.findScanTypeInfo
                    if (data.code === 200) {
                        if (data.data.spineReport && data.data.bsSpineScanInfo == null && !this.isFirstStatus) {
                            setTimeout(() => {
                                this.isFirstStatus = true
                                this.findScanTypeInfo()
                            }, 20 * 1000)
                        }
                        this.scanTypeInfo = { ...data.data, bsSpineStatus: data.data.bsSpineScanInfo ? data.data.bsSpineScanInfo.result : 0 }
                        // console.log('1==>scanTypeInfo', this.scanTypeInfo)
                        data = data.data
                        this.shareClick(this.scanTypeInfo.scanId)
                        clearTimeout(this.timer)

                        /**
                         * 判断合成结果
                         * -10： 默认状态当合成中处理
                         * -1：  合成未返回
                         * 0：   失败
                         * 1：   成功
                         * 2：   超时
                         * staticEval-bsScanInfo    体态
                         * bmBiaScanInfo    体成分BIA
                         * bmBdaScanInfo    体成分BDA
                         * 测量项目(1 测量 0 未测量)与模块状态的关系
                         * 身体成分(biaMeasure)-bmBiaScanInfo
                         * 体态评估(staticEval)-bsScanInfo
                         *                     bmBdaScanInfo 存在未测量的情况
                         * 肩部评估(shoulderJointEval)-bsShoulderScanInfo
                         */
                        this.endVal = this.getTotalPercent(data)
                        if (data.scanId.slice(0, 2) === 'M5') {
                            if (data.girthMeasure === 0 && data.staticEval === 1) {
                                // 体态
                                this.evalStatus = data.bsScanInfo.result
                                // this.bdaStatus = data.bmBdaScanInfo ? data.bmBdaScanInfo.result : 4
                                // 合成中 等待合成中
                                if (this.loadResults.indexOf(this.evalStatus) > -1) {
                                    this.timer = setTimeout(() => {
                                        this.findScanTypeInfo()
                                    }, 15000)
                                } else if (this.evalStatus === 1) {
                                    // 成功
                                    this.tipsTitles = '您的报告已生成，可点击“查看报告”按钮查看。'
                                    this.updateModelInfo({
                                        evalStatus: this.evalStatus,
                                        bsShoulderScanResult: data.bsShoulderScanInfo
                                            ? data.bsShoulderScanInfo.result
                                            : null,
                                    })
                                } else {
                                    // 失败 超时
                                    // 判断是否测量了肩部评估并且成功
                                    if (data.shoulderJointEval === 1 && data.bsShoulderScanInfo.result === 1) {
                                        this.tipsTitles = '您的体态报告未生成，请查看肩部功能评估报告'
                                        this.updateModelInfo({
                                            bsShoulderScanResult: data.bsShoulderScanInfo
                                                ? data.bsShoulderScanInfo.result
                                                : null,
                                        })
                                    } else {
                                        // 找历史数据
                                        this.findScanTrueHistory()
                                    }
                                }
                            } else if (data.girthMeasure === 1 && data.staticEval === 0) {
                                console.log('只做了体围')
                                this.bdaStatus = data.bmBdaScanInfo ? data.bmBdaScanInfo.result : 4
                                // 合成中 等待合成中
                                if (this.loadResults.indexOf(this.bdaStatus) > -1) {
                                    this.timer = setTimeout(() => {
                                        this.findScanTypeInfo()
                                    }, 15000)
                                } else if (this.bdaStatus === 1) {
                                    // 成功
                                    this.tipsTitles = '您的报告已生成，可点击“查看报告”按钮查看。'
                                    this.updateModelInfo({
                                        bdaStatus: this.bdaStatus,
                                        bsShoulderScanResult: data.bsShoulderScanInfo
                                            ? data.bsShoulderScanInfo.result
                                            : null,
                                    })
                                } else {
                                    // 失败 超时
                                    // 判断是否测量了肩部评估并且成功
                                    if (data.shoulderJointEval === 1 && data.bsShoulderScanInfo.result === 1) {
                                        this.tipsTitles = '您的体态报告未生成，请查看肩部功能评估报告'
                                        this.updateModelInfo({
                                            bsShoulderScanResult: data.bsShoulderScanInfo
                                                ? data.bsShoulderScanInfo.result
                                                : null,
                                        })
                                    } else {
                                        // 找历史数据
                                        this.findScanTrueHistory()
                                    }
                                }
                            } else if (data.girthMeasure === 1 && data.staticEval === 1) {
                                // 体测+体态
                                this.bothBodyScanTypeMeasureInfo()
                            }
                        } else if (data.scanId.slice(0, 2) === 'M6' || data.scanId.slice(0, 2) === 'M7' || data.scanId.slice(0, 2) === 'M2' || data.scanId.slice(0, 2) === 'N2' || data.scanId.slice(0, 2) === 'N7') {
                            // 处理vapro5跳转
                            this.jumpPageForVapro5(data, false)
                        } else {
                            if (data.biaMeasure === 1 && data.staticEval === 0) {
                                // 体测
                                // bia 生成中 或 bda 生成中
                                if (this.loadResults.indexOf(data.bmBiaScanInfo.result) > -1) {
                                    this.timer = setTimeout(() => {
                                        this.findScanTypeInfo()
                                    }, 15000)
                                } else if (data.bmBiaScanInfo.result === 1) {
                                    // bia 成功
                                    this.tipsTitles = '您的报告已生成，可点击“查看报告”按钮查看。'
                                    this.updateModelInfo({
                                        biaStatus: data.bmBiaScanInfo.result,
                                        bsShoulderScanResult: data.bsShoulderScanInfo
                                            ? data.bsShoulderScanInfo.result
                                            : null,
                                    })
                                } else if (this.errorResults.indexOf(data.bmBiaScanInfo.result) > -1) {
                                    // bia 失败
                                    // 判断是否测量了肩部评估并且成功
                                    if (data.shoulderJointEval === 1 && data.bsShoulderScanInfo.result === 1) {
                                        this.tipsTitles = '您的体成分报告未成功生成，请查看肩部功能评估报告'
                                        this.updateModelInfo({
                                            bsShoulderScanResult: data.bsShoulderScanInfo
                                                ? data.bsShoulderScanInfo.result
                                                : null,
                                        })
                                    } else {
                                        // 找历史数据
                                        this.findScanTrueHistory()
                                    }
                                }
                                this.biaStatus = data.bmBiaScanInfo.result
                            } else if (data.biaMeasure === 0 && data.staticEval === 1) {
                                // 体态
                                this.evalStatus = data.bsScanInfo.result
                                this.bdaStatus = data.bmBdaScanInfo ? data.bmBdaScanInfo.result : 4
                                // 合成中 等待合成中
                                if (
                                    this.loadResults.indexOf(this.evalStatus) > -1 ||
                                    this.loadResults.indexOf(this.bdaStatus) > -1
                                ) {
                                    this.timer = setTimeout(() => {
                                        this.findScanTypeInfo()
                                    }, 15000)
                                } else if (this.evalStatus === 1) {
                                    // 成功
                                    this.tipsTitles = '您的报告已生成，可点击“查看报告”按钮查看。'
                                    this.updateModelInfo({
                                        evalStatus: this.evalStatus,
                                        bdaStatus: this.bdaStatus,
                                        bsShoulderScanResult: data.bsShoulderScanInfo
                                            ? data.bsShoulderScanInfo.result
                                            : null,
                                    })
                                } else {
                                    // 失败 超时
                                    // 判断是否测量了肩部评估并且成功
                                    if (data.shoulderJointEval === 1 && data.bsShoulderScanInfo.result === 1) {
                                        this.tipsTitles = '您的体态报告未生成，请查看肩部功能评估报告'
                                        this.updateModelInfo({
                                            bsShoulderScanResult: data.bsShoulderScanInfo
                                                ? data.bsShoulderScanInfo.result
                                                : null,
                                        })
                                    } else {
                                        // 找历史数据
                                        this.findScanTrueHistory()
                                    }
                                }
                            } else if (data.biaMeasure === 1 && data.staticEval === 1) {
                                // 体测+体态
                                this.bothScanTypeInfo()
                            }
                        }
                    } else if (data.code === 404) {
                        // 该手机号在当前公众号下没有报告
                        this.$router.push({
                            path: '/exception/report',
                        })
                    }
                })
            } catch (error) {
                console.log('异常重启请求')
                this.findScanTypeInfo()
            }
           },
        // vapro5跳转逻辑
        jumpPageForVapro5(data, onlyShoulder) {
            console.log('使用vapro5判断逻辑' + JSON.stringify(data))
            const measureProject = [data.staticEval, data.girthMeasure, data.biaMeasure, data.bsSpineScanInfo ? 1 : 0]
            console.log('使用vapro5判断逻辑1')
            const measureProjectStatus = [
                data.bsScanInfo ? data.bsScanInfo.result : null,
                data.bmBdaScanInfo ? data.bmBdaScanInfo.result : null,
                data.bmBiaScanInfo ? data.bmBiaScanInfo.result : null,
                data.bsSpineScanInfo ? data.bsSpineScanInfo.result : 0
            ]
            console.log('使用vapro5判断逻辑2')
            const shoulderState = data.shoulderJointEval === 1 && data.bsShoulderScanInfo.result === 1
            console.log('使用vapro5判断逻辑3')
            // 是否有正在合成项目
            let synthesis = false
            // 计算总共测量项目
            let measureItem = 0
            // 统计失败项目
            let failureItem = 0
            for (let index = 0; index < measureProject.length; index++) {
                const item = measureProject[index]
                const status = measureProjectStatus[index]
                if (item === 1) {
                    // 只有测量项目参与
                    measureItem = measureItem + 1
                    if ([-1, -10].indexOf(status) > -1) {
                        // 此项正在合成中
                        synthesis = true
                    } else if ([0, 2].indexOf(status) > -1) {
                        // 测量失败
                        failureItem = failureItem + 1
                    }
                }
            }
            // window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
            console.log(`使用vapro5判断逻辑4 ${synthesis} ${failureItem} ${measureItem} ${shoulderState}`)
            this.biaStatus = measureProjectStatus[2]
            this.bdaStatus = measureProjectStatus[1]
            this.evalStatus = measureProjectStatus[0]
            if (synthesis) {
                // 在合成中
                this.timer = setTimeout(() => {
                    this.findScanTypeInfo()
                }, 15000)
            } else if (failureItem === measureItem && !shoulderState) {
                // 全部失败
                this.findScanTrueHistory()
            } else {
                // 无合成项并且有成功项目
                let modelInfo = {
                    scanId: data.scanId,
                    memberId: data.memberId,
                    biaMeasure: data.biaMeasure, // 体成分是否测量
                    staticEval: data.staticEval, // 体态是否测量
                    girthMeasure: data.girthMeasure, // 体围是否测量
                    shoulderEval: data.shoulderJointEval, // 肩部是否测量
                    createTime: data.createTime,
                    biaStatus: measureProjectStatus[2], // 体成分进度
                    evalStatus: measureProjectStatus[0], // 体态进度
                    bdaStatus: measureProjectStatus[1], // 体围进度
                    bsShoulderScanResult: data.bsShoulderScanInfo ? data.bsShoulderScanInfo.result : null,
                    nutrition: data.nutrition,
                }
                this.updateModelInfo(modelInfo)
            }
        },
        // 体态 + 体围逻辑
        bothBodyScanTypeMeasureInfo() {
            // console.log('题为体态都测量')
            this.bdaStatus = this.scanTypeInfo.bmBdaScanInfo ? this.scanTypeInfo.bmBdaScanInfo.result : 4
            this.evalStatus = this.scanTypeInfo.bsScanInfo.result

            // 三个中一个在加载中
            if (this.loadResults.indexOf(this.bdaStatus) > -1 || this.loadResults.indexOf(this.evalStatus) > -1) {
                this.timer = setTimeout(() => {
                    this.findScanTypeInfo()
                }, 15000)
            } else if (this.evalStatus === 1) {
                // 体态成功
                if (this.errorResults.indexOf(this.bdaStatus) > -1) {
                    // bia 失败
                    this.reportName = '查看体态报告'
                    this.tipsTitles = '您的体围报告未成功，请查看体态评估报告。'
                } else {
                    // bia成功
                    this.tipsTitles = '您的报告已生成，可点击“查看报告”按钮查看。'
                }
            } else {
                // 体态失败
                if (this.errorResults.indexOf(this.bdaStatus) > -1) {
                    // bia bda 失败
                    // 判断是否测量了颈部评估并且成功
                    if (
                        this.scanTypeInfo.shoulderJointEval === 1 &&
                        this.scanTypeInfo.bsShoulderScanInfo.result === 1
                    ) {
                        this.tipsTitles = '您的体态报告未生成，请查看肩部功能评估报告'
                    } else {
                        // 找历史数据
                        this.findScanTrueHistory()
                    }
                } else {
                    // bia成功 + bda成功/失败
                    this.reportName = '查看体成分报告'
                    this.tipsTitles = '您的体态评估未成功，请查看体成分报告。'
                }
            }
            this.updateModelInfo({
                biaStatus: this.biaStatus,
                bdaStatus: this.bdaStatus,
                evalStatus: this.evalStatus,
                bsShoulderScanResult: this.scanTypeInfo.bsShoulderScanInfo
                    ? this.scanTypeInfo.bsShoulderScanInfo.result
                    : 0,
            })
        },
        // 体测 + 体态逻辑
        bothScanTypeInfo() {
            this.biaStatus = this.scanTypeInfo.bmBiaScanInfo.result
            this.bdaStatus = this.scanTypeInfo.bmBdaScanInfo ? this.scanTypeInfo.bmBdaScanInfo.result : 4
            this.evalStatus = this.scanTypeInfo.bsScanInfo.result
            // 三个中一个在加载中
            if (
                this.loadResults.indexOf(this.biaStatus) > -1 ||
                this.loadResults.indexOf(this.bdaStatus) > -1 ||
                this.loadResults.indexOf(this.evalStatus) > -1
            ) {
                this.timer = setTimeout(() => {
                    this.findScanTypeInfo()
                }, 15000)
            } else if (this.evalStatus === 1) {
                // 体态成功
                if (this.errorResults.indexOf(this.biaStatus) > -1) {
                    // bia 失败
                    this.reportName = '查看体态报告'
                    this.tipsTitles = '您的身体成分未成功，请查看体态评估报告。'
                } else {
                    // bia成功
                    this.tipsTitles = '您的报告已生成，可点击“查看报告”按钮查看。'
                }
            } else {
                // 体态失败
                if (this.errorResults.indexOf(this.biaStatus) > -1) {
                    // bia bda 失败
                    // 判断是否测量了颈部评估并且成功
                    if (
                        this.scanTypeInfo.shoulderJointEval === 1 &&
                        this.scanTypeInfo.bsShoulderScanInfo.result === 1
                    ) {
                        this.tipsTitles = '您的体成分和体态报告未生成，请查看肩部功能评估报告'
                    } else {
                        // 找历史数据
                        this.findScanTrueHistory()
                    }
                } else {
                    // bia成功 + bda成功/失败
                    this.reportName = '查看体成分报告'
                    this.tipsTitles = '您的体态评估未成功，请查看体成分报告。'
                }
            }
            this.updateModelInfo({
                biaStatus: this.biaStatus,
                bdaStatus: this.bdaStatus,
                evalStatus: this.evalStatus,
                bsShoulderScanResult: this.scanTypeInfo.bsShoulderScanInfo
                    ? this.scanTypeInfo.bsShoulderScanInfo.result
                    : 0,
            })
        },
        // 两者都失败判断历史记录
        findScanTrueHistory() {
            this.$apollo
                .query({
                    query: findScanTrueHistory,
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    let history = res.data.findScanTrueHistory.data
                    this.findHistory = res.data.findScanTrueHistory.data

                    // console.log('2==>findHistory', this.findHistory)
                    // history = null
                    this.isFindHistory = true
                    // this.bdaFalse = true
                    // 首次测量情况
                    if (history === null) {
                        this.showCloseBtn = true
                        if (this.scanTypeInfo.biaMeasure === 1 && this.scanTypeInfo.staticEval === 0) {
                            this.tipsTitles = '身体成分未成功，请到设备端重新体验哦~'
                        } else if (this.scanTypeInfo.biaMeasure === 0 && this.scanTypeInfo.staticEval === 1) {
                            this.tipsTitles = '体态评估未成功，请到设备端重新体验哦~'
                            // 两者测量都失败
                        } else if (this.scanTypeInfo.biaMeasure === 1 && this.scanTypeInfo.staticEval === 1) {
                            this.tipsTitles = '您的测量未成功，请到设备端重新体验哦~'
                        }
                        this.updateModelInfo({
                            biaStatus: this.biaStatus,
                            bdaStatus: this.bdaStatus,
                            evalStatus: this.evalStatus,
                            bsSpineStatus: history.bsSpineStatus ? history.bsSpineStatus : 0
                        })
                        return
                    }
                    // 为false跳转查看历史记录页面
                    let scanResult = {
                        bmBdaScanResult: null,
                        bsScanResult: null,
                        bmBiaScanResult: null,
                        bsSpineStatus: history.bsSpineStatus ? history.bsSpineStatus : 0
                    }
                    // vapro3更新肩部和体围的状态
                    if (this.isVAPro3 || this.isVAPro5) {
                        scanResult = {
                            ...scanResult,
                            evalStatus: history.evalStatus,
                            bsShoulderScanResult: history.bsShoulderStatus,
                        }
                    }
                    // console.log('3==>scanResult', scanResult)
                    // 单独体测测量失败的时候
                    this.reportName = '查看上次报告'
                    if (this.scanTypeInfo.biaMeasure === 1 && this.scanTypeInfo.staticEval === 0) {
                        this.tipsTitles = '身体成分未成功，请到设备端重新体验哦~'
                        this.updateModelInfo(scanResult)
                    } else if (this.scanTypeInfo.biaMeasure === 0 && this.scanTypeInfo.staticEval === 1) {
                        this.tipsTitles = '体态评估未成功，请到设备端重新体验哦~'
                        this.updateModelInfo(scanResult)
                        // 两者测量都失败
                    } else if (this.scanTypeInfo.biaMeasure === 1 && this.scanTypeInfo.staticEval === 1) {
                        this.countDuration = 3
                        this.tipsTitles = '您的测量未成功，请到设备端重新体验哦~'
                        this.updateModelInfo(scanResult)
                        // vaRro3无电流营养分析
                    } else if (
                        (this.isVAPro3 || this.isVAPro5) &&
                        this.scanTypeInfo.girthMeasure === 1 &&
                        this.scanTypeInfo.staticEval === 0
                    ) {
                        this.countDuration = 3
                        this.tipsTitles = '您的测量未成功，请到设备端重新体验哦~'
                        this.updateModelInfo(scanResult)
                    }
                    this.componentKey += 1
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 成功点击跳转
        successClick() {
            if (this.isFindHistory) {
                const scanResult = {
                    biaStatus: this.findHistory.biaStatus,
                    bdaStatus: this.findHistory.bdaStatus,
                    evalStatus: this.findHistory.evalStatus,
                    bsShoulderScanResult: this.findHistory.bsShoulderStatus ? this.findHistory.bsShoulderStatus : 0,
                }
                this.updateModelInfo(scanResult, true)
            }
            const bmBiaResult = this.isFindHistory ? this.findHistory.biaStatus : this.biaStatus
            const bsResult = this.isFindHistory ? this.findHistory.evalStatus : this.evalStatus
            this.shareClick(this.scanTypeInfo.scanId)
            console.log(`当前体成分装太${this.isFindHistory}  ${this.biaStatus}`)
            // 只测 肩部直接跳转到首页
            this.$router.push({
                path: (bmBiaResult === 1 && !this.isVAPro5) || bsResult === 1 ? window.localStorage.getItem('healthPackageEnable') === '2' ? '/main' : '/report' : '/main',
            })
        },
        // 关闭当前页面
        closePage() {
            window.WeixinJSBridge.call('closeWindow')
        },
        // 进度渐变完成
        onReady(instance, CountUp) {
            // 合成完成
            if (this.endVal === 100) {
                // 模型合成成功
                // 该条报告设置为已查看
                this.updateViewStatus()
                // 正在合成中的时候 等待加载100%跳转页面
                if (
                    this.loadResults.indexOf(this.biaStatus) > -1 ||
                    this.loadResults.indexOf(this.bdaStatus) > -1 ||
                    this.loadResults.indexOf(this.evalStatus) > -1
                ) {
                    this.bdaFalse = false
                } else {
                    // 重新加载
                    this.componentKey += 1
                    this.$refs.shadow.style.display = 'none'
                    this.bdaFalse = this.isFindHistory

                    setTimeout(() => {
                        this.loadingOver = true
                    }, 500)
                    // 如果体测失败 + 体态失败
                    // if (this.findScanType === 3) {
                    //     if (this.errorResults.indexOf(this.bmBiaResult) > -1
                    //         && this.errorResults.indexOf(this.bsResult) > -1) {
                    //         this.bdaFalse = true
                    //     }
                    // }
                    // this.bdaFalse = true
                }
            }
        },
        // 获取合成总进度
        getTotalPercent(data) {
            let { bmBiaScanInfo, bmBdaScanInfo, bsScanInfo, bsSpineScanInfo, scanId } = data
            if (scanId.slice(0, 2) === 'M6' || scanId.slice(0, 2) === 'M7' || scanId.slice(0, 2) === 'M2' || scanId.slice(0, 2) === 'N2' || data.scanId.slice(0, 2) === 'N7') {
                return this.getTotalPro5Percent(data)
            }
            let totalPercent = 0
            let bmBiaPercent = 0
            let bmBdaPercent = 0
            let bsPercent = 0
            // 体态脊椎数据合成状态
            let bsSpinePercent = 0
            // 进度总和
            let allPercent = 0
            // 非体测
            if (data.biaMeasure === 1) {
                // -1 -10 计算进度，其余都为100
                if (bmBiaScanInfo && this.loadResults.indexOf(bmBiaScanInfo.result) > -1) {
                    bmBiaPercent = bmBiaScanInfo.percent >= 100 ? 99 : bmBiaScanInfo.percent
                } else {
                    bmBiaPercent = 100
                }
            }

            // 非体态
            if (data.staticEval === 1) {
                if (bsScanInfo && this.loadResults.indexOf(bsScanInfo.result) > -1) {
                    bsPercent = bsScanInfo.percent >= 100 ? 99 : bsScanInfo.percent
                } else {
                    bsPercent = 100
                }
                if (bsSpineScanInfo && this.loadResults.indexOf(bsSpineScanInfo.result) > -1) {
                    bsSpinePercent = 70
                } else {
                    bsSpinePercent = 100
                }
                if (scanId.slice(0, 2) !== 'M5') {
                    if (bmBdaScanInfo && this.loadResults.indexOf(bmBdaScanInfo.result) > -1) {
                        bmBdaPercent = bmBdaScanInfo.percent >= 100 ? 99 : bmBdaScanInfo.percent
                    } else {
                        bmBdaPercent = 100
                    }
                }
            }
            if (scanId.slice(0, 2) === 'M5' && data.girthMeasure === 1) {
                if (bmBdaScanInfo && this.loadResults.indexOf(bmBdaScanInfo.result) > -1) {
                    bmBdaPercent = bmBdaScanInfo.percent >= 100 ? 99 : bmBdaScanInfo.percent
                } else {
                    bmBdaPercent = 100
                }
            }

            if (scanId.slice(0, 2) !== 'M5') {
                allPercent = bmBiaPercent + bsPercent * 0.5 + bmBdaPercent * 0.5
                // 向下取整
                if (data.biaMeasure === 1 && data.staticEval === 1) {
                    // 体测+体态
                    totalPercent = parseFloat((allPercent / 2).toFixed(1))
                } else {
                    // 体测或体态
                    totalPercent = parseFloat(allPercent.toFixed(1))
                }
            } else {
                allPercent = bsPercent * 0.5 + bsSpinePercent * 0.5 + bmBdaPercent
                // 向下取整
                if (data.girthMeasure === 1 && data.staticEval === 1) {
                    // 体测+体态
                    totalPercent = parseFloat((allPercent / 2).toFixed(1))
                } else {
                    // 体测或体态
                    totalPercent = parseFloat(allPercent.toFixed(1))
                }
                console.log(`当前进度${totalPercent}`)
            }
            return totalPercent
        },
        getTotalPro5Percent(data) {
            let { bmBiaScanInfo, bmBdaScanInfo, bsScanInfo, bsSpineScanInfo } = data
            const measureItems = [data.biaMeasure, data.staticEval, data.girthMeasure, bsSpineScanInfo ? 1 : 0]
            const measureItemStatus = [
                bmBiaScanInfo ? bmBiaScanInfo.result : null,
                bsScanInfo ? bsScanInfo.result : null,
                bmBdaScanInfo ? bmBdaScanInfo.result : null,
                bsSpineScanInfo ? bsSpineScanInfo.result : null
            ]
            const measureItemPercent = [
                bmBiaScanInfo ? bmBiaScanInfo.percent : null,
                bsScanInfo ? bsScanInfo.percent : null,
                bmBdaScanInfo ? bmBdaScanInfo.percent : null,
                bsSpineScanInfo ? bsSpineScanInfo.result === 1 ? 100 : 60 : null
            ]
            let itemCount = 0
            let totalPercent = 0
            for (let i = 0; i < measureItems.length; i++) {
                const item = measureItems[i]
                const itemStatus = measureItemStatus[i]
                const percent = measureItemPercent[i] >= 100 ? 99 : measureItemPercent[i]
                if (item === 1) {
                    itemCount = itemCount + 1
                    if (this.loadResults.indexOf(itemStatus) > -1) {
                        totalPercent = totalPercent + percent
                    } else {
                        totalPercent = totalPercent + 100
                    }
                }
            }
            console.log(`当前进度${totalPercent} ${itemCount}`)
            return itemCount === 0 ? 0 : parseFloat((totalPercent / itemCount).toFixed(1))
        },
        // 更新modelInfo，缓存
        updateModelInfo(data, isHistory) {
            let baseInfo = null
            if (isHistory) {
                baseInfo = {
                    scanId: this.findHistory.scanId,
                    memberId: this.findHistory.memberId,
                    biaMeasure: this.findHistory.biaMeasure,
                    staticEval: this.findHistory.staticEval,
                    createTime: this.findHistory.createTime,
                    shoulderEval: this.findHistory.shoulderJointEval,
                    girthMeasure: this.findHistory.girthMeasure,
                    scanMode: this.findHistory.scanMode,
                    questionReport: this.findHistory.questionReport,
                    bsSpineStatus: this.findHistory.bsSpineStatus,
                    teenagerReport: this.findHistory.teenagerReport,
                    spineReport: this.findHistory.spineReport,
                    mpRecommend: this.findHistory.mpRecommend,
                    isPillowRecommendReport: this.findHistory.isPillowRecommendReport,
                }
            } else {
                baseInfo = {
                    scanId: this.scanTypeInfo.scanId,
                    memberId: this.scanTypeInfo.memberId,
                    biaMeasure: this.scanTypeInfo.biaMeasure,
                    staticEval: this.scanTypeInfo.staticEval,
                    createTime: this.scanTypeInfo.createTime,
                    shoulderEval: this.scanTypeInfo.shoulderJointEval,
                    girthMeasure: this.scanTypeInfo.girthMeasure,
                    scanMode: this.scanTypeInfo.scanMode,
                    questionReport: this.scanTypeInfo.questionReport,
                    bsSpineStatus: this.scanTypeInfo.bsSpineStatus ? this.scanTypeInfo.bsSpineStatus : 0,
                    teenagerReport: this.scanTypeInfo.teenagerReport,
                    spineReport: this.scanTypeInfo.spineReport,
                    mpRecommend: this.scanTypeInfo.mpRecommend,
                    isPillowRecommendReport: this.scanTypeInfo.isPillowRecommendReport,
                }
            }
            let modelInfo = Object.assign(baseInfo, data)
            window.localStorage.setItem('modelInfo', JSON.stringify(modelInfo))
            this.showTips(isHistory)
        },
        showTips(isHistory) {
            const data = isHistory ? this.findHistory : this.scanTypeInfo
            const scanMode = data.scanMode
            const nutritionStatus =
                scanMode === 1 && data.girthMeasure && (data.nutrition === 0 || data.nutrition === 1) ? 1 : 0
            const measureProject = [
                nutritionStatus,
                data.staticEval,
                data.biaMeasure,
                data.girthMeasure,
                data.shoulderJointEval,
            ]
            const measureProjectStatus = [
                data.bmBdaScanInfo ? data.bmBdaScanInfo.result : null,
                data.bsScanInfo ? data.bsScanInfo.result : null,
                data.bmBiaScanInfo ? data.bmBiaScanInfo.result : null,
                data.bmBdaScanInfo ? data.bmBdaScanInfo.result : null,
                data.bsShoulderScanInfo ? data.bsShoulderScanInfo.result : null,
            ]
            const projectName = ['无电流营养分析', '体态评估', '身体成分', '体围测量', '肩部功能']
            this.projectItems = []
            // 计算总共测量项目
            let measureItem = 0
            // 统计失败项目
            let failureItem = 0
            for (let index = 0; index < measureProject.length; index++) {
                const item = measureProject[index]
                const status = measureProjectStatus[index]
                if (item === 1) {
                    this.projectItems.push({
                        name: projectName[index],
                        status,
                    })
                    // 只有测量项目参与
                    measureItem = measureItem + 1
                    if ([0, 2].indexOf(status) > -1) {
                        // 测量失败
                        failureItem = failureItem + 1
                    }
                }
            }
            if (failureItem === measureItem) {
                this.tipsTitles = '您的测量报告合成未成功，请到设备端重新体验哦~'
                this.reportName = '查看上次报告'
            } else if (failureItem === 0) {
                this.tipsTitles = '您的报告已生成，可点击“查看报告”按钮查看~'
                this.reportName = '查看报告'
            } else {
                this.tipsTitles = '您的报告已生成，可点击“查看报告”按钮查看，\n未成功的项目请到设备端重新体验哦~'
                this.reportName = '查看报告'
            }
            console.log(`当前测量项目${JSON.stringify(this.projectItems)}`)
        },
        // 设置分享
        shareClick(scanId) {
            if (isWeiXin()) {
                console.log(`report---------->isWeiXin: ${isWeiXin()} isShare: ${this.isShare}`)
                const url = window.location.href.split('#')[0]
                const isShare = this.isShare
                this.$apollo
                    .query({
                        query: getWechatSignature,
                        variables: {
                            url: url,
                        },
                    })
                    .then((res) => {
                        const data = res.data.getWechatSignature
                        if (data && data.code === 200) {
                            const signatureInfo = data.data
                            const domain = getDomainFromString(url)
                            console.log(`==========domain:  ${domain}`)
                            let shareUrl = ''
                            if (isShare !== '1') {
                                shareUrl = `${domain}/shareAuth/shareCallBack?token=${signatureInfo.token}&scan_id=${scanId}`
                            } else {
                                shareUrl = url
                            }
                            console.log(
                                `========>url: ${url}  =======>scanId: ${scanId}   =======>shareUrl: ${shareUrl}`
                            )
                            wx.config({
                                debug: false,
                                appId: signatureInfo.appid, // 必填，公众号的唯一标识
                                timestamp: signatureInfo.timestamp, // 必填，生成签名的时间戳
                                nonceStr: signatureInfo.noncestr, // 必填，生成签名的随机串
                                signature: signatureInfo.signature, // 必填，签名
                                jsApiList: [
                                    'checkJsApi',
                                    'updateTimelineShareData',
                                    'updateAppMessageShareData',
                                    'showMenuItems',
                                    'hideMenuItems',
                                ],
                            })
                            wx.ready(function () {
                                wx.checkJsApi({
                                    jsApiList: [
                                        'updateTimelineShareData',
                                        'updateAppMessageShareData',
                                        'showMenuItems',
                                        'hideMenuItems',
                                    ],
                                    success(res) {
                                        if (res.checkResult.getLocation === false) {
                                            console.log('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本')
                                            this.$toast({
                                                message: '你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本',
                                                duration: 3000,
                                            })
                                        } else {
                                            if (isShare !== '1') {
                                                console.log('显示分享菜单=========report')
                                                wx.showMenuItems({
                                                    menuList: [
                                                        'menuItem:share:appMessage',
                                                        'menuItem:share:timeline',
                                                        'menuItem:share:qq',
                                                        'menuItem:share:QZone',
                                                        'menuItem:share:weiboApp',
                                                    ],
                                                })
                                                wx.updateAppMessageShareData({
                                                    title: signatureInfo.title, // 分享标题
                                                    desc: signatureInfo.desc, // 分享描述
                                                    link: shareUrl, // 分享链接，与公众号JS安全域名一致
                                                    imgUrl: signatureInfo.imgUrl, // 分享图标
                                                    success: function () {},
                                                })

                                                wx.updateTimelineShareData({
                                                    title: signatureInfo.title, // 分享标题
                                                    link: shareUrl, // 分享链接，与公众号JS安全域名一致
                                                    imgUrl: signatureInfo.imgUrl, // 分享图标
                                                    success: function () {},
                                                })
                                            } else {
                                                console.log('隐藏分享菜单=========report')
                                                wx.hideMenuItems({
                                                    menuList: [
                                                        'menuItem:share:appMessage',
                                                        'menuItem:share:timeline',
                                                        'menuItem:share:qq',
                                                        'menuItem:share:QZone',
                                                        'menuItem:share:weiboApp',
                                                    ],
                                                })
                                            }
                                        }
                                    },
                                    fail(res) {
                                        const message = 'checkJsApi fail=' + JSON.stringify(res)
                                        this.$toast({
                                            message: message,
                                            duration: 3000,
                                        })
                                        console.log(message)
                                    },
                                })
                            })
                            wx.error(function (res) {
                                console.log('错误：' + res)
                            })
                        }
                    })
            }
        },
    },
}
</script>
<style scoped lang="less">
.bdaFalse {
    visibility: hidden;
}

.model-generating {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(180deg, #262849, #07090f);
    font-size: 14px;
    color: #fff;

    .generation-waiting {
        position: relative;
        width: 100%;
        height: 385px;
        padding-top: 30px;
        z-index: 0;

        .three-dimensional-bg {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 76px;
            background: url(../../assets/images/sidebar/model/ground_bg.png) no-repeat;
            background-size: cover;
            z-index: 1;
        }
    }

    .generation-waiting-100 {
        height: auto !important;
        padding-bottom: 10px;
    }
}

.body-box {
    display: inline-block;
    height: 265px;
    background: url(../../assets/images/sidebar/model/moxing_bg.png) no-repeat center bottom;
    background-size: 125px 50px;
    width: 50%;

    img {
        display: none !important;
    }
}

.body-model {
    position: relative;
    z-index: 10;

    img {
        width: 112px;
        margin-top: 10px;
        // 禁止部分安卓机下图片自动放大
        pointer-events: none;
    }
}

.speed-shadow {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 99;
    width: 100%;
    height: 290px;
    overflow: hidden;

    .speed-box {
        position: absolute;
        top: 0;
        animation: go 12s linear normal infinite;
        z-index: 100;
        width: 100%;
        height: 200px;

        // border-top: 1px solid rgba(0, 227, 201, .4);
        .speed-padd {
            position: relative;
            width: 100%;
            height: 100%;
            background-image: linear-gradient(180deg, rgb(0, 227, 201), rgba(0, 0, 0, 0.1));
            opacity: 0.09;
            z-index: 111;
        }
    }
}

.hint-info {
    padding-top: 25px;
    text-align: center;
}

.entry-report-but {
    display: inline-block;
    width: 200px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    border-radius: 6px;
    background-image: linear-gradient(to right, #00e3c9, #00a4e6);
    margin-top: 20px;
}

.hint-msg {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .top-tips {
        display: flex;
        width: 315px;
        flex-wrap: wrap;
        justify-content: flex-start;
        .project-box {
            margin: 4px 0;
            width: 105px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .project-name {
            // font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 12px;
            color: #adb4c7;
            line-height: 17px;
            text-align: left;
            font-style: normal;
            margin-left: 8px;
        }
        .project-box-center {
            justify-content: center;
        }
    }
    .top-tip-center {
        justify-content: center;
    }
    .isDeviceReport{
        img{
            width: 12px;
            height: 12px;
        }
    }
}

.msg-title {
    font-size: 16px;
    padding-bottom: 10px;
}

.msg-cont {
    font-size: 12px;
    line-height: 1.5;
    height: 50px;
}

.msg-success {
    font-size: 12px;
    line-height: 1.5;
    margin-top: 12px;
    white-space: pre-line;
}

.data-title {
    padding-bottom: 10px;
    .num {
        font-size: 24px;
    }
}

@keyframes go {
    0% {
        top: 300px;
    }

    100% {
        top: -300px;
    }
}
</style>
<style lang="less">
.loading-tips {
    position: relative;
    height: 130px;

    .mint-swipe-item {
        padding: 0 48px;
    }

    .mint-swipe-indicators {
        bottom: 0px;

        .mint-swipe-indicator {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(225, 225, 225, 0.2);
            opacity: 1;

            &.is-active {
                background-image: linear-gradient(to bottom, #00e3c9, #00a4e6);
            }
        }
    }
}
</style>
