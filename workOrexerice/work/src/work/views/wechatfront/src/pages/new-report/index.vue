<!--
 * @Author: DonWang wangwenqiu@suanier.com
 * @Date: 2023-07-05 17:22:12
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2026-01-19 17:16:21
 * @FilePath: \vr-pro3-wechat-frontend\src\pages\new-report\index.vue
 * @Description:
-->
<template>
    <div class="report-wrapper fix-background">
        <div class="section">
            <div class="header-menu">
                <div v-if="isShare !== '1' && !isDeviceReport" @click="openSide()">
                    <img src="@/assets/images/new-report/sidebar/report_leftber_Info@2x.png" alt class="menu-info" />
                </div>
                <div v-else></div>
                <!-- 右边按钮 -->
                <div class="right-menu">
                    <div v-if="isShare !== '1' && (isVRPro5 || isVAPro5 || isVAPro7)" @click="goToShare()">
                        <nav>
                            <img src="@/assets/images/new-report/sidebar/history@2x.png" alt class="right-menu-icon" />
                        </nav>
                    </div>
                </div>
            </div>
            <!-- 标签页 -->
            <van-tabs v-model="activeName" @click="onClick" sticky :ellipsis="false">
                <div class="content-menu">
                    <!-- v-if="!showPillowQuestions && !showPillowReportError" -->
                    <span class="time"><img v-if="athlete && activeName == 'body'" class="athlete-icon" src="@/assets/images/athlete.svg"/>{{ scanTime }}</span>
                    <!-- <span class="time" v-else></span> -->
                    <!-- 右边按钮 -->
                    <div v-if="loading" class="right-menu">
                        <nav class="last-trend" @click="goTrend" v-if="trendStatus">
                            <img src="@/assets/images/new-report/report/trend.png" alt class="left-icon" />
                        </nav>
                        <!-- <nav class="send-report" @click="sendReport">
                            <img src="@/assets/images/new-report/report/mail-line.png" alt class="right-icon" />
                        </nav>-->
                    </div>
                </div>
                <!-- 用户信息 v-if="!showPillowQuestions && !showPillowReportError" -->
                <div>
                    <InfoTwo v-if="showTwoTitle" :scanId="massInfo.scanId" />
                    <info v-else :scanId="massInfo.scanId"></info>
                </div>
                <van-tab title="智眠报告" name="pillowReport" v-if="massInfo.spineReport === 1 && massInfo.isPillowRecommendReport === 1 && massInfo.staticEval === 1 && massInfo.girthMeasure === 1" >
                    <template v-if="!showPillowReportError && pillowReportModel">
                        <pillow-questions v-if="showPillowQuestions " from="report" @callback="onPillowQuestionFinish"></pillow-questions>
                        <pillow-report :isShow="activeName === 'pillowReport'" v-else-if="loadingPillowAnswers" :scanId="massInfo.scanId" :answers="pillowAnswers" @onError="onPillowReportError"></pillow-report>
                    </template>
                    <template v-else>
                        <div class="pillow-report-error">
                            <img src="@/assets/images/new-report/pillow-report/error-tips.png" alt class="right-icon" />
                            <label>智眠报告失败</label>
                            <p>本次测量数据异常，无法生成智眠报告，请您重新测量一次。</p>
                        </div>
                    </template>

                </van-tab>
                <van-tab title="无电流营养分析" name="analysis" v-if="isAnalysis">
                    <!-- 无电流营养分析 -->
                    <div>
                        <nutri-analysis :scanId="massInfo.scanId"></nutri-analysis>
                    </div>
                </van-tab>
                <van-tab :title="$t('mass.titles')" name="body"
                    v-if="massInfo.biaMeasure == 1 && massInfo.biaStatus == 1">
                    <!-- <div>
                        <bodyScore v-if="healthPackageEnable === '2'" :scoreType="1" :massInfo="massInfo" :isStatus="isStatus"></bodyScore>
                    </div> -->
                    <div v-if="dataArrayMass.length > 1">
                        <body-item :isCreateTime="createTime" @sendTsScanId="sendTsScanId"></body-item>
                    </div>
                    <div>
                        <!-- 身体成分数据 -->
                        <body-data :massInfo="massInfo" :styleContent="dataArrayMass.length" :tcScanId="massTsScanId"
                            @measureType="getMeasureType"></body-data>
                    </div>
                </van-tab>
                <van-tab title="体态评估" name="posture"
                    v-if="massInfo.staticEval == 1 && massInfo.evalStatus == 1 && healthPackageEnable !== '2'">
                    <div>
                        <shape-item v-if="shapeModel" :assess="(isVAPro7 || isNewMathTt) ? assessNew : assess"></shape-item>
                    </div>
                    <!-- 评估总览 -->
                    <div>
                        <assessment :scoreType="2" :massInfo="massInfo" :isStatus="isStatus"></assessment>
                    </div>
                    <!-- 数据对比 -->
                    <div>
                        <shape-data :massInfo="massInfo" @assessProblem="assessProblem"></shape-data>
                    </div>
                </van-tab>
                <van-tab title="体围测量" name="bodyround" v-if="massInfo.girthMeasure == 1 && massInfo.bdaStatus == 1">
                    <!-- 体围测量 -->
                    <div>
                        <girth-item v-if="dispalyModel" :isCreateTime="createTime"></girth-item>
                    </div>
                </van-tab>
                <van-tab title="肩部功能" name="shoulder" v-if="(massInfo.shoulder == 1 || massInfo.shoulderEval == 1) &&
                    (massInfo.bsShoulderScanResult == 1 || massInfo.bsShoulderStatus == 1)">
                    <!-- 肩部结论 -->
                    <div>
                        <shoulder-data :massInfo="massInfo"></shoulder-data>
                    </div>
                    <div>
                        <shoulder-item :massInfo="massInfo"></shoulder-item>
                    </div>
                </van-tab>
                <van-tab title="体型预测" name="prediction"
                    v-if="massInfo.biaMeasure == 1 && massInfo.bdaStatus == 1 && massInfo.biaStatus == 1 && isVAPro7">
                    <!-- 体型预测 -->
                    <div>
                        <prediction-item></prediction-item>
                        <prediction-data></prediction-data>
                    </div>
                </van-tab>
                <van-tab title="腰腹围度" name="waistline"
                    v-if="massInfo.girthMeasure == 1 && massInfo.bdaStatus == 1 && healthPackageEnable === '2' && isVAPro5 && !!waistdata">
                    <!-- 腰腹围度 -->
                    <div>
                        <waist-item v-if="waistmodel" :isCreateTime="createTime"></waist-item>
                    </div>
                </van-tab>
                <van-tab title="体态评估" name="posture"
                    v-if="massInfo.staticEval == 1 && massInfo.evalStatus == 1 && healthPackageEnable == '2'">
                    <div>
                        <shape-item v-if="shapeModel" :assess="(isVAPro7 || isNewMathTt) ? assessNew : assess"></shape-item>
                    </div>
                    <!-- 评估总览 -->
                    <div>
                        <assessment :scoreType="2" :massInfo="massInfo" :isStatus="isStatus"></assessment>
                    </div>
                    <!-- 数据对比 -->
                    <div>
                        <shape-data :massInfo="massInfo" @assessProblem="assessProblem"></shape-data>
                    </div>
                </van-tab>
                <van-tab title="脊柱评估" name="spine" v-if="massInfo.spineReport && massInfo.bsSpineStatus === 1">
                    <!-- 脊柱结构化 -->
                    <spineView v-if="activeName === 'spine'" :massInfo="massInfo"></spineView>
                    <!-- 脊柱异常评估 -->
                    <spineAssessment :spinalData="spinalData" :utype="spinalData.type"></spineAssessment>
                    <!-- 疼痛风险评估 -->
                    <spineRisk v-if="spinalData.type !== 0" :painRisk="spinalData.painRisk"></spineRisk>
                    <!-- 盆骨风险评估 -->
                    <pelvisRisk v-if="spinalData.type === 2" :pelvicRisk="spinalData.pelvicRisk"></pelvisRisk>
                    <!-- 青少年脊柱专项风险评估 v-if="spinalData.type === 0-->
                    <youngRisk v-if="spinalData.type === 0" :youthSpineDetail="spinalData.youthSpineDetail"></youngRisk>
                    <!-- 枕头推荐 v-if="spinalData.type === 0-->
                    <pillowRec v-if="massInfo.mpRecommend" :mattressRec="spinalData.mattressRec"
                        :pillowRec="spinalData.pillowRec"></pillowRec>
                    <!-- 锚点 -->
                    <anchorBtns v-if="false"></anchorBtns>
                    <appFooter></appFooter>
                </van-tab>
                <van-tab title="成长专项" name="YoungGrow"
                    v-if="massInfo.spineReport && massInfo.bsSpineStatus === 1 && massInfo.teenagerReport === 1 && scanIdAge <= 18">
                    <YoungGrow :massInfo="massInfo" :scanIdAge="scanIdAge"/>
                </van-tab>
            </van-tabs>
            <!--侧边栏-->
            <van-popup v-model="popupVisible" position="left" :style="{ height: '100%', width: '70%' }">
                <SideBar />
            </van-popup>
        </div>
        <div class="fixedBox"></div>
        <div class="spring-frame" v-if="springStatus" style="background: #000000; opacity: 0.54"></div>
        <div class="spring-frame" v-if="springStatus">
            <div class="spring-frame-box">
                <h6>{{ $t('reportTips.alaryTips') }}</h6>
                <button @click="changeStatus()">{{ $t('reportTips.btnMsg') }}</button>
            </div>
        </div>
        <!-- 处理vrpro5 -->
        <img v-if="aiStatue.abnormalKeywordInterpret !== null" class="ai-entrance" src="@/assets/images/ai3.png" alt=""
            @click="goAi()">
    </div>
</template>
<script>
import { mapState } from 'vuex'
import SideBar from '@/components/sidebar/Detail'
import {
    findScanTypeInfo,
    getWechatSignature,
    getScanIdGetInfo,
    bmWaistInfo,
    obSpineConclusion,
    getScanIdAge,
    getAIState,
    getPillowReportQaByScanId
} from '@/assets/js/apolloGql.js'
import Info from '@/components/user/new-report/Info'
import InfoTwo from '@/components/user/new-report/InfoTwo'
import GirthItem from '@/components/body/new-report/GirthItem'
import ShoulderData from '@/components/body/new-report/ShoulderData'
import ShoulderItem from '@/components/body/new-report/ShoulderItem'
// 体态评估
import ShapeItem from '@/components/body/new-report/ShapeItem'
import ShapeData from '@/components/body/new-report/ShapeData'
import Assessment from '@/components/common/new-report/Assessment'
import BodyScore from '@/components/common/new-report/BodyScore'
import wx from 'weixin-js-sdk'
import { isWeiXin, getDomainFromString, formatMinutes } from '@/assets/js/util.js'
import { isVAPro3, isVAPro5, isVAPro7, isVRPro5 } from '@/types/device.js'
import NutriAnalysis from '../../components/body/new-report/NutriAnalysis.vue'
import BodyData from '@/components/body/new-report/BodyData'
import BodyItem from '@/components/body/new-report/BodyItem'
import PredictionItem from '@/components/body/new-report/predictionitem'
import PredictionData from '@/components/body/new-report/predictionData'
// import PredictionItem from '../../components/body/PredictionItem.vue'
import WaistItem from '../../components/body/new-report/WaistItem.vue'
// import vConsole from '@/assets/js/vconsole'
import spineView from "../../components/GrownMan/spineView.vue"
import spineAssessment from "../../components/GrownMan/spineAssessment.vue"
import spineRisk from "../../components/GrownMan/spineRisk.vue"
import anchorBtns from "../../components/GrownMan/anchorBtns.vue"
import appFooter from "../../components/public/foot.vue"
import pelvisRisk from "../../components/GrownMan/pelvisRisk.vue"
import youngRisk from "../../components/young/young.vue"
import pillowRec from "../../components/GrownMan/pillowRec.vue"
// 青少年专项报告
import YoungGrow from '@/components/YoungGrow/index'
// 智眠报告
import PillowReport from '@/components/body/new-report/PillowReport'
import PillowQuestions from '@/components/PillowQuestions/index.vue'

export default {
    components: {
        SideBar,
        Info,
        InfoTwo,
        GirthItem,
        ShoulderData,
        ShoulderItem,
        ShapeItem,
        ShapeData,
        Assessment,
        NutriAnalysis,
        BodyData,
        BodyItem,
        PredictionItem,
        PredictionData,
        // PredictionItem,
        WaistItem,
        BodyScore,
        spineView,
        spineAssessment,
        spineRisk,
        anchorBtns,
        appFooter,
        pelvisRisk,
        youngRisk,
        pillowRec,
        YoungGrow,
        PillowReport,
        PillowQuestions
    },
    data() {
        return {
            scanIdAge: 0,
            springStatus: false,
            popupVisible: false,
            healthPackageEnable: window.localStorage.getItem('healthPackageEnable'),
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport'),
            // 历史信息
            massInfo: { biaMeasure: 0, staticEval: 0, shoulder: 0, girthMeasure: 0 },
            loading: true,
            scanTime: '',
            isAssess: false,
            createTime: '',
            // 标题名称
            activeName: 'posture',
            dispalyModel: true,
            waistmodel: true,
            shapeModel: true,
            pillowReportModel: true,
            // 是否分享进入
            isShare: 0,
            prediction: {
                weight: '80.6',
                fat: '80.6',
                muscle: '100.6',
            },
            athlete: 0,
            // 体态评估
            assess: [
                {
                    title: this.$t('shape.models.front'),
                    list: [
                        {
                            name: this.$t('shape.explain[1].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['headSlant'],
                            errorPoints: ['keyPoint0', 'keyPoint4'],
                        },
                        {
                            name: this.$t('shape.explain[8].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['rightLegXOUp', 'rightLegXODown', 'leftLegXOUp', 'leftLegXODown'],
                            errorPoints: [
                                'keyPoint8',
                                'keyPoint9',
                                'keyPoint10',
                                'keyPoint11',
                                'keyPoint12',
                                'keyPoint13',
                            ],
                        },
                    ],
                },
                {
                    title: this.$t('shape.models.left'),
                    list: [
                        {
                            name: this.$t('shape.explain[0].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['headForward'],
                            errorPoints: ['keyPoint0', 'keyPoint4'],
                        },
                        {
                            name: this.$t('shape.explain[2].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['roundShoulderLeft'],
                            errorPoints: ['keyPoint16', 'keyPoint1'],
                        },
                        {
                            name: this.$t('shape.explain[5].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['pelvisForwardUp', 'pelvisForwardDown'],
                            errorPoints: ['keyPoint4', 'keyPoint15', 'keyPoint6'],
                        },
                        {
                            name: this.$t('shape.explain[6].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['leftKneeCheckUp', 'leftKneeCheckDown'],
                            errorPoints: ['keyPoint11', 'keyPoint12', 'keyPoint13'],
                        },
                    ],
                },
                {
                    title: this.$t('shape.models.top'),
                    list: [
                        {
                            name: this.$t('shape.explain[4].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['highLowShoulder'],
                            errorPoints: ['keyPoint2', 'keyPoint5'],
                        },
                    ],
                },
                {
                    title: this.$t('shape.models.right'),
                    list: [
                        {
                            name: this.$t('shape.explain[3].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['roundShoulderRight'],
                            errorPoints: ['keyPoint18', 'keyPoint3'],
                        },
                        {
                            name: this.$t('shape.explain[7].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['rightKneeCheckUp', 'rightKneeCheckDown'],
                            errorPoints: ['keyPoint8', 'keyPoint9', 'keyPoint10'],
                        },
                    ],
                },
            ],
            // 体态评估
            assessNew: [
                {
                    title: this.$t('shape.models.front'),
                    list: [
                        {
                            name: this.$t('shape.explain[1].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['headSlant'],
                            errorPoints: [
                                'left_ear_point',
                                'right_ear_point',
                                'right_body_gravity_line_point',
                                'left_body_gravity_line_point',
                            ],
                        },
                        {
                            name: this.$t('shape.explain[8].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: [
                                'rightLegXOUp',
                                'rightLegXODown',
                                'leftLegXOUp',
                                'leftLegXODown',
                                'leftLegXO',
                                'rightLegXO',
                            ],
                            errorPoints: [
                                'left_knee_joint_point',
                                'left_hip_joint_point',
                                'left_ankle_point',
                                'right_knee_joint_point',
                                'right_hip_joint_point',
                                'right_ankle_point',
                            ],
                        },
                    ],
                },
                {
                    title: this.$t('shape.models.left'),
                    list: [
                        {
                            name: this.$t('shape.explain[2].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['roundShoulderLeft'],
                            errorPoints: [
                                'left_acromion_point',
                                'left_body_gravity_line_point',
                                'left_acromion_point1',
                                'left_body_gravity_line_point1',
                            ],
                        },
                        {
                            name: this.$t('shape.explain[6].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['leftKneeCheckUp', 'leftKneeCheckDown'],
                            errorPoints: ['left_hip_joint_point', 'left_knee_joint_below_point', 'left_ankle_point'],
                        },
                    ],
                },
                {
                    title: this.$t('shape.models.top'),
                    list: [
                        {
                            name: this.$t('shape.explain[4].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['highLowShoulder', 'highLowShoulderLeft', 'highLowShoulderRight'],
                            errorPoints: [
                                'left_shoulder_neck_root_point',
                                'left_acromion_point',
                                'right_shoulder_neck_root_point',
                                'right_acromion_point',
                            ],
                        },
                    ],
                },
                {
                    title: this.$t('shape.models.right'),
                    list: [
                        {
                            name: this.$t('shape.explain[3].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['roundShoulderRight'],
                            errorPoints: [
                                'right_acromion_point',
                                'right_body_gravity_line_point',
                                'right_acromion_point1',
                                'right_body_gravity_line_point1',
                            ],
                        },
                        {
                            name: this.$t('shape.explain[7].title'),
                            status: this.$t('shape.item.normal'),
                            errorLines: ['rightKneeCheckUp', 'rightKneeCheckDown'],
                            errorPoints: ['right_hip_joint_point', 'right_knee_joint_below_point', 'right_ankle_point'],
                        },
                    ],
                },
            ],
            // 是否有骨盆-体态模式
            isStatus: false,
            isVAPro3: isVAPro3(),
            isVAPro5: isVAPro5(),
            isVAPro7: isVAPro7(),
            isVRPro5: isVRPro5(),
            measureType: 1,
            massTsScanId: '',
            waistdata: '',
            spinalData: {}, // 脊柱专项
            // 是否为新算法
            isNewMathTt: 0,
            isNewStatus: false,
            // 是否显示ai解读按钮
            aiUrl: '',
            aiStatue: {
                abnormalKeywordInterpret: null,
                abnormalConclusionInterpret: null,
                abnormalOutlineInterpret: null
            },
            showPillowQuestions: false,
            showPillowReportError: false,
            pillowAnswers: null,
            loadingPillowAnswers: false,
        }
    },
    computed: {
        ...mapState(['historyData', 'dataArray', 'dataArrayMass', 'sidebarData', 'historyScanId']),

        // 格式化报告时间
        reportTime() {
            return formatMinutes(new Date(this.modelInfo.createTime * 1000))
        },
        isAnalysis() {
            console.log(`当前数据${JSON.stringify(this.massInfo)}`)
            return (
                this.massInfo.girthMeasure === 1 &&
                this.massInfo.bdaStatus &&
                this.massInfo.scanMode &&
                (this.isVAPro3 || this.isVAPro5) &&
                this.massInfo.questionReport &&
                (this.massInfo.nutrition === 0 || this.massInfo.nutrition === 1)
            )
        },
        trendStatus() {
            // 体围和体成分显示
            return this.activeName === 'bodyround' || this.activeName === 'body'
        },
        memberInfo() {
            const memberInfo = window.localStorage.get('memberInfo')
            if (memberInfo) {
                return JSON.parse(memberInfo)
            } else {
                return {}
            }

        },
        // 展示第二种表头
        showTwoTitle() {
            if (this.isVAPro5) {
                if (this.massInfo.girthMeasure !== 1 || this.massInfo.bdaStatus !== 1) {
                    if (this.activeName === 'spine' || this.activeName === 'posture' || this.activeName === 'YoungGrow') {
                        return true
                    } else {
                        return false
                    }
                } else {
                    if (this.activeName === 'YoungGrow') {
                        return true
                    } else {
                        return false
                    }
                }
            } else {
                return false
            }
        }
    },
    created() {
        // 页面创建
        let modelInfo = window.localStorage.getItem('modelInfo')
        this.isShare = sessionStorage.getItem('isShare')
        if (modelInfo === null) {
            this.$router.push({ path: '/' })
            return
        }
        if (this.$route.params.type === 1) {
            this.popupVisible = true
        }
        // 更新测量信息
        let masseursDate = ''
        // console.log('9999999', typeof (this.$route.query.type), ['1', 1].includes(this.$route.query.type), this.historyData)
        if (this.historyData.createTime && ['1', 1].includes(this.$route.query.type)) {
            masseursDate = this.historyData.createTime
            this.massInfo = this.historyData
            this.$store.commit('setHistoryScanId', this.massInfo.scanId)
        } else {
            this.$store.commit('setHistoryScanId', '')
            if (this.$route.params.type === 1) {
                if (this.sidebarData) {
                    masseursDate = this.sidebarData.createTime
                    this.massInfo = this.sidebarData
                }
            } else {
                masseursDate = this.modelInfo.createTime
                this.massInfo = this.modelInfo
            }
        }
        if (this.massInfo.spineReport === 1 && this.massInfo.isPillowRecommendReport === 1 && this.massInfo.staticEval === 1 && this.massInfo.girthMeasure === 1) {
            this.showPillowReportError = !(this.massInfo.evalStatus === 1 && this.massInfo.bsSpineStatus === 1 && this.massInfo.bdaStatus === 1)
            this.getPillowReportQa()
        }
        this.scanTime = this.$moment(masseursDate * 1000).format('YYYY/MM/DD HH:mm')
        this.createTime = this.$moment(masseursDate * 1000).format('YYYY/MM/DD')
        this.getScanIdGetInfo()
        this.getbmWaistInfo()
    },
    mounted() {
        this.queryScanId()
        if (this.$router.afterHooks.length > 0) {
            // 防止移除与分享无关的钩子方法
            let afterHooks = []
            for (let i = 0; i < this.$router.afterHooks.length; i++) {
                if (this.$router.afterHooks[i].name !== 'bound shareAfterHooks') {
                    afterHooks.push(this.$router.afterHooks[i])
                }
            }
            this.$router.afterHooks = afterHooks
        }
        this.$router.afterEach(this.shareAfterHooks)
        this.shareClick()
        // 选择默认
        this.getFirstTab()
        this.getSpineReport()
        this.getScanIdAge()
        this.getAIStateFun()
    },
    methods: {
        onPillowReportError() {
            this.showPillowReportError = true
        },
        getPillowReportQa(cb) {
            this.$apollo
                .query({
                    query: getPillowReportQaByScanId,
                    variables: {
                        scanId: this.modelInfo.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const info = res.data.getPillowReportQaByScanId
                    this.showPillowQuestions = !info.data
                    if (info.data) {
                        this.pillowAnswers = info.data.answers ? JSON.parse(info.data.answers) : null
                    }
                    cb && cb()
                    this.loadingPillowAnswers = true
                })
        },
        onPillowQuestionFinish() {
            this.getPillowReportQa(() => {
                this.showPillowQuestions = false
            })
        },
        goAi() {
            window.location.href = this.aiUrl
        },
        getAIStateFun() {
            this.$apollo
                .query({
                    query: getAIState,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const date = res.data.getAIState
                    if (date.code === 200) {
                        this.aiUrl = date.data.aiUrl
                        this.aiStatue.abnormalKeywordInterpret = date.data.abnormalKeywordInterpret
                        this.aiStatue.abnormalConclusionInterpret = date.data.abnormalConclusionInterpret
                        this.aiStatue.abnormalOutlineInterpret = date.data.abnormalOutlineInterpret
                    }
                })
        },
        // 获取报告时的年龄
        getScanIdAge() {
            this.$apollo
                .query({
                    query: getScanIdAge,
                    variables: {
                        scanId: this.massInfo.scanId,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const data = res.data.getScanIdAge
                    console.log('???', 'AGE', data)
                    if (data && data.code === 200) {
                        this.scanIdAge = data.data.age
                    }
                }).catch(e => {
                    console.log('AAAAAAAAAAAAAAAAAA', e)
                })
        },
        getSpineReport() {
            if (this.massInfo.spineReport) {
                this.$apollo
                    .query({
                        query: obSpineConclusion,
                        variables: {
                            scanId: this.massInfo.scanId,
                        },
                        fetchPolicy: 'network-only',
                    })
                    .then((res) => {
                        const data = res.data.obSpineConclusion
                        if (data && data.code === 200) {
                            this.spinalData = data.data
                        }
                    })
            }
        },
        getMeasureType(type) {
            this.measureType = type
        },
        sendTsScanId(scanID) {
            this.massTsScanId = scanID
        },
        // 判断第一个tab
        getFirstTab() {
            console.log(`获取到数据${JSON.stringify(this.massInfo)}`)
            if (this.massInfo.spineReport === 1 && this.massInfo.isPillowRecommendReport === 1 && this.massInfo.staticEval === 1 && this.massInfo.girthMeasure === 1) {
                this.activeName = 'pillowReport'
            } else if (this.isAnalysis) {
                this.activeName = 'analysis'
            } else if (this.massInfo.biaMeasure === 1 && this.massInfo.biaStatus === 1) {
                this.activeName = 'body'
            } else if (
                this.massInfo.staticEval === 1 &&
                this.massInfo.evalStatus === 1 &&
                this.healthPackageEnable !== '2'
            ) {
                this.activeName = 'posture'
            } else if (this.massInfo.girthMeasure === 1 && this.massInfo.bdaStatus === 1) {
                this.activeName = 'bodyround'
            } else if (
                (this.massInfo.shoulder === 1 || this.massInfo.shoulderEval === 1) &&
                (this.massInfo.bsShoulderScanResult === 1 || this.massInfo.bsShoulderStatus === 1)
            ) {
                this.activeName = 'shoulder'
            }
        },
        // 获取模块配置信息
        getScanIdGetInfo() {
            this.$apollo
                .query({
                    query: getScanIdGetInfo,
                    variables: {
                        scanId: this.massInfo.scanId,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const data = res.data.getScanIdGetInfo
                    window.localStorage.setItem('reportMode', data.data)
                    this.isStatus = data.data.indexOf('010') > -1 && (this.massInfo.scanMode || (this.massInfo.scanId.split('-')[0].slice(0, 2) !== 'M6' && this.modelInfo.scanId.split('-')[0].slice(0, 2) !== 'M2' && this.modelInfo.scanId.split('-')[0].slice(0, 2) !== 'N2'))
                })
        },
        changeStatus() {
            this.springStatus = false
            this.$router.push({
                path: '/',
                query: {
                    type: 1,
                },
            })
        },
        // 展开侧边栏
        openSide() {
            console.log('打开侧边栏')
            this.$store.commit('setSidebarData', this.massInfo)
            this.popupVisible = true
        },
        // 跳转历史页面
        goToShare() {
            this.$router.push({
                path: '/report/historyPage',
            })
        },
        // 趋势图按钮
        goTrend() {
            if (this.activeName === 'bodyround') {
                this.$router.push('/girth/trend')
            } else {
                console.log(`传入参数${this.measureType}`)
                this.$router.push({
                    path: '/new-body/trend',
                    query: {
                        measureType: this.measureType,
                    },
                })
            }
        },
        sendReport() {
            // eslint-disable-next-line object-curly-spacing
            this.$router.push({ path: '/report/send', query: { type: this.$route.query.type } })
        },
        async queryScanId() {
            console.log(`当前id ${this.historyScanId}  ${this.massInfo.scanId}`)
            if (typeof this.historyScanId === 'undefined' && typeof this.massInfo.scanId === 'undefined') {
                return
            }
            const scanResult = await this.$apollo.query({
                query: findScanTypeInfo,
                fetchPolicy: 'network-only',
                variables: {
                    scanId: this.historyScanId ? this.historyScanId : this.massInfo.scanId,
                },
            })

            const scanResultData = scanResult.data.findScanTypeInfo
            this.isNewMathTt = scanResultData.data.isNewMathTt
            this.athlete = scanResultData.data.athlete
            this.$store.commit('setIsNewMathTt', scanResultData.data.isNewMathTt)
            try {
                this.scanTime = this.$moment(scanResultData.data.createTime * 1000).format('YYYY/MM/DD HH:mm')
                window.localStorage.setItem('scanMode', JSON.stringify(scanResultData.data.scanMode))
            } catch (e) {
                console.log(`请求失败${e}`)
            }
            console.log(`请求失败${this.scanTime}`)
            // this.lastScanTime =
            if (scanResultData.code === 404) {
                this.springStatus = true
                return
            }
        },
        async onClick(name) {
            console.log('OnClickName', name)
            const scanResult = await this.$apollo.query({
                query: findScanTypeInfo,
                fetchPolicy: 'network-only',
                variables: {
                    scanId: this.historyScanId ? this.historyScanId : this.massInfo.scanId,
                },
            })

            const scanResultData = scanResult.data.findScanTypeInfo
            if (scanResultData.code === 404) {
                this.springStatus = true
                return
            }
            this.dispalyModel = false
            this.waistmodel = false
            this.shapeModel = false
            this.pillowReportModel = false
            this.pillowReport = false
            this.activeName = name
            if (name === 'bodyround') {
                this.$nextTick(() => {
                    this.dispalyModel = true
                })
            }
            if (name === 'waistline') {
                this.$nextTick(() => {
                    this.waistmodel = true
                })
            }
            if (name === 'posture') {
                this.$nextTick(() => {
                    this.shapeModel = true
                })
            }
            if (name === 'pillowReport') {
                this.$nextTick(() => {
                    this.pillowReportModel = true
                })
            }
            // 重置滚动位置到顶部
            this.$nextTick(() => {
                document.querySelector('.section').scrollTop = 0
            })

        },
        // 体态评估上半模块数据
        assessProblem(data, bsDataState) {
            console.log("isNewMathTt", "=====", this.isNewMathTt)
            if (!this.isVAPro7 && !this.isNewMathTt) {
                if (data.headForward > 0) {
                    this.assess[1].list[0].status = this.$t('shape.item.abnormal')
                }
                if (data.headSlant > 0) {
                    this.assess[0].list[0].status = this.$t('shape.exception[0].title')
                } else if (data.headSlant < 0) {
                    this.assess[0].list[0].status = this.$t('shape.exception[1].title')
                }
                if (data.roundShoulderLeft > 15) {
                    this.assess[1].list[1].status = this.$t('shape.item.abnormal')
                }
                if (data.roundShoulderRight > 15) {
                    this.assess[3].list[0].status = this.$t('shape.item.abnormal')
                }
                if (data.highLowShoudler > 0) {
                    this.assess[2].list[0].status = this.$t('shape.exception[2].title')
                } else if (data.highLowShoudler < 0) {
                    this.assess[2].list[0].status = this.$t('shape.exception[3].title')
                }
                if (data.pelvisForward > 185) {
                    this.assess[1].list[2].status = this.$t('shape.exception[4].title')
                } else if (data.pelvisForward < 175) {
                    this.assess[1].list[2].status = this.$t('shape.exception[5].title')
                }
                if (data.leftKneeCheck > 190) {
                    this.assess[1].list[3].status = this.$t('shape.exception[6].title')
                } else if (data.leftKneeCheck < 160) {
                    this.assess[1].list[3].status = this.$t('shape.exception[7].title')
                }
                if (data.rightKneeCheck > 190) {
                    this.assess[3].list[1].status = this.$t('shape.exception[8].title')
                } else if (data.rightKneeCheck < 160) {
                    this.assess[3].list[1].status = this.$t('shape.exception[9].title')
                }
                if (data.leftLegXo <= 190 && data.leftLegXo >= 170) {
                    if (data.rightLegXo >= 0 && data.rightLegXo < 170) {
                        this.assess[0].list[1].status = this.$t('shape.exception[10].title')
                    } else if (data.rightLegXo > 190 && data.rightLegXo <= 360) {
                        this.assess[0].list[1].status = this.$t('shape.exception[11].title')
                    }
                } else if (data.leftLegXo >= 0 && data.leftLegXo < 170) {
                    if (data.rightLegXo <= 190 && data.rightLegXo >= 170) {
                        this.assess[0].list[1].status = this.$t('shape.exception[10].title')
                    } else if (data.rightLegXo >= 0 && data.rightLegXo < 170) {
                        this.assess[0].list[1].status = this.$t('shape.exception[12].title')
                    } else if (data.rightLegXo > 190 && data.rightLegXo <= 360) {
                        this.assess[0].list[1].status = this.$t('shape.item.abnormal')
                    }
                } else if (data.leftLegXo > 190 && data.leftLegXo <= 360) {
                    if (data.rightLegXo <= 190 && data.rightLegXo >= 170) {
                        this.assess[0].list[1].status = this.$t('shape.exception[11].title')
                    } else if (data.rightLegXo > 190 && data.rightLegXo <= 360) {
                        this.assess[0].list[1].status = this.$t('shape.exception[13].title')
                    } else if (data.rightLegXo > 190 && data.rightLegXo <= 360) {
                        this.assess[0].list[1].status = this.$t('shape.item.abnormal')
                    }
                }
                if (data.pelvicForwardTiltStatus > 0 && this.isStatus) {
                    if (this.assess[3].list[2]) return
                    this.assess[3].list.push({
                        name: this.$t('shape.explain[9].title'),
                        status: this.$t('shape.item.normal'),
                        errorLines: ['pelvicForwardTilt'],
                        errorPoints: ['', '', ''],
                    })
                    if (data.pelvicForwardTilt > 15) {
                        this.assess[3].list[2].status = this.$t('shape.exception[14].title')
                    } else if (data.pelvicForwardTilt < 0) {
                        this.assess[3].list[2].status = this.$t('shape.exception[15].title')
                    }
                }
                if (data.isLegLengthDiff > 0 && this.isStatus) {
                    if (this.assess[2].list[1]) return
                    this.assess[2].list.push({
                        name: this.$t('shape.explain[10].title'),
                        status: this.$t('shape.item.normal'),
                        errorLines: ['legLengthDiff'],
                        errorPoints: ['', ''],
                    })
                    if (data.legLengthDiff > 1) {
                        this.assess[2].list[1].status = this.$t('shape.exception[16].title')
                    } else if (data.legLengthDiff < -1) {
                        this.assess[2].list[1].status = this.$t('shape.exception[17].title')
                    }
                }
            } else if (JSON.stringify(bsDataState) !== '{}') {
                this.$store.commit('setNewMathTtData', bsDataState)
                // 进行新算法数据整理
                if (!this.isNewStatus) {
                    // 只修改一次数据
                    this.isNewStatus = !this.isNewStatus
                    return
                }
                if (bsDataState.headSlantState === 2 || bsDataState.headSlantState === 4) {
                    this.assessNew[0].list[0].status = this.$t('shape.exception[0].title')
                } else if (bsDataState.headSlantState === 1 || bsDataState.headSlantState === 3) {
                    this.assessNew[0].list[0].status = this.$t('shape.exception[1].title')
                }
                // 腿型
                switch (bsDataState.legType) {
                    case 0:
                        break
                    case 1:
                        this.assessNew[0].list[1].status = this.$t('shape.item.abnormal')
                        break
                    case 2:
                        this.assessNew[0].list[1].status = this.$t('shape.exception[10].title')
                        break
                    case 3:
                        this.assessNew[0].list[1].status = this.$t('shape.exception[11].title')
                        break
                    case 4:
                        this.assessNew[0].list[1].status = this.$t('shape.exception[12].title')
                        break
                    case 5:
                        this.assessNew[0].list[1].status = this.$t('shape.exception[13].title')
                        break

                    default:
                        this.assessNew[0].list[1].status = this.$t('shape.item.keAbnormal')
                        break
                }

                let leftHead = 0,
                    rightHead = 0
                // 左侧面
                console.log(bsDataState.hsVisualization, 88888899999)
                if (bsDataState.hsVisualization) {
                    this.assessNew[1].list.unshift({
                        name: this.$t('shape.explain[0].title'),
                        status: this.$t('shape.item.normal'),
                        errorLines: ['headForward'],
                        errorPoints: ['left_ear_point', 'right_ear_point'],
                    })
                    if (bsDataState.headForwardState) {
                        this.assessNew[1].list[0].status = this.$t('shape.item.abnormal')
                    }
                    leftHead++

                    // 右侧面
                } else {
                    this.assessNew[3].list.unshift({
                        name: this.$t('shape.explain[0].title'),
                        status: this.$t('shape.item.normal'),
                        errorLines: ['headForward'],
                        errorPoints: ['left_ear_point', 'right_ear_point'],
                    })
                    if (bsDataState.headForwardState) {
                        this.assessNew[3].list[0].status = this.$t('shape.item.abnormal')
                    }
                    rightHead++
                }
                if (bsDataState.leftRoundShoulderState) {
                    this.assessNew[1].list[leftHead].status = this.$t('shape.item.abnormal')
                }
                if (bsDataState.rightRoundShoulderState) {
                    this.assessNew[3].list[rightHead].status = this.$t('shape.item.abnormal')
                }
                // status 状态位置
                let indexRight = 1,
                    indexLeft = 1
                if (rightHead) {
                    indexRight = 2
                }
                if (leftHead) {
                    indexLeft = 2
                }
                // 左边盆骨
                if (bsDataState.pfsVisualization) {
                    this.assessNew[1].list.splice(indexLeft, 0, {
                        name: '骨盆前移',
                        status: this.$t('shape.item.normal'),
                        errorLines: ['pelvisForwardUp', 'pelvisForwardDown', 'pelvisForward'],
                        errorPoints: [
                            'left_hip_joint_point',
                            'right_hip_joint_point',
                            'left_body_gravity_line_point',
                            'right_body_gravity_line_point',
                        ], // 待定
                    })
                    if (bsDataState.pelvisForwardState) {
                        this.assessNew[1].list[indexLeft].status = this.$t('shape.exception[5].title')
                    }

                    // 右边盆骨
                } else {
                    this.assessNew[3].list.splice(indexRight, 0, {
                        name: '骨盆前移',
                        status: this.$t('shape.item.normal'),
                        errorLines: ['pelvisForwardUp', 'pelvisForwardDown', 'pelvisForward'],
                        errorPoints: [
                            'left_hip_joint_point',
                            'right_hip_joint_point',
                            'left_body_gravity_line_point',
                            'right_body_gravity_line_point',
                        ], // 待定
                    })
                    if (bsDataState.pelvisForwardState) {
                        this.assessNew[3].list[indexRight].status = this.$t('shape.exception[5].title')
                    }
                }
                // 左膝评估
                if (bsDataState.leftKneeCheckState) {
                    const length = this.assessNew[1].list.length - 1
                    if (bsDataState.leftKneeCheckState === 1 || bsDataState.leftKneeCheckState === 3) {
                        this.assessNew[1].list[length].status = this.$t('shape.exception[7].title')
                    } else {
                        this.assessNew[1].list[length].status = this.$t('shape.exception[6].title')
                    }
                }
                // 右膝
                if (bsDataState.rightKneeCheckState) {
                    const length = this.assessNew[3].list.length - 1
                    if (bsDataState.rightKneeCheckState === 1 || bsDataState.rightKneeCheckState === 3) {
                        this.assessNew[3].list[length].status = this.$t('shape.exception[9].title')
                    } else {
                        this.assessNew[3].list[length].status = this.$t('shape.exception[8].title')
                    }
                }
                // 肩部
                if (bsDataState.highLowShoudlerState) {
                    if (bsDataState.highLowShoudlerState === 1 || bsDataState.highLowShoudlerState === 3) {
                        this.assessNew[2].list[0].status = this.$t('shape.exception[2].title')
                    } else {
                        this.assessNew[2].list[0].status = this.$t('shape.exception[3].title')
                    }
                }
            }
            this.assess = JSON.parse(JSON.stringify(this.assess))
        },
        shareAfterHooks(to) {
            // 添加预设置分享内容防止刷新界面后不能分享
            if (
                ['/main/composition', '/main/assessment', '/main/girth', '/girth/trend', '/new-girth/trend'].includes(
                    to.path
                )
            ) {
                this.shareClick()
            }
        },
        getbmWaistInfo() {
            console.log('获取腰围数据><<<<<<<<<<<<<')
            this.$apollo
                .query({
                    query: bmWaistInfo,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const data = res.data.bmWaistInfo
                    if (data && data.code === 200) {
                        this.waistdata = data.data
                        this.healthPackageEnable = window.localStorage.getItem('healthPackageEnable')
                        console.log('获取腰围数据>', this.waistdata)
                        console.log('获取腰围数据>code', this.massInfo.girthMeasure, this.massInfo.bdaStatus === 1, this.healthPackageEnable === '2', this.isVAPro5, this.healthPackageEnable)
                    }
                })
        },
        // 设置分享
        shareClick() {
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
                            const modelInfoObj = JSON.parse(window.localStorage.getItem('modelInfo'))
                            const domain = getDomainFromString(url)
                            console.log(`==========domain:  ${domain}`)
                            let shareUrl = ''
                            if (isShare !== '1') {
                                shareUrl = `${domain}/shareAuth/shareCallBack?token=${signatureInfo.token}&scan_id=${modelInfoObj.scanId}`
                            } else {
                                shareUrl = url
                            }
                            console.log(
                                `========>url: ${url}  =======>scanId: ${modelInfoObj.scanId}   =======>shareUrl: ${shareUrl}`
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
                                                    success: function () { },
                                                })

                                                wx.updateTimelineShareData({
                                                    title: signatureInfo.title, // 分享标题
                                                    link: shareUrl, // 分享链接，与公众号JS安全域名一致
                                                    imgUrl: signatureInfo.imgUrl, // 分享图标
                                                    success: function () { },
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
                                console.log('错误：' + JSON.stringify(res))
                            })
                        }
                    })
            }
        },
    },
}
</script>
<style lang="less" scoped>
.ai-entrance {
    position: fixed;
    height: 56px;
    width: auto;
    bottom: 48px;
    right: 10px;
    z-index: 99;
}
.menu-info {
    width: 26px;
    height: 26px;
}

.report-wrapper {
    overflow: scroll;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: linear-gradient(to bottom, #262849, #07090f);
    display: flex;
    flex-direction: column;

    .header-menu {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 15px;
        width: 100%;
        top: 0;
        z-index: 100;

        >span {
            img {
                display: block;
            }
        }

        .product-name {
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            line-height: 15px;
            font-weight: 400;
            background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            padding: 0 0.01px;  /* 防止文本裁剪异常 */
        }

        .right-menu {
            display: flex;
            justify-content: flex-end;
            align-items: center;

            nav {
                display: flex;

                .right-menu-icon {
                    width: 26px;
                    height: 26px;
                }

                span {
                    margin-left: 3px;
                    font-size: 13px;
                    color: #ffffff;
                    background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            .send-report {
                margin-left: 16px;
            }
        }
    }

    .content-menu {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 18px;
        width: 100%;

        .time {
            font-size: 12px;
            color: #8aa3be;
        }

        .right-menu {
            right: 0px;
            display: flex;

            .left-icon {
                width: 18px;
                height: 18px;
            }

            .right-icon {
                width: 25px;
                height: 18px;
                margin-left: 22px;
            }
        }
    }
}
.athlete-icon{
    width: 20px;
    height: 20px;
    position: relative;
    top: 5px;
}
.section {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
}
.pillow-report-error{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 18%;
    height: calc(100vh - 300px);
    img{
        width: 128px;
    }
    label{
        font-weight: 500;
        font-size: 14px;
        color: #6568A9;
        margin-top: 40px;
    }
    p{
        font-size: 13px;
        color: #6568A9;
        margin-top: 10px;
    }
}
</style>
<style lang="less" scoped>
.van-tabs {
    /deep/.van-tabs__wrap {
        position: relative;

        &::before {
            content: '';
            position: absolute;
            width: 100%;
            border: 0.5px solid #ffffff;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1;
            opacity: 0.1;
        }
    }

    /deep/.van-tabs__nav {
        background-color: #232543;
    }

    /deep/.van-tab {
        color: #8aa3be;
    }

    /deep/.van-tab--active {
        display: inline-block;
        background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        line-height: 42px;
        align-items: center;
        padding: 0 0.01px;     /* 防止文本裁剪异常 */
    }
}
</style>
<style>
.van-tabs__line {
    bottom: 14px;
    background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
    padding: 0 0.01px;  /* 防止文本裁剪异常 */
}
</style>
