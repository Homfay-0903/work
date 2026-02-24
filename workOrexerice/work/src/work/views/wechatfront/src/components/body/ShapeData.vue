<template>
    <!--体态评估-体成分测量-->
    <div class="body-assess-data body-thermal-wrapper">
        <!--体成分测量-体态失败-->
        <div class="no-thermal-data result-failed-tip" v-if="isShow">
            <div>
                <p>体态评估结果合成失败~</p>
                <p>小编猜测可能是网络原因导致的</p>
            </div>
        </div>
        <!--体成分测量-体态未测量-->
        <div class="no-thermal-data" v-if="bsNoMeasure">
            <div>
                <p>体态未测量，所以暂无测量结果~</p>
                <p>让努力的汗水看得见！</p>
                <p>下次记得体成分测量和体态测量一起做哟！</p>
            </div>
        </div>
        <!--体态评估-模型结论-->
        <div v-if="!isShow && !bsNoMeasure" class="detail-content">
            <!-- 加载动画 -->
            <div class="loading" v-if="loading">
                <mt-spinner type="fading-circle" class="loading-dot"></mt-spinner>
            </div>
            <div class="body-assessment-list" v-else>
                <div class="data-list">
                    <div class="thermal-item">
                        <span class="name">{{ titleItem.name }}</span>
                        <span class="val">{{titleItem.val}}</span>
                        <!-- v2.2.0需求屏蔽 -->
                        <!-- <span class="diff">{{titleItem.diff}}</span> -->
                        <span class="status">{{ titleItem.status }}</span>
                    </div>
                    <!-- 头前引 -->
                    <shapedata-item :item="headForward" @handelHelp="handelHelp"></shapedata-item>
                    <!-- 头侧歪 -->
                    <shapedata-item :item="headSlant" @handelHelp="handelHelp"></shapedata-item>
                    <!-- 左圆肩 -->
                    <shapedata-item :item="roundShoulder.left" @handelHelp="handelHelp"></shapedata-item>
                    <!-- 右圆肩 -->
                    <shapedata-item :item="roundShoulder.right" @handelHelp="handelHelp"></shapedata-item>
                    <!-- 高低肩 -->
                    <shapedata-item :item="highLowShoudler" @handelHelp="handelHelp"></shapedata-item>
                    <!-- 骨盆前/后移 -->
                    <shapedata-item :item="pelvisForward" @handelHelp="handelHelp"></shapedata-item>
                    <!-- 骨盆前/后倾 -->
                    <shapedata-item v-if="evalInfo.pelvicForwardTiltStatus.val>0" :item="pelvicForwardTilt" @handelHelp="handelHelp"></shapedata-item>
                    <!-- 左膝评估 -->
                    <shapedata-item :item="knee.left" @handelHelp="handelHelp"></shapedata-item>
                    <!-- 右膝评估 -->
                    <shapedata-item :item="knee.right" @handelHelp="handelHelp"></shapedata-item>
                    <!-- 腿型 -->
                    <div class="thermal-item">
                        <span class="name">
                            腿型
                            <img src="@/assets/images/comp_help_icon.png" alt @click.prevent="handelHelp('腿型')" />
                        </span>
                        <span class="val">{{'左腿:' + leg.left.val}}</span>
                        <!-- v2.2.0需求屏蔽 -->
                        <!-- <span class="diff">{{leg.left.diff}}</span> -->
                        <span :class="['status', {'status-color': leg.status !== '正常'}]">{{ leg.status }}</span>
                    </div>
                    <div class="thermal-item">
                        <span class="name"></span>
                        <span class="val leg">{{'右腿:' + leg.right.val}}</span>
                        <!-- v2.2.0需求屏蔽 -->
                        <!-- <span class="diff leg">{{leg.right.diff}}</span> -->
                        <span class="status"></span>
                    </div>
                    <!-- 长短腿 -->
                    <shapedata-item v-if="evalInfo.isLegLengthDiff.val>0" :item="legLengthDiff" @handelHelp="handelHelp"></shapedata-item>
                </div>
                <div class="data-problem" v-if="problemList.length !== 0 && notTang()">
                    <p class="name">您可能存在以下问题：</p>
                    <p class="content">
                        <span
                            v-for="(pro, idx) in problemList"
                            :key="'k_' + idx"
                        >{{ idx !== ( problemList.length - 1 ) ? pro + '、' : pro + '。' }}</span>
                    </p>
                </div>
            </div>
            <!-- <div class="weight-offset-data">
                <div class="offset-info">
                    <p class="name">重心平衡检测：</p>
                    <div>
                        <template v-if="weightInfo">
                            <span>{{ toDecimal(weightInfo.weightD, 1) }}kg</span>
                            <span>{{ toDecimal(weightInfo.weightC, 1) }}kg</span>
                            <span>{{ toDecimal(weightInfo.weightA, 1) }}kg</span>
                            <span>{{ toDecimal(weightInfo.weightB, 1) }}kg</span>
                        </template>
                        <img src="@/assets/images/svg/foot.svg" alt />
                    </div>
                </div>
                <div class="offset-result">
                    <p class="name">重心平衡检测结果：</p>
                    <p v-if="weightInfo" class="content">
                        <span>左脚{{weightLeftFoot}}、右脚{{weightRightFoot}}、前后{{weightAround}}、左右{{weightAbout}}。</span>
                    </p>
                </div>
            </div>-->
        </div>
        <!--体态评估-弹出说明-->
        <mt-popup v-model="popupAssess" class="body-composition-popup" popup-transition="popup-fade">
            <!-- 防止在pupop里滚动，body也跟着滚 -->
            <div class="popup-container" @touchmove.prevent>
                <h5>{{ form.name }}说明</h5>
                <div class="first-intro content">
                    <p>{{ form.desc }}</p>
                </div>
                <!-- <div class="second-intro content">
                    <h5>对比：{{ form.result }}cm</h5>
                    <p>{{ form.advice }}</p>
                </div>-->
                <div class="pop-btn-action" @click="popupAssess = false">我知道了</div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import { findBsEvalContrastInfo, weightOffset, findBsDataStateInfo } from '@/assets/js/apolloGql.js'
import { toDecimal2 } from '@/assets/js/util.js'
import { isVAPro6 } from '@/types/device.js'
import ShapedataItem from '@/components/common/ShapeDataItem'

export default {
    components: {
        ShapedataItem
    },
    props: {
        notMeasured: Boolean,
        measuredFailed: Boolean,
        notComposition: Boolean,
        compositionFailed: Boolean
    },
    data() {
        return {
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            reportMode: window.localStorage.getItem('reportMode'),
            popupAssess: false,
            body: {},
            form: {
                name: '',
                desc: '',
                advice: '',
                result: 0
            },
            problemList: [],
            isShow: this.notComposition,
            bsNoMeasure: false,
            loading: true,
            titleItem: {
                name: '项目',
                val: '测量值',
                // diff: '与上次对比',
                status: '结论'
            },
            evalInfo: {},
            isVAPro6: isVAPro6(),
            weightInfo: null,
            bsDataState: {},
        }
    },
    computed: {
        // 头前引
        headForward() {
            const info = this.evalInfo['headForward']
            if (!info) {
                return {}
            }
            const val = info.val
            // 结论
            let status
            if (this.isVAPro6) {
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
            } else {
                status = val > 0 ? '异常' : '正常'
            }
            // 结论
            // const status = val > 0 ? '异常' : '正常'
            return {
                name: '头前引',
                val: val + this.isvapro7unit(),
                diff: info.diff !== '--' ? `${info.diff >= 0 ? '+' + info.diff : info.diff}${this.isvapro7unit()}` : info.diff,
                status: status
            }
        },
        // 头侧歪
        headSlant() {
            const info = this.evalInfo['headSlant']
            if (!info) {
                return {}
            }
            const val = info.val
            // 结论
            let status
            if (this.isVAPro6) {
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
            } else {
                status = val > 0 ? '偏左' : val < 0 ? '偏右' : '正常'
            }
            // 结论
            return {
                name: '头侧歪',
                val: val + '°',
                diff: info.diff !== '--' ? `${info.diff >= 0 ? '+' + info.diff : info.diff}°` : info.diff,
                status: status
            }
        },
        // 圆肩
        roundShoulder() {
            const leftInfo = this.evalInfo['roundShoulderLeft']
            const rightInfo = this.evalInfo['roundShoulderRight']
            if (!leftInfo || !rightInfo) {
                return {}
            }
            const leftVal = leftInfo.val
            // 结论
            let leftStatus
            if (this.isVAPro6) {
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
            } else {
                leftStatus = leftVal > 15 ? '异常' : '正常'
            }
            const left = {
                name: '左圆肩',
                val: leftVal + this.isvapro7unit(),
                diff:
                    leftInfo.diff !== '--'
                        ? `${leftInfo.diff >= 0 ? '+' + leftInfo.diff : leftInfo.diff}${this.isvapro7unit()}`
                        : leftInfo.diff,
                status: leftStatus
            }

            const rightVal = rightInfo.val
            // 结论
            let rightStatus
            if (this.isVAPro6) {
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
            } else {
                rightStatus = rightVal > 15 ? '异常' : '正常'
            }
            // 结论
            const right = {
                name: '右圆肩',
                val: rightVal + this.isvapro7unit(),
                diff:
                    rightInfo.diff !== '--'
                        ? `${rightInfo.diff >= 0 ? '+' + rightInfo.diff : rightInfo.diff}${this.isvapro7unit()}`
                        : rightInfo.diff,
                status: rightStatus
            }
            return {
                left: left,
                right: right
            }
        },
        // 高低肩
        highLowShoudler() {
            const info = this.evalInfo['highLowShoudler']
            if (!info) {
                return {}
            }
            const val = info.val
            // 结论
            let status
            if (this.isVAPro6) {
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
            } else {
                status = val > 0 ? '左高' : val < 0 ? '右高' : '正常'
            }
            // 结论
            return {
                name: '高低肩',
                val: val + (this.isVAPro6 ? '°' : 'cm'),
                diff: info.diff !== '--' ? `${info.diff >= 0 ? '+' + info.diff : info.diff}${this.isVAPro6 ? '°' : 'cm'}` : info.diff,
                status: status
            }
        },
        // 骨盆前/后移
        pelvisForward() {
            const info = this.evalInfo['pelvisForward']
            if (!info) {
                return {}
            }
            const val = info.val
            // 结论
            let status
            if (this.isVAPro6) {
                status =
                    this.bsDataState.pelvisForwardState === 2
                        ? '可能异常'
                        : this.bsDataState.pelvisForwardState === 1
                        ? '异常'
                        : '正常'
            } else {
                // 结论
                status = val > 185 ? '骨盆后移' : val < 175 ? '骨盆前移' : '正常'
            }
            return {
                name: this.isVAPro6 ? '骨盆前移' : '骨盆前/后移',
                val: val + this.isvapro7unit(),
                diff: info.diff !== '--' ? `${info.diff >= 0 ? '+' + info.diff : info.diff}${this.isvapro7unit()}` : info.diff,
                status: status
            }
        },
        // 骨盆前/后倾
        pelvicForwardTilt() {
            const info = this.evalInfo['pelvicForwardTilt']
            if (!info) {
                return {}
            }
            const val = info.val
            // 结论
            const status = val > 15 ? this.$t('shape.exception[15].title') : val < 0 ? this.$t('shape.exception[16].title') : this.$t('shape.item.normal')
            return {
                name: this.$t('shape.explain[9].title'),
                val: info.val + '°',
                diff: info.diff !== '--' ? `${info.diff >= 0 ? '+' + info.diff : info.diff}°` : info.diff,
                status: status
            }
        },
        // 膝盖评估
        knee() {
            const leftInfo = this.evalInfo['leftKneeCheck']
            const rightInfo = this.evalInfo['rightKneeCheck']
            if (!leftInfo || !rightInfo) {
                return {}
            }
            const leftVal = leftInfo.val
            // 结论
            let leftStatus
            if (this.isVAPro6) {
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
            } else {
                // 结论
                leftStatus = leftVal > 190 ? '左膝超伸' : leftVal < 160 ? '左膝前曲' : '正常'
            }
            const left = {
                name: '左膝评估',
                val: leftVal + '°',
                diff:
                    leftInfo.diff !== '--'
                        ? `${leftInfo.diff >= 0 ? '+' + leftInfo.diff : leftInfo.diff}°`
                        : leftInfo.diff,
                status: leftStatus
            }

            const rightVal = rightInfo.val
            let rightStatus
            if (this.isVAPro6) {
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
            } else {
                rightStatus = rightVal > 190 ? '右膝超伸' : rightVal < 160 ? '右膝前曲' : '正常'
            }
            // 结论
            const right = {
                name: '右膝评估',
                val: rightVal + '°',
                diff:
                    rightInfo.diff !== '--'
                        ? `${rightInfo.diff >= 0 ? '+' + rightInfo.diff : rightInfo.diff}°`
                        : rightInfo.diff,
                status: rightStatus
            }
            return {
                left: left,
                right: right
            }
        },
        // 腿型
        leg() {
            const leftInfo = this.evalInfo['leftLegXo']
            const rightInfo = this.evalInfo['rightLegXo']
            if (!leftInfo || !rightInfo) {
                return {}
            }
            const leftVal = leftInfo.val
            const rightVal = rightInfo.val
            // 结论
            let status = ''
            if (this.isVAPro6) {
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
            } else {
                if (leftVal <= 190 && leftVal >= 170) {
                    if (rightVal <= 190 && rightVal >= 170) {
                        status = '正常'
                    } else if (rightVal >= 0 && rightVal < 170) {
                        status = 'K型腿'
                    } else if (rightVal > 190 && rightVal <= 360) {
                        status = 'D型腿'
                    }
                } else if (leftVal >= 0 && leftVal < 170) {
                    if (rightVal <= 190 && rightVal >= 170) {
                        status = 'K型腿'
                    } else if (rightVal >= 0 && rightVal < 170) {
                        status = 'X型腿'
                    } else if (rightVal > 190 && rightVal <= 360) {
                        status = '异常'
                    }
                } else if (leftVal > 190 && leftVal <= 360) {
                    if (rightVal <= 190 && rightVal >= 170) {
                        status = 'D型腿'
                    } else if (rightVal >= 0 && rightVal < 170) {
                        status = '异常'
                    } else if (rightVal > 190 && rightVal <= 360) {
                        status = 'O型腿'
                    }
                }
            }

            const left = {
                val: leftVal + '°',
                diff:
                    leftInfo.diff !== '--'
                        ? `${leftInfo.diff >= 0 ? '+' + leftInfo.diff : leftInfo.diff}°`
                        : leftInfo.diff
            }

            const right = {
                val: rightVal + '°',
                diff:
                    rightInfo.diff !== '--'
                        ? `${rightInfo.diff >= 0 ? '+' + rightInfo.diff : rightInfo.diff}°`
                        : rightInfo.diff
            }
            return {
                left: left,
                right: right,
                status: status
            }
        },
        // 长短腿
        legLengthDiff() {
            const info = this.evalInfo['legLengthDiff']
            if (!info) {
                return {}
            }
            const val = this.unit === 'metric' ? _toDecimal(info.val * 2.54, 1) : info.val
            // 结论
            const status = val > 1 ? this.$t('shape.exception[16].title') : val < -1 ? this.$t('shape.exception[17].title') : this.$t('shape.item.normal')
            return {
                name: this.$t('shape.explain[10].title'),
                val: info.val + `${this.unit === 'imperial' ? 'in.' : 'cm'}`,
                diff: info.diff !== '--' ? `${info.diff >= 0 ? '+' + info.diff : info.diff}cm` : info.diff,
                status: status
            }
        },
        // weightA 左后 weightB 右后 weightC 右前 weightD 左前
        // 重心检测左脚
        weightLeftFoot() {
            if (!this.weightInfo) {
                return ''
            }
            // 左前 > 左后
            if (this.weightInfo.weightD > this.weightInfo.weightA) {
                return '重心偏前'
            } else if (this.weightInfo.weightD < this.weightInfo.weightA) {
                return '重心偏后'
            } else {
                return '正常'
            }
        },
        // 重心检测右脚
        weightRightFoot() {
            if (!this.weightInfo) {
                return ''
            }
            // 右前 > 右后
            if (this.weightInfo.weightC > this.weightInfo.weightB) {
                return '重心偏前'
            } else if (this.weightInfo.weightC < this.weightInfo.weightB) {
                return '重心偏后'
            } else {
                return '正常'
            }
        },
        // 重心检测前后
        weightAround() {
            if (!this.weightInfo) {
                return ''
            }
            const front = this.weightInfo.weightC + this.weightInfo.weightD
            const back = this.weightInfo.weightA + this.weightInfo.weightB
            // 左前+右前 > 左后+右后
            if (front > back) {
                return '重心偏前'
            } else if (front < back) {
                return '重心偏后'
            } else {
                return '正常'
            }
        },
        // 重心检测左右
        weightAbout() {
            if (!this.weightInfo) {
                return ''
            }
            const left = this.weightInfo.weightA + this.weightInfo.weightD
            const right = this.weightInfo.weightC + this.weightInfo.weightB
            // 左前+左后 > 右前+右后
            if (left > right) {
                return '重心偏左'
            } else if (left < right) {
                return '重心偏右'
            } else {
                return '正常'
            }
        }
    },
    mounted() {
        if (this.modelInfo.staticEval === 0) {
            this.bsNoMeasure = true
        } else if (this.modelInfo.evalStatus === 1) {
            this.findBsEvalContrastInfo()
        } else if (this.modelInfo.evalStatus === 0) {
            this.isShow = true
            this.$emit('isBsStatus', this.isShow)
        }
        // this.getWeightOffset()
        this.$hmt.trackPageview('/tab/shape')
    },
    methods: {
        isvapro7unit() {
            return this.isVAPro6 ? 'cm' : '°'
        },
        notTang() {
            if (this.reportMode.indexOf('012') > -1) {
                return false
            }
            return true
        },
        toDecimal(num, digit) {
            return toDecimal2(num, digit)
        },
        // 体态评估
        findBsEvalContrastInfo() {
            this.$apollo
                .query({
                    query: findBsEvalContrastInfo,
                    variables: {
                        scanId: this.modelInfo.scanId,
                        scanTime: this.modelInfo.createTime
                    }
                })
                .then(res => {
                    const data = res.data.findBsEvalContrastInfo
                    const bsEvalContrastInfo = data.data
                    this.loading = false
                    if (data.code === 200 && bsEvalContrastInfo.length) {
                        let bsEvalInfo = JSON.parse(JSON.stringify(bsEvalContrastInfo[0]))
                        let evalInfo = {}
                        for (let key in bsEvalInfo) {
                            if (Object.prototype.hasOwnProperty.call(bsEvalInfo, key)) {
                                if (typeof bsEvalInfo[key] === 'number') {
                                    let evalItem = {
                                        val: this.toDecimal(bsEvalInfo[key], 1),
                                        diff: ''
                                    }
                                    // 有对比值
                                    if (bsEvalContrastInfo[1] && bsEvalContrastInfo[1][key]) {
                                        const diff = bsEvalInfo[key] - bsEvalContrastInfo[1][key]
                                        evalItem.diff = toDecimal2(diff, 1)
                                    }
                                    evalInfo[key] = evalItem
                                }
                            }
                        }
                        this.evalInfo = evalInfo
                        if (bsEvalInfo.headForward > 0) {
                            this.problemList.push('头前引')
                        }
                        if (bsEvalInfo.headSlant > 0 || bsEvalInfo.headSlant < 0) {
                            this.problemList.push('头侧歪')
                        }
                        if (bsEvalInfo.roundShoulderLeft > 15) {
                            this.problemList.push('左圆肩')
                        }
                        if (bsEvalInfo.roundShoulderRight > 15) {
                            this.problemList.push('右圆肩')
                        }
                        if (bsEvalInfo.highLowShoudler > 0 || bsEvalInfo.highLowShoudler < 0) {
                            this.problemList.push('高低肩')
                        }
                        if (bsEvalInfo.pelvisForward > 185) {
                            this.problemList.push('骨盆后移')
                        } else if (bsEvalInfo.pelvisForward < 175) {
                            this.problemList.push('骨盆前移')
                        }
                        if (bsEvalInfo.pelvicForwardTilt > 15) {
                            this.problemList.push('骨盆前倾')
                        } else if (bsEvalInfo.pelvicForwardTilt < 0) {
                            this.problemList.push('骨盆后倾')
                        }
                        if (bsEvalInfo.leftKneeCheck > 190) {
                            this.problemList.push('左膝超伸')
                        } else if (bsEvalInfo.leftKneeCheck < 160) {
                            this.problemList.push('左膝前曲')
                        }
                        if (bsEvalInfo.rightKneeCheck > 190) {
                            this.problemList.push('右膝超伸')
                        } else if (bsEvalInfo.rightKneeCheck < 160) {
                            this.problemList.push('右膝前曲')
                        }
                        if (bsEvalInfo.leftLegXo <= 190 && bsEvalInfo.leftLegXo >= 170) {
                            if (bsEvalInfo.rightLegXo >= 0 && bsEvalInfo.rightLegXo < 170) {
                                this.problemList.push('K型腿')
                            } else if (bsEvalInfo.rightLegXo > 190 && bsEvalInfo.rightLegXo <= 360) {
                                this.problemList.push('D型腿')
                            }
                        } else if (bsEvalInfo.leftLegXo >= 0 && bsEvalInfo.leftLegXo < 170) {
                            if (bsEvalInfo.rightLegXo <= 190 && bsEvalInfo.rightLegXo >= 170) {
                                this.problemList.push('K型腿')
                            } else if (bsEvalInfo.rightLegXo >= 0 && bsEvalInfo.rightLegXo < 170) {
                                this.problemList.push('X型腿')
                            }
                        } else if (bsEvalInfo.leftLegXo > 190 && bsEvalInfo.leftLegXo <= 360) {
                            if (bsEvalInfo.rightLegXo <= 190 && bsEvalInfo.rightLegXo >= 170) {
                                this.problemList.push('D型腿')
                            } else if (bsEvalInfo.rightLegXo > 190 && bsEvalInfo.rightLegXo <= 360) {
                                this.problemList.push('O型腿')
                            }
                        }
                        if (bsEvalInfo.legLengthDiff > 1) {
                            this.problemList.push('左长')
                        } else if (bsEvalInfo.legLengthDiff < -1) {
                            this.problemList.push('右长')
                        }
                        if (this.isVAPro6) {
                            this.findBsDataStateInfo(bsEvalInfo)
                        } else {
                            this.$emit('assessProblem', bsEvalInfo, this.bsDataState)
                        }
                    } else {
                        this.isShow = true
                        this.$emit('isBsStatus', this.isShow)
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
                    if (this.headForward.status !== '正常') {
                        this.problemList.push('头前引')
                    }
                    if (this.headSlant.status !== '正常') {
                        this.problemList.push('头侧歪')
                    }
                    if (this.roundShoulder.left.status !== '正常') {
                        this.problemList.push('左圆肩')
                    }
                    if (this.roundShoulder.right.status !== '正常') {
                        this.problemList.push('右圆肩')
                    }
                    if (this.highLowShoudler.status !== '正常') {
                        this.problemList.push('高低肩')
                    }
                    if (this.pelvisForward.status !== '正常') {
                        this.problemList.push('骨盆前移/后移')
                    }
                    if (this.knee.left.status !== '正常') {
                        this.problemList.push('左膝评估')
                    }
                    if (this.knee.right.status !== '正常') {
                        this.problemList.push('右膝评估')
                    }
                    if (this.leg.status !== '正常') {
                        this.problemList.push('腿型')
                    }
                    this.$emit('assessProblem', bsEvalInfo, this.bsDataState)
                })
        },
        // 获取体重偏移数据
        async getWeightOffset() {
            await this.$apollo
                .query({
                    query: weightOffset,
                    variables: {
                        scanId: this.modelInfo.scanId
                    }
                })
                .then(res => {
                    const info = res.data.weightOffset
                    const weightData = info.data
                    if (info.code === 200) {
                        this.weightInfo = weightData
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        goCoach() {
            this.$router.push('/body/consult-coach')
        },
        handelHelp(name) {
            this.form.name = name
            if (name === '头前引') {
                this.form.desc = '左侧面耳朵点与脖子中心连线和侧面中位线的夹角'
            } else if (name === '头侧歪') {
                this.form.desc = '正面头部中点与脖子中心连线和正面中位线的夹角'
            } else if (name === '左圆肩') {
                this.form.desc = '背部左侧最高点连线和肩部切线的夹角'
            } else if (name === '右圆肩') {
                this.form.desc = '背部右侧最高点连线和肩部切线的夹角'
            } else if (name === '高低肩') {
                this.form.desc = '背面左右肩峰点垂直方向的距离'
            } else if (name === '骨盆前/后移') {
                this.form.desc = '左侧面脖子中心点、髋骨点、脚踝三点连线的夹角'
            } else if (name === '左膝评估') {
                this.form.desc = '左侧面髖骨点、膝关节、脚踝点三点连线的夹角'
            } else if (name === '右膝评估') {
                this.form.desc = '右侧面髖骨点、膝关节、脚踝点三点连线的夹角'
            } else if (name === '腿型') {
                this.form.desc = '左右腿正面髋骨骼点、膝关节、脚踝点连线的夹角'
            } else if (name === '骨盆前/后倾') {
                this.form.desc = '左右髂前上棘点和耻骨联合处形成倒三角面，三角面与地面的垂线的夹角'
            } else if (name === '长短腿') {
                this.form.desc = '背面对比两侧臀线最低点到地面的高度差'
            }

            this.popupAssess = true
        }
    }
}
</script>
<style lang="less" scoped>
.detail-content {
    display: flex;
    justify-content: center;

    .body-assessment-list {
        width: 100%;
    }
}
</style>
