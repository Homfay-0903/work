<template>
    <div class="report-wrapper" :class="{'report-wrapper-up': swiperUp}">
        <div class="header-menu" v-if="isShowMenu === 'true'">
            <span>
                <img src="@/assets/images/report_leftber_Info.png" alt class="menu-info" @click.prevent="openSide" />
            </span>
        </div>
        <div class="top-show-message" :class="{'no-container-background': !isSupportWebgl.webgl}">
            <div class="person-img" v-if="isSupportWebgl.webgl">
                <report-model type="main"></report-model>
            </div>

            <!-- 判断浏览器支持 -->
            <version-tip v-else :tipMsg="isSupportWebgl.tipMsg" class="person-img"></version-tip>

            <div class="right-info">
                <div v-if="scoreType === 3 && !isVaPro5Device" class="multiple-score-box">
                    <div>
                        <div v-if="bodyScore.massConScore" :class="['con-box',{'isDeviceReport': isDeviceReport}]">
                            <img
                                v-if="bodyScore.massScore - bodyScore.massConScore >= 0"
                                src="@/assets/images/icon_rise.png"
                                alt
                            />
                            <img v-else src="@/assets/images/icon_decline.png" alt />
                            <span>{{ Math.abs(bodyScore.massScore - bodyScore.massConScore) }}</span>
                        </div>
                        <p class="score">{{ bodyScore.massScore }}</p>
                        <p class="text">身体成分</p>
                    </div>
                    <div>
                        <div v-if="bodyScore.evalConScore" :class="['con-box',{'isDeviceReport': isDeviceReport}]">
                            <img
                                v-if="bodyScore.evalScore - bodyScore.evalConScore >= 0"
                                src="@/assets/images/icon_rise.png"
                                alt
                            />
                            <img v-else src="@/assets/images/icon_decline.png" alt />
                            <span>{{ Math.abs(bodyScore.evalScore - bodyScore.evalConScore) }}</span>
                        </div>
                        <p class="score">{{ bodyScore.evalScore }}</p>
                        <p class="text">体态评估</p>
                    </div>
                </div>
                <div v-else class="single-score-box">
                    <div v-if="scoreType === 1 ? bodyScore.massConScore : bodyScore.evalConScore" :class="['con-box',{'isDeviceReport': isDeviceReport}]">
                        <img
                            v-if="scoreType === 1 ? (bodyScore.massScore - bodyScore.massConScore >= 0) : (bodyScore.evalScore - bodyScore.evalConScore >= 0)"
                            src="@/assets/images/icon_rise.png"
                            alt
                        />
                        <img v-else src="@/assets/images/icon_decline.png" alt />
                        <span>{{ scoreType === 1 ? (Math.abs(bodyScore.massScore - bodyScore.massConScore)) : (Math.abs(bodyScore.evalScore - bodyScore.evalConScore)) }}</span>
                    </div>
                    <p class="score">{{ scoreType === 1 ? bodyScore.massScore : bodyScore.evalScore }}</p>
                    <p class="text">{{ scoreType === 1 ? '身体成分' : '体态评估' }}</p>
                </div>
                <p v-if="this.modelInfo.biaStatus === 1 && isVaPro3Device" class="message">{{ promptMessage }}</p>
                <p>身高：{{ member.memberHeight }}cm</p>
                <p>年龄：{{ member.memberAge }}岁</p>
                <p>时间：{{ reportTime }}</p>
            </div>
        </div>
        <!-- 身体成分状态 -->
        <div :class=" isVaPro5Device ? 'report-list1' : 'report-list'" v-if="this.modelInfo.biaStatus === 1">
            <div>
                <img src="@/assets/images/icon_report_WT.png" alt />
                <div>
                    <p>体重</p>
                    <p>
                        {{ bodyState.weight }}
                        <i>kg</i>
                    </p>
                </div>
            </div>
            <div>
                <img src="@/assets/images/icon_report_PBF.png" alt />
                <div>
                    <p>体脂率</p>
                    <p>
                        {{ bodyState.rate }}
                        <i>%</i>
                    </p>
                </div>
            </div>
            <div v-if="!isVaPro5Device">
                <img src="@/assets/images/icon_report_LM.png" alt />
                <div>
                    <p>肌肉量</p>
                    <p>
                        {{ bodyState.muscle }}
                        <i>kg</i>
                    </p>
                </div>
            </div>
        </div>
        <div class="report-result" v-if="!isVaPro5Device || measureEval">
            <div :class="{'result-wrapper': true,'isDeviceReport': isDeviceReport}">
                <div>
                    <img src="@/assets/images/report_completion_icon.png" alt />
                    <div>
                        <h5>结论</h5>
                        <p v-if="bodyScore.massLevel && modelInfo.biaStatus === 1">
                            您目前的体成分状况{{ bodyScore.massLevel.conclusion }}，
                            <!-- 体型为{{ bodyState.bodyType }}, -->
                            体脂率{{ bodyState.ptType }}，
                            体重{{ bodyState.weightType }}。
                        </p>
                        <!-- 体态成功显示体态相关结论 -->
                        <p v-if="bodyScore.evalLevel && modelInfo.evalStatus === 1" class="bs-conclusion">
                            <span>您目前的体态状况{{ bodyScore.evalLevel.conclusion }}</span>
                            <template v-if="problemList.length !== 0">
                                <span>，存在</span>
                                <span
                                    v-for="(pro, idx) in problemList"
                                    :key="'k_' + idx"
                                >{{ idx !== ( problemList.length - 1 ) ? pro + '、' : pro }}</span>
                                <span>的{{ evalLevel.conclusion === '优秀' ? '概率。' : evalLevel.conclusion === '良好' ? '可能性。' : evalLevel.conclusion === '一般' ? '倾向。' : '风险。' }}</span>
                            </template>
                            <template v-else>
                                <span>。</span>
                            </template>
                        </p>
                        <!-- 肩部评估结论 -->
                        <p
                            v-if="modelInfo.bsShoulderScanResult === 1 && bsShoulderScanConclusion.length && notShoulder"
                        >
                            <span v-for="(pro, idx) in bsShoulderScanConclusion" :key="'k_' + idx">{{ pro.title }}</span>
                        </p>
                        <p
                            v-if="modelInfo.bsShoulderScanResult === 1 && !bsShoulderScanConclusion.length && notShoulder"
                        >
                            <span>肩部功能暂未发现明显异常</span>
                        </p>
                    </div>
                </div>
                <div class="last-suggest">
                    <img src="@/assets/images/report_suggest_icon.png" alt />
                    <div>
                        <h5>建议</h5>
                        <p v-if="bodyScore.massLevel && modelInfo.biaStatus === 1">{{ bodyScore.massLevel.advice }}</p>
                        <!-- 体态成功显示体态相关建议 -->
                        <p v-if="bodyScore.evalLevel && modelInfo.evalStatus === 1">{{ modelInfo.mpRecommend == 1 ? bodyScore.evalLevel.advice.replace(/教练/g, '深睡顾问') : bodyScore.evalLevel.advice }}</p>
                        <!-- 肩部评估建议 -->
                        <p
                            v-if="bsShoulderScanConclusion.length && bsShoulderScanConclusion[0].msg !== '' && notShoulder"
                        >请找专业人士对肩部做进一步筛查</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="fix-bottom-info">
            <button class="btn btn-primary" @click="goReport">
                <img :src="require('@/assets/images/icon/hand.svg')" alt="手势" />
                点击查看报告详情
            </button>
            <button v-if="enableAiReport === 1" class="btn btn-interpret" @click="reportInterpret">
                <img :src="require('@/assets/images/icon/brain.svg')" alt="手势" />
                申请报告解读(Beta)
            </button>
        </div>
        <!--侧边栏-->
        <mt-popup v-model="popupVisible" position="left">
            <!-- <side-bar @close-side-bar="reportInterpret"></side-bar> -->
            <side-bar></side-bar>
        </mt-popup>
        <mt-popup v-model="interpretVisible" class="body-composition-popup" popup-transition="popup-fade">
            <div class="popup-container" @touchmove.prevent>
                <h5>
                    <i class="icon-success"></i>发送成功
                </h5>
                <div class="first-intro content">
                    <p>请联系您的教练进行报告解读和计划定制</p>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import {
    bsEvalInfo,
    findBodyScore,
    getScanIdGetInfo,
    findBodyState,
    getMemberInfoByScanId,
    findBsShoulderConclusion,
    generateAiReport,
    findUserInfoByScanId,
    getWechatSignature,
    findBsDataStateInfo,
} from '@/assets/js/apolloGql.js'
import { formatMinutes, isWeiXin, getDomainFromString, isIos } from '@/assets/js/util.js'
import { promptMessage } from '@/assets/js/config.js'
import isSupportWebgl from '@/assets/js/webgl.js'
import wx from 'weixin-js-sdk'

import VersionTip from '@/components/model/VersionTip.vue'
import ReportModel from '@/components/model/Report'
import SideBar from '@/components/sidebar/Detail'
// import vConsole from '@/assets/js/vconsole'
import { isVAPro3, isVAPro5, isVAPro6 } from '@/types/device.js'
export default {
    name: 'Report',
    components: {
        ReportModel,
        SideBar,
        VersionTip,
    },
    data() {
        return {
            promptMessage,
            isSupportWebgl,
            popupVisible: false,
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            isShowMenu: window.sessionStorage.getItem('setIsShowMenu'),
            swiperUp: false,
            problemList: [],
            bodyScore: {},
            massScore: {},
            evalScore: {},
            bodyState: {},
            massLevel: {},
            evalLevel: {},
            member: {},
            bodyTypeList: ['虚弱型', '肌肉型', '肥胖型', '健康型'],
            weightTypeList: ['偏低', '正常', '偏高'],
            ptTypeList: ['偏低', '正常', '偏高'],
            scoreType: 0,
            // 肩部评估结论
            bsShoulderScanConclusion: [],
            // 肩部评估建议
            bsShoulderScanPropose: '',
            interpretVisible: false,
            // 开启AI报告解读
            enableAiReport: 0,
            // 是否分享进入
            isShare: 0,
            isStatus: false,
            notShoulder: true,
            bsDataState: {},
            isVAPro6: isVAPro6(),
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport'),
        }
    },
    computed: {
        // 格式化报告时间
        reportTime() {
            return formatMinutes(new Date(this.modelInfo.createTime * 1000))
        },
        isVaPro5Device() {
            return isVAPro5()
        },
        isVaPro3Device() {
            return isVAPro3()
        },
        measureEval() {
            return this.modelInfo.evalStatus === 1
        },
        // 头前引
        headForward() {
            // 结论
            let status
            switch (this.bsDataState.headForwardState) {
                case 1:
                    status = '异常'
                    break
                case 2:
                    status = '可能异常'
                    break

                default:
                    status = '正常'
                    break
            }

            return status
        },
        // 头侧歪
        headSlant() {

            // 结论
            let status
            switch (this.bsDataState.headSlantState) {
                    case 1:
                        status = '偏右'
                        break
                    case 2:
                        status = '偏左'
                        break
                    case 3:
                        status = '偏右'
                        break
                    case 4:
                        status = '偏左'
                        break

                    default:
                        status = '正常'
                        break
                }
            // 结论
            return status
        },
        // 圆肩
        roundShoulder() {

            // 结论
            let leftStatus
            switch (this.bsDataState.leftRoundShoulderState) {
                    case 1:
                        leftStatus = '异常'
                        break
                    case 2:
                        leftStatus = '可能异常'
                        break

                    default:
                        leftStatus = '正常'
                        break
                }
            // 结论
            let rightStatus
            switch (this.bsDataState.rightRoundShoulderState) {
                    case 1:
                        rightStatus = '异常'
                        break
                    case 2:
                        rightStatus = '可能异常'
                        break

                    default:
                        rightStatus = '正常'
                        break
                }
            return {
                left: leftStatus,
                right: rightStatus
            }
        },
        // 高低肩
        highLowShoudler() {
            // 结论
            let status
            switch (this.bsDataState.highLowShoudlerState) {
                    case 1:
                        status = '左高'
                        break
                    case 2:
                        status = '右高'
                        break
                    case 3:
                        status = '左高'
                        break
                    case 4:
                        status = '右高'
                        break

                    default:
                        status = this.$t('shape.item.normal')
                        break
                }
            // 结论
            return status
        },
        // 骨盆前/后移
        pelvisForward() {
            // 结论
            let status
            status =
                    this.bsDataState.pelvisForwardState === 2
                        ? '可能异常'
                        : this.bsDataState.pelvisForwardState === 1
                        ? '异常'
                        : '正常'
            return status
        },
        // 膝盖评估
        knee() {
            // 结论
            let leftStatus
            switch (this.bsDataState.leftKneeCheckState) {
                    case 1:
                        leftStatus = '左膝前曲'
                        break
                    case 2:
                        leftStatus = '左膝超伸'
                        break
                    case 3:
                        leftStatus = '左膝前曲'
                        break
                    case 4:
                        leftStatus = '左膝超伸'
                        break
                    default:
                        leftStatus = '正常'
                        break
                }

            let rightStatus
            switch (this.bsDataState.rightKneeCheckState) {
                    case 1:
                        rightStatus = '右膝前曲'
                        break
                    case 2:
                        rightStatus = '右膝超伸'
                        break
                    case 3:
                        rightStatus = '右膝前曲'
                        break
                    case 4:
                        rightStatus = '右膝超伸'
                        break
                    default:
                        rightStatus = '正常'
                        break
                }
            return {
                left: leftStatus,
                right: rightStatus
            }
        },
        // 腿型
        leg() {
            // 结论
            let status = ''
            switch (this.bsDataState.legType) {
                    case 0:
                        status = '正常'
                        break
                    case 1:
                        status = '异常'
                        break
                    case 2:
                        status = 'K型腿'
                        break
                    case 3:
                        status = 'D型腿'
                        break
                    case 4:
                        status = 'X型腿'
                        break
                    case 5:
                        status = 'O型腿'
                        break
                    default:
                        status = '可能异常'
                        break
                }
            return status
        },
    },
    created() {
        this.getScanIdGetInfo()
        this.isShare = sessionStorage.getItem('isShare')
        if (this.modelInfo.biaStatus === 1 && this.modelInfo.evalStatus === 1) {
            this.scoreType = 3
        } else if (this.modelInfo.biaStatus === 1) {
            this.scoreType = 1
        } else if (this.modelInfo.evalStatus === 1) {
            this.scoreType = 2
        }
    },
    mounted() {
        // 开启加载动画
        this.$indicator.open({
            spinnerType: 'fading-circle',
        })
        // 获取是否开启AI报告解读
        this.getUserInfo()
        // 获取用户信息
        this.getMemberInfo()
        // 获取身体分数
        this.findBodyScore()
        // bia成功则获取身体状态
        if (this.modelInfo.biaStatus === 1) {
            this.findBodyState()
        }
        // 体态成功则获取体态评估数据
        if (this.modelInfo.evalStatus === 1) {
            this.bsEvalInfo()
        }
        // 肩部评估成功则获取肩部评估结论
        if (this.modelInfo.bsShoulderScanResult === 1) {
            this.findBsShoulderConclusion()
        }
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
    },
    methods: {
        // 获取模块配置信息
        getScanIdGetInfo() {
            console.log(`获取当前信息${this.modelInfo.scanId}`)
            this.$apollo
                .query({
                    query: getScanIdGetInfo,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                })
                .then((res) => {
                    const data = res.data.getScanIdGetInfo
                    window.localStorage.setItem('reportMode', data.data)
                    this.isStatus = data.data.indexOf('010') > -1 && (this.modelInfo.scanMode || (this.modelInfo.scanId.split('-')[0].slice(0, 2) !== 'M6' && this.modelInfo.scanId.split('-')[0].slice(0, 2) !== 'M2' && this.modelInfo.scanId.split('-')[0].slice(0, 2) !== 'N2'))
                    this.notShoulder = data.data.indexOf('013') > -1 ? false : true
                })
        },
        shareAfterHooks(to) {
            // 添加预设置分享内容防止刷新界面后不能分享
            if (['/main/composition', '/main/assessment', '/main/girth', '/girth/trend'].includes(to.path)) {
                this.shareClick()
            }
        },
        getUserInfo() {
            this.$apollo
                .query({
                    query: findUserInfoByScanId,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                })
                .then((res) => {
                    this.loading = false
                    const data = res.data.findUserInfoByScanId
                    if (data && data.code === 200) {
                        const info = data.data
                        this.enableAiReport = info.enableAiReport
                    } else {
                        console.log('err')
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 进入报告
        goReport() {
            // 根据访问入口判断跳转到PC报告还是移动端报告
            const isPcReport = window.sessionStorage.getItem('isPcReport') === '1'
            if (isPcReport) {
                this.$router.push('/pc-report')
            } else {
                this.$router.push('/main')
            }
        },
        // 申请报告解读
        async reportInterpret() {
            this.popupVisible = false
            this.$apollo
                .mutate({
                    mutation: generateAiReport,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                })
                .then((res) => {
                    const data = res.data.generateAiReport
                    if (data.code === 200) {
                        this.interpretVisible = true
                    } else {
                        this.$toast({
                            message: data.message,
                            duration: 3000,
                        })
                    }
                })
        },
        // 体态评估
        bsEvalInfo() {
            this.$apollo
                .query({
                    query: bsEvalInfo,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                })
                .then((res) => {
                    const data = res.data.bsEvalInfo
                    if (data.code === 200) {
                        this.body = data.data
                        if (data.data.headForward > 0) {
                            this.problemList.push('头前引')
                        }
                        if (data.data.headSlant > 0 || data.data.headSlant < 0) {
                            this.problemList.push('头侧歪')
                        }
                        if (data.data.roundShoulderLeft > 15) {
                            this.problemList.push('左圆肩')
                        }
                        if (data.data.roundShoulderRight > 15) {
                            this.problemList.push('右圆肩')
                        }
                        if (data.data.highLowShoudler > 0 || data.data.highLowShoudler < 0) {
                            this.problemList.push('高低肩')
                        }
                        if (data.data.pelvisForward > 185) {
                            this.problemList.push('骨盆后移')
                        } else if (data.data.pelvisForward < 175) {
                            this.problemList.push('骨盆前移')
                        }
                        if (data.data.leftKneeCheck > 190) {
                            this.problemList.push('左膝超伸')
                        } else if (data.data.leftKneeCheck < 160) {
                            this.problemList.push('左膝前曲')
                        }
                        if (data.data.rightKneeCheck > 190) {
                            this.problemList.push('右膝超伸')
                        } else if (data.data.rightKneeCheck < 160) {
                            this.problemList.push('右膝前曲')
                        }
                        if (data.data.leftLegXo <= 190 && data.data.leftLegXo >= 170) {
                            if (data.data.rightLegXo >= 0 && data.data.rightLegXo < 170) {
                                this.problemList.push('K型腿')
                            } else if (data.data.rightLegXo > 190 && data.data.rightLegXo <= 360) {
                                this.problemList.push('D型腿')
                            }
                        } else if (data.data.leftLegXo >= 0 && data.data.leftLegXo < 170) {
                            if (data.data.rightLegXo <= 190 && data.data.rightLegXo >= 170) {
                                this.problemList.push('K型腿')
                            } else if (data.data.rightLegXo >= 0 && data.data.rightLegXo < 170) {
                                this.problemList.push('X型腿')
                            }
                        } else if (data.data.leftLegXo > 190 && data.data.leftLegXo <= 360) {
                            if (data.data.rightLegXo <= 190 && data.data.rightLegXo >= 170) {
                                this.problemList.push('D型腿')
                            } else if (data.data.rightLegXo > 190 && data.data.rightLegXo <= 360) {
                                this.problemList.push('O型腿')
                            }
                        }

                        if (data.data.pelvicForwardTiltStatus > 0 && this.isStatus) {
                            if (data.data.pelvicForwardTilt > 15) {
                                this.problemList.push('骨盆前倾')
                            } else if (data.data.pelvicForwardTilt < 0) {
                                this.problemList.push('骨盆后倾')
                            }
                        }
                        if (data.data.isLegLengthDiff > 0 && this.isStatus) {
                            if (data.data.legLengthDiff > 1) {
                                this.problemList.push('长短腿左长')
                            } else if (data.data.legLengthDiff < -1) {
                                this.problemList.push('长短腿右长')
                            }
                        }
                        if (this.isVAPro6) {
                            this.findBsDataStateInfo(bsEvalInfo)
                        }
                    }
                })
        },
        // 体态评估状态值
        findBsDataStateInfo(bsEvalInfo) {
            this.$apollo
                .query({
                    query: findBsDataStateInfo,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                    fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const data = res.data.findBsDataStateInfo
                    this.bsDataState = data.data
                    this.problemList = []
                    if (this.headForward !== '正常') {
                        this.problemList.push('头前引')
                    }
                    if (this.headSlant !== '正常') {
                        this.problemList.push('头侧歪')
                    }
                    if (this.roundShoulder.left !== '正常') {
                        this.problemList.push('左圆肩')
                    }
                    if (this.roundShoulder.right !== '正常') {
                        this.problemList.push('右圆肩')
                    }
                    if (this.highLowShoudler !== '正常') {
                        this.problemList.push('高低肩')
                    }
                    if (this.pelvisForward !== '正常') {
                        this.problemList.push('骨盆前移/后移')
                    }
                    if (this.knee.left !== '正常') {
                        this.problemList.push('左膝评估')
                    }
                    if (this.knee.right !== '正常') {
                        this.problemList.push('右膝评估')
                    }
                    if (this.leg !== '正常') {
                        this.problemList.push('腿型')
                    }
                })
        },
        // 展开侧边栏
        openSide() {
            this.popupVisible = true
        },
        // 获取身体分数数据
        findBodyScore() {
            const that = this
            this.$apollo
                .query({
                    query: findBodyScore,
                    variables: {
                        scanId: this.modelInfo.scanId,
                        scanTime: this.modelInfo.createTime,
                        scanType: this.scoreType,
                    },
                })
                .then((res) => {
                    const data = res.data.findBodyScore
                    if (data.code === 200 && data.data !== null) {
                        let scoreInfo = JSON.parse(JSON.stringify(data.data))
                        if (this.scoreType === 1 || this.scoreType === 3) {
                            scoreInfo.massScore = scoreInfo.massScore ? parseInt(scoreInfo.massScore, 10) : null
                            scoreInfo.massConScore = scoreInfo.massConScore
                                ? parseInt(scoreInfo.massConScore, 10)
                                : null
                        }
                        if (this.scoreType === 2 || this.scoreType === 3) {
                            scoreInfo.evalScore = scoreInfo.evalScore ? parseInt(scoreInfo.evalScore, 10) : null
                            scoreInfo.evalConScore = scoreInfo.evalConScore
                                ? parseInt(scoreInfo.evalConScore, 10)
                                : null
                        }

                        this.bodyScore = scoreInfo
                    }
                    // 关闭加载动画
                    that.$indicator.close()
                })
        },
        // 获取身体状态
        findBodyState() {
            this.$apollo
                .query({
                    query: findBodyState,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                })
                .then((res) => {
                    const data = res.data.findBodyState
                    if (data.code === 200) {
                        const status = data.data
                        const bodyState = {
                            weight: status.WT.v,
                            rate: status.PBF.v,
                            muscle: status.LM ? status.LM.v : 0,
                            bodyType: status.bodyShare ? this.bodyTypeList[status.bodyShare - 1] : '',
                            weightType: status.WT.status ? this.weightTypeList[status.WT.status - 1] : '',
                            ptType: status.PBF.status ? this.ptTypeList[status.PBF.status - 1] : '',
                        }
                        this.bodyState = bodyState
                    }
                })
        },
        // 获取用户信息
        getMemberInfo() {
            this.$apollo
                .query({
                    query: getMemberInfoByScanId,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                })
                .then((res) => {
                    const data = res.data.getMemberInfoByScanId
                    if (data && data.code === 200) {
                        this.member = data.data
                    }
                })
        },
        // 获取肩部评估结论
        findBsShoulderConclusion() {
            this.$apollo
                .query({
                    query: findBsShoulderConclusion,
                    variables: {
                        scanId: this.modelInfo.scanId,
                    },
                })
                .then((res) => {
                    const data = res.data.findBsShoulderConclusion
                    if (data && data.code === 200) {
                        this.bsShoulderScanConclusion = data.data.conclusion
                        console.log(this.bsShoulderScanConclusion)
                    }
                })
        },
        // 设置分享
        shareClick() {
            if (isWeiXin()) {
                console.log(`report---------->isWeiXin: ${isWeiXin()} isShare: ${this.isShare}  isIos: ${isIos()}`)
                let url = window.location.href.split('#')[0]
                const isShare = this.isShare
                this.$apollo
                    .query({
                        query: getWechatSignature,
                        variables: {
                            url: encodeURIComponent(url),
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
                                console.log(`错误：${JSON.stringify(res)}`)
                            })
                        }
                    })
            }
        },
    },
}
</script>

<style lang="less" scoped>
.hiddenMenu {
    overflow: hidden;
}
.menu-info {
    width: 17px;
    height: 13px;
}
.report-wrapper-up {
    top: -100% !important;
    transition: all linear 0.25s;
}
.report-wrapper {
    position: absolute;
    width: 100%;
    min-height: 100%;
    top: 0;
    left: 0;
    padding-bottom: 10px;
    background-image: linear-gradient(to bottom, #262849, #07090f);
    .header-menu {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 15px;
        position: absolute;
        width: 100%;
        top: 0;
        z-index: 100;
        > span {
            img {
                display: block;
            }
        }
    }
    .top-show-message {
        padding-top: 35px;
        margin-bottom: 30px;
        background-image: url(../../assets/images/report_ground_bg.png);
        background-size: 100% 62px;
        background-repeat: no-repeat;
        background-position: left bottom;
        display: flex;
        .person-img {
            width: 52.27%;
            /*padding-left: 43px;*/
            margin-bottom: -2px;
            background-image: url(../../assets/images/report_moxing_bg.png);
            background-size: 125px 45px;
            background-repeat: no-repeat;
            background-position: 35px bottom;
            padding-bottom: 14px;
            height: 70vw;
        }
        .right-info {
            width: 47.73%;
            margin-top: 32px;
            // > div {
            //     width: 137px;
            //     height: 137px;
            //     // line-height: 137px;
            //     text-align: center;
            //     // background-image: url(../../assets/images/report_fraction_def.png);
            //     // background-repeat: no-repeat;
            //     // background-size: 137px 137px;
            //     font-size: 65px;
            //     color: #fff;
            //     margin-bottom: 16px;
            //     display: flex;
            //     justify-content: center;
            //     align-items: center;
            //     flex-direction: column;
            // }
            > p {
                font-size: 12px;
                color: #fff;
                line-height: 2;
                text-align: left;
                padding-left: 26px;
            }
            .single-score-box {
                position: relative;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                flex-direction: column;
                width: 88px;
                height: 82px;
                margin-left: 26px;
                margin-bottom: 64px;
                border: 1px solid transparent;
                border-radius: 6px;
                background: linear-gradient(#212440, #212440),
                    linear-gradient(90deg, rgba(0, 227, 201, 1) 0%, rgba(0, 159, 232, 1) 100%);
                background-clip: padding-box, border-box;
                background-origin: border-box;
                .con-box {
                    position: absolute;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    width: 36px;
                    top: 0;
                    right: 0;
                    height: 17px;
                    background: linear-gradient(90deg, rgba(0, 227, 201, 1) 0%, rgba(0, 159, 232, 1) 100%);
                    border-radius: 0px 5.5px 0px 5.5px;
                    span {
                        margin-left: 4px;
                        font-size: 12px;
                        font-weight: 400;
                        color: rgba(255, 255, 255, 1);
                    }
                }
                .score {
                    color: #fff;
                    font-size: 40px;
                    font-weight: 100;
                    line-height: 1;
                }
                .text {
                    color: #00a1e8;
                    font-size: 12px;
                    line-height: 1;
                    margin-bottom: 5px;
                }
                .isDeviceReport{
                    img{
                        width: 8px;
                        height: 8px;
                    }
                }
            }
            .multiple-score-box {
                display: flex;
                flex-direction: row;
                width: 131px;
                height: 82px;
                margin-left: 26px;
                margin-bottom: 64px;
                border: 1px solid transparent;
                border-radius: 6px;
                background: linear-gradient(#212440, #212440),
                    linear-gradient(90deg, rgba(0, 227, 201, 1) 0%, rgba(0, 159, 232, 1) 100%);
                background-clip: padding-box, border-box;
                background-origin: border-box;

                div {
                    position: relative;
                    width: 50%;
                    height: 100%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    flex-direction: column;
                    .con-box {
                        position: absolute;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        width: 36px;
                        top: 0;
                        height: 17px;
                        background: linear-gradient(90deg, rgba(0, 227, 201, 1) 0%, rgba(0, 159, 232, 1) 100%);
                        border-radius: 0px 0px 6px 6px;
                        span {
                            margin-left: 4px;
                            font-size: 12px;
                            font-weight: 400;
                            color: rgba(255, 255, 255, 1);
                        }
                    }
                    .score {
                        color: #fff;
                        font-size: 40px;
                        font-weight: 100;
                        line-height: 1;
                    }
                    .text {
                        color: #00a1e8;
                        font-size: 12px;
                        line-height: 1;
                        margin-bottom: 5px;
                    }
                    .isDeviceReport{
                        img{
                            width: 8px;
                            height: 8px;
                        }
                    }
                }
            }
            .message {
                width: 155px;
                height: 28px;
                font-size: 12px;
                font-weight: 400;
                font-family: PingFangSC-Regular, PingFang SC;
                margin-top: -60px;
                margin-bottom: 30px;
                line-height: 16px;
                color: rgba(255, 255, 255, 0.44);
            }
        }
    }
    .report-list,
    .report-list1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-image: linear-gradient(to bottom, #191a37, #161834);
        padding: 10.5px 15px;
        > div {
            display: flex;
            align-items: center;
            text-align: left;
            color: #fff;
            img {
                width: 44px;
                height: 32px;
                // 禁止部分安卓机下图片自动放大
                pointer-events: none;
            }
            > div {
                padding-left: 6px;
                p:first-child {
                    font-size: 10px;
                    line-height: 1.8;
                }
                p:last-child {
                    font-size: 16px;
                    &.type-size {
                        font-size: 13px;
                    }
                    i {
                        font-style: normal;
                        font-size: 12px;
                    }
                }
            }
        }
    }
    .report-list1 {
        padding: 10.5px 75px;
    }
    .report-result {
        padding: 10px 15px;
        // margin-bottom: 40px;
        .result-wrapper {
            border-radius: 5px;
            background-image: linear-gradient(to bottom, #191c38, #161832, #12142e, #0f122a);
            text-align: left;
            padding: 15px 10px;
            > div {
                display: flex;
                align-items: flex-start;
                padding-bottom: 10px;
                img {
                    display: block;
                    width: 19px;
                    // 禁止部分安卓机下图片自动放大
                    pointer-events: none;
                }
                > div {
                    color: #fff;
                    font-size: 14px;
                    padding-left: 5px;
                    h5 {
                        font-size: 14px;
                        font-weight: normal;
                        padding-bottom: 2px;
                    }
                    p {
                        line-height: 1.29;
                        &.bs-conclusion {
                            font-size: 0;
                            span {
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
        }
        .isDeviceReport {
            img {
                display: inline-block;
                padding-top: 4px;
                width: 14px!important;
            }
            .last-suggest {
                img{
                    width: 14px!important;
                }
            }

        }
    }
    .page-up-hidden {
        background-image: none !important;
    }
    // 点击查看报告
    .fix-bottom-info {
        margin: 20px 15px;

        .btn {
            width: 100%;
            background-image: linear-gradient(#24d9e2, #1bace7, #1071ef, #2368ff);
            color: #fff;
            font-size: 12px;
            line-height: 3.5;
            border-radius: 4px;
            letter-spacing: 2px;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                width: 12px;
                margin-right: 5px;
            }
            &.btn-interpret {
                margin-top: 12px;
                background-image: linear-gradient(#56c0a7, #055f4e);
            }
        }
    }
}

@-webkit-keyframes slideShine {
    0% {
        padding-bottom: 14px;
        opacity: 1;
    }
    100% {
        padding-bottom: 24px;
        opacity: 0.2;
    }
}

@keyframes slideShine {
    0% {
        padding-bottom: 14px;
        opacity: 1;
    }
    100% {
        padding-bottom: 24px;
        opacity: 0.2;
    }
}
</style>
