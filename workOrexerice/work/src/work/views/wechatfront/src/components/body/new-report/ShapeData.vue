<!--
 * @Description: Description
 * @Author: zhaoqianqian
 * @Date: 2022-06-29 16:28:46
 * @LastEditors: liutq
 * @LastEditTime: 2025-12-11 17:52:54
-->
<template>
    <div>
        <div :class="['body-assessment-list', $i18n.locale]">
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
            <shapedata-item v-if="!isStatus" :item="pelvisForward" @handelHelp="handelHelp"></shapedata-item>
            <!-- 左膝评估 -->
            <shapedata-item :item="knee.left" @handelHelp="handelHelp"></shapedata-item>
            <!-- 右膝评估 -->
            <shapedata-item :item="knee.right" @handelHelp="handelHelp"></shapedata-item>
            <!-- 腿型 -->
            <div class="data-list">
                <div :class="['thermal-item', { 'isDeviceReport': isDeviceReport }]">
                    <i>|</i>
                    <span class="name">
                        {{ $t('shape.explain[8].title') }}
                        <img
                            src="@/assets/images/new-report/report/help.png"
                            alt
                            @click.prevent="handelHelp($t('shape.explain[8].title'))"
                        />
                    </span>
                    <div class="shape-list">
                        <span class="title">{{ $t('shape.item.deviate') }}</span>
                        <div alt class="symbol-ico"></div>
                        <span :class="['val-list', { 'val-color': leg.status !== $t('shape.item.normal') }]">
                            {{ 'L:' +
                            leg.left.val | onHandler}} - {{ 'R:' + leg.right.val | onHandler }}
                        </span>
                        <div alt class="symbol-ico"></div>
                        <span class="shape-status">
                            <span :class="['status', { 'status-color': leg.status !== $t('shape.item.normal') }]">
                                {{
                                leg.status }}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <!-- 长短腿 已经迁移别处-->
            <shapedata-item v-if="false" :item="legLengthDiff" @handelHelp="handelHelp"></shapedata-item>
            <div v-if="isStatus" style="margin-top: 40px">
                <!-- 骨盆前/后移 -->
                <shapedata-item v-if="isNewMathTt" :isOnly="true" :index="3" :pelvisForwardState="bsDataState.pelvisForwardState" :item="pelvisForward" @handelHelp="handelHelp"></shapedata-item>
                <shapedata-item v-else :isOnly="true" :index="0" :item="pelvisForward" @handelHelp="handelHelp"></shapedata-item>
                <!-- 骨盆前/后倾 -->
                <shapedata-item :isOnly="true" :index="1" :item="pelvicForwardTilt" @handelHelp="handelHelp"></shapedata-item>
                <!-- 长短腿 -->
                <shapedata-item :isOnly="true" :index="2" :item="legLengthDiff" @handelHelp="handelHelp"></shapedata-item>
            </div>
        </div>
        <!--体态评估-弹出说明-->
        <van-popup v-model="popupAssess" class="body-composition-popup" popup-transition="popup-fade">
            <!-- 防止在pupop里滚动，body也跟着滚 -->
            <div class="popup-container" @touchmove.prevent>
                <h5>{{ form.name }}{{ $t('shape.item.result') }}</h5>
                <div class="first-intro content">
                    <p>{{ form.desc }}</p>
                </div>
                <div class="pop-btn-action" @click="popupAssess = false">{{ $t('model.know') }}</div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import { findBsEvalContrastInfo, getScanIdGetInfo, findBsDataStateInfo } from '@/assets/js/apolloGql.js'
import { toDecimal2, _toDecimal } from '@/assets/js/util.js'
import ShapedataItem from '@/components/common/new-report/ShapeDataItem'
import { isVAPro7 } from '@/types/device.js'
import { mapState } from "vuex"
export default {
    components: {
        ShapedataItem,
    },
    filters: {
        onHandler(value) {
            if (value.indexOf('undefined') > -1) {
                return '-'
            } else {
                return value
            }
        },
    },
    props: {
        notMeasured: Boolean,
        measuredFailed: Boolean,
        notComposition: Boolean,
        compositionFailed: Boolean,
        massInfo: Object,
    },
    data() {
        return {
            isDeviceReport: window.sessionStorage.getItem('isDeviceReport'),
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            popupAssess: false,
            body: {},
            form: {
                name: '',
                desc: '',
                advice: '',
                result: 0,
                status: '',
            },
            problemList: [],
            isShow: this.notComposition,
            bsNoMeasure: false,
            loading: true,
            evalInfo: {
                headForward: { name: '' },
                headSlant: { name: '' },
                highLowShoudler: { name: '' },
                leftKneeCheck: { name: '' },
                leftLegXo: { name: '' },
                pelvisForward: { name: '' },
                pelvicForwardTilt: { name: '' },
                rightKneeCheck: { name: '' },
                rightLegXo: { name: '' },
                roundShoulderLeft: { name: '' },
                roundShoulderRight: { name: '' },
                legLengthDiff: { name: '' },
            },
            unit: window.localStorage.getItem('unit'),
            isStatus: false,
            bsInfo: {},
            isVAPro7: isVAPro7(),
            bsDataState: {},
            isNewDate: {}
        }
    },
    computed: {
        ...mapState(["isNewMathTt"]),
        // 头前引
        headForward() {
            const info = this.evalInfo['headForward']
            if (!info) {
                return {}
            }
            const val = this.isNewMathTt ? this.unit === 'metric' ? _toDecimal(info.val * 2.54, 1) : info.val : info.val
            // 结论
            let status
            if (this.isVAPro7 || this.isNewMathTt) {
                switch (this.bsDataState.headForwardState) {
                    case 1:
                        status = this.$t('shape.item.abnormal')
                        break
                    case 2:
                        status = this.$t('shape.item.keAbnormal')
                        break

                    default:
                        status = this.$t('shape.item.normal')
                        break
                }
            } else {
                status = val > 0 ? this.$t('shape.item.abnormal') : this.$t('shape.item.normal')
            }
            return {
                name: this.$t('shape.explain[0].title'),
                val: val + this.isvapro7unit(),
                diff: info.diff !== '--' ? `${info.diff >= 0 ? '+' + info.diff : info.diff}${this.isvapro7unit()}` : info.diff,
                status: status,
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
            if (this.isVAPro7 || this.isNewMathTt) {
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
                status =
                    val > 0
                        ? this.$t('shape.exception[0].title')
                        : val < 0
                        ? this.$t('shape.exception[1].title')
                        : this.$t('shape.item.normal')
            }
            return {
                name: this.$t('shape.explain[1].title'),
                val: val + '°',
                diff: info.diff !== '--' ? `${info.diff >= 0 ? '+' + info.diff : info.diff}°` : info.diff,
                status: status,
            }
        },
        // 圆肩
        roundShoulder() {
            const leftInfo = this.evalInfo['roundShoulderLeft']
            const rightInfo = this.evalInfo['roundShoulderRight']
            if (!leftInfo || !rightInfo) {
                return {}
            }
            const leftVal = this.isNewMathTt ? this.unit === 'metric' ? _toDecimal(leftInfo.val * 2.54, 1) : leftInfo.val : leftInfo.val
            // 结论
            let leftStatus

            if (this.isVAPro7 || this.isNewMathTt) {
                switch (this.bsDataState.leftRoundShoulderState) {
                    case 1:
                        leftStatus = this.$t('shape.item.abnormal')
                        break
                    case 2:
                        leftStatus = this.$t('shape.item.keAbnormal')
                        break

                    default:
                        leftStatus = this.$t('shape.item.normal')
                        break
                }
            } else {
                leftStatus = leftVal > 15 ? this.$t('shape.item.abnormal') : this.$t('shape.item.normal')
            }
            const left = {
                name: this.$t('shape.explain[2].title'),
                val: leftVal + this.isvapro7unit(),
                diff:
                    leftInfo.diff !== '--'
                        ? `${leftInfo.diff >= 0 ? '+' + leftInfo.diff : leftInfo.diff}${this.isvapro7unit()}`
                        : leftInfo.diff,
                status: leftStatus,
            }

            const rightVal = this.isNewMathTt ? this.unit === 'metric' ? _toDecimal(rightInfo.val * 2.54, 1) : rightInfo.val : rightInfo.val
            // 结论
            let rightStatus
            if (this.isVAPro7 || this.isNewMathTt) {
                switch (this.bsDataState.rightRoundShoulderState) {
                    case 1:
                        rightStatus = this.$t('shape.item.abnormal')
                        break
                    case 2:
                        rightStatus = this.$t('shape.item.keAbnormal')
                        break

                    default:
                        rightStatus = this.$t('shape.item.normal')
                        break
                }
            } else {
                rightStatus = rightVal > 15 ? this.$t('shape.item.abnormal') : this.$t('shape.item.normal')
            }
            const right = {
                name: this.$t('shape.explain[3].title'),
                val: rightVal + this.isvapro7unit(),
                diff:
                    rightInfo.diff !== '--'
                        ? `${rightInfo.diff >= 0 ? '+' + rightInfo.diff : rightInfo.diff}${this.isvapro7unit()}`
                        : rightInfo.diff,
                status: rightStatus,
            }
            return {
                left: left,
                right: right,
            }
        },
        // 高低肩
        highLowShoudler() {
            const info = this.evalInfo['highLowShoudler']
            if (!info) {
                return {}
            }
            const val =  this.isNewMathTt ? info.val : this.unit === 'metric' ? _toDecimal(info.val * 2.54, 1) : info.val
            // 结论
            let status
            if (this.isVAPro7 || this.isNewMathTt) {
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
                status =
                    val > 0
                        ? this.$t('shape.exception[2].title')
                        : val < 0
                        ? this.$t('shape.exception[3].title')
                        : this.$t('shape.item.normal')
            }
            return {
                name: this.$t('shape.explain[4].title'),
                val: val + (this.isNewMathTt ? '°' : `${this.unit === 'imperial' ? 'in.' : 'cm'}`),
                diff: info.diff !== '--' ? `${info.diff >= 0 ? '+' + info.diff : info.diff}${this.isNewMathTt ? '°' : 'cm'}` : info.diff,
                status: status,
            }
        },
        // 骨盆前/后移
        pelvisForward() {
            const info = this.evalInfo['pelvisForward']
            if (!info || (this.isNewMathTt && this.bsDataState.pelvisForwardState === -1000)) {
                return {}
            }
            const val = info.val
            // 结论
            let status
            if (this.isVAPro7 || this.isNewMathTt) {
                status =
                    this.bsDataState.pelvisForwardState === 2
                        ? this.$t('shape.item.keAbnormal')
                        : this.bsDataState.pelvisForwardState === 1
                        ? this.$t('shape.item.abnormal')
                        : this.$t('shape.item.normal')
            } else {
                status =
                    val > 185
                        ? this.$t('shape.exception[4].title')
                        : val < 175
                        ? this.$t('shape.exception[5].title')
                        : this.$t('shape.item.normal')
            }
            return {
                name: (this.isVAPro7 || this.isNewMathTt) ? '骨盆前移' : this.$t('shape.explain[5].title'),
                val: val + this.isvapro7unit(),
                diff: info.diff !== '--' ? `${info.diff >= 0 ? '+' + info.diff : info.diff}${this.isvapro7unit()}` : info.diff,
                status: status,
            }
        },
        // 骨盆前/后倾
        pelvicForwardTilt() {
            const info = this.evalInfo['pelvicForwardTilt']
            if (!info || (this.isNewMathTt && this.bsDataState.pelvisForwardState === -1000)) {
                return {}
            }
            const val = info.val
            // 结论
            let status
            if (this.isVAPro7 || this.isNewMathTt) {
                status =
                    this.bsDataState.pelvisForwardState === 2
                        ? this.$t('shape.item.keAbnormal')
                        : this.bsDataState.pelvisForwardState === 1
                        ? this.$t('shape.item.abnormal')
                        : this.$t('shape.item.normal')
            } else {
                status = !this.bsInfo.pelvicForwardTiltStatus
                    ? '--'
                    : val > 15
                    ? this.$t('shape.exception[14].title')
                    : val < 0
                    ? this.$t('shape.exception[15].title')
                    : this.$t('shape.item.normal')
            }
            return {
                name: this.$t('shape.explain[9].title'),
                val: (this.isVAPro7 || this.isNewMathTt) && this.isNewDate.pelvicForwardTiltStatus ? info.val + '°' : !this.bsInfo.pelvicForwardTiltStatus ? '--' : info.val + '°',
                diff: info.diff !== '--' ? `${info.diff >= 0 ? '+' + info.diff : info.diff}°` : info.diff,
                status: status,
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
            if (this.isVAPro7 || this.isNewMathTt) {
                switch (this.bsDataState.leftKneeCheckState) {
                    case 1:
                        leftStatus = this.$t('shape.exception[7].title')
                        break
                    case 2:
                        leftStatus = this.$t('shape.exception[6].title')
                        break
                    case 3:
                        leftStatus = this.$t('shape.exception[7].title')
                        break
                    case 4:
                        leftStatus = this.$t('shape.exception[6].title')
                        break
                    default:
                        leftStatus = this.$t('shape.item.normal')
                        break
                }
            } else {
                leftStatus =
                    leftVal > 190
                        ? this.$t('shape.exception[6].title')
                        : leftVal < 160
                        ? this.$t('shape.exception[7].title')
                        : this.$t('shape.item.normal')
            }
            const left = {
                name: this.$t('shape.explain[6].title'),
                val: leftVal + '°',
                diff:
                    leftInfo.diff !== '--'
                        ? `${leftInfo.diff >= 0 ? '+' + leftInfo.diff : leftInfo.diff}°`
                        : leftInfo.diff,
                status: leftStatus,
            }

            const rightVal = rightInfo.val
            // 结论
            let rightStatus
            if (this.isVAPro7 || this.isNewMathTt) {
                switch (this.bsDataState.rightKneeCheckState) {
                    case 1:
                        rightStatus = this.$t('shape.exception[9].title')
                        break
                    case 2:
                        rightStatus = this.$t('shape.exception[8].title')
                        break
                    case 3:
                        rightStatus = this.$t('shape.exception[9].title')
                        break
                    case 4:
                        rightStatus = this.$t('shape.exception[8].title')
                        break
                    default:
                        rightStatus = this.$t('shape.item.normal')
                        break
                }
            } else {
                rightStatus =
                    rightVal > 190
                        ? this.$t('shape.exception[8].title')
                        : rightVal < 160
                        ? this.$t('shape.exception[9].title')
                        : this.$t('shape.item.normal')
            }
            const right = {
                name: this.$t('shape.explain[7].title'),
                val: rightVal + '°',
                diff:
                    rightInfo.diff !== '--'
                        ? `${rightInfo.diff >= 0 ? '+' + rightInfo.diff : rightInfo.diff}°`
                        : rightInfo.diff,
                status: rightStatus,
            }
            return {
                left: left,
                right: right,
            }
        },
        // 腿型
        leg() {
            const leftInfo = this.evalInfo['leftLegXo']
            const rightInfo = this.evalInfo['rightLegXo']
            if (!leftInfo || !rightInfo) {
                // eslint-disable-next-line object-curly-spacing
                return { left: { val: '' }, right: { val: '' } }
            }
            const leftVal = leftInfo.val
            const rightVal = rightInfo.val
            // 结论
            let status = ''

            if (this.isVAPro7 || this.isNewMathTt) {
                switch (this.bsDataState.legType) {
                    case 0:
                        status = this.$t('shape.item.normal')
                        break
                    case 1:
                        status = this.$t('shape.item.abnormal')
                        break
                    case 2:
                        status = this.$t('shape.exception[10].title')
                        break
                    case 3:
                        status = this.$t('shape.exception[11].title')
                        break
                    case 4:
                        status = this.$t('shape.exception[12].title')
                        break
                    case 5:
                        status = this.$t('shape.exception[13].title')
                        break
                    default:
                        status = this.$t('shape.item.keAbnormal')
                        break
                }
            } else {
                if (leftVal <= 190 && leftVal >= 170) {
                    if (rightVal <= 190 && rightVal >= 170) {
                        status = this.$t('shape.item.normal')
                    } else if (rightVal >= 0 && rightVal < 170) {
                        status = this.$t('shape.exception[10].title')
                    } else if (rightVal > 190 && rightVal <= 360) {
                        status = this.$t('shape.exception[11].title')
                    }
                } else if (leftVal >= 0 && leftVal < 170) {
                    if (rightVal <= 190 && rightVal >= 170) {
                        status = this.$t('shape.exception[10].title')
                    } else if (rightVal >= 0 && rightVal < 170) {
                        status = this.$t('shape.exception[12].title')
                    } else if (rightVal > 190 && rightVal <= 360) {
                        status = this.$t('shape.item.abnormal')
                    }
                } else if (leftVal > 190 && leftVal <= 360) {
                    if (rightVal <= 190 && rightVal >= 170) {
                        status = this.$t('shape.exception[11].title')
                    } else if (rightVal >= 0 && rightVal < 170) {
                        status = this.$t('shape.item.abnormal')
                    } else if (rightVal > 190 && rightVal <= 360) {
                        status = this.$t('shape.exception[13].title')
                    }
                }
            }

            const left = {
                val: leftVal + '°',
                diff:
                    leftInfo.diff !== '--'
                        ? `${leftInfo.diff >= 0 ? '+' + leftInfo.diff : leftInfo.diff}°`
                        : leftInfo.diff,
            }

            const right = {
                val: rightVal + '°',
                diff:
                    rightInfo.diff !== '--'
                        ? `${rightInfo.diff >= 0 ? '+' + rightInfo.diff : rightInfo.diff}°`
                        : rightInfo.diff,
            }
            return {
                left: left,
                right: right,
                status: status,
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
            const status = !this.bsInfo.isLegLengthDiff
                ? '--'
                : val > 1
                ? this.$t('shape.exception[16].title')
                : val < -1
                ? this.$t('shape.exception[17].title')
                : this.$t('shape.item.normal')
            return {
                name: this.$t('shape.explain[10].title'),
                val: (this.isVAPro7 || this.isNewMathTt) && this.isNewDate.isLegLengthDiff ? val + `${this.unit === 'imperial' ? 'in.' : 'cm'}` : !this.bsInfo.isLegLengthDiff ? '--' : val + `${this.unit === 'imperial' ? 'in.' : 'cm'}`,
                diff: info.diff !== '--' ? `${info.diff >= 0 ? '+' + info.diff : info.diff}cm` : info.diff,
                status: status,
            }
        },
    },
    mounted() {
        this.findBsDataStateInfo()
        this.findBsEvalContrastInfo()
        this.getScanIdGetInfo()
        if (this.modelInfo.staticEval === 0) {
            this.bsNoMeasure = true
        } else if (this.modelInfo.evalStatus === 1) {
            // vapro7更新体态后调用两次这个  会两次调用函数 出现两个头前引
            // if (!this.isVAPro7 && !this.isNewMathTt) {
            //     this.findBsEvalContrastInfo()
            // }
            this.findBsEvalContrastInfo()
        } else if (this.modelInfo.evalStatus === 0) {
            this.isShow = true
            this.$emit('isBsStatus', this.isShow)
        }
    },
    methods: {
        toDecimal(num, digit) {
            return toDecimal2(num, digit)
        },
        isvapro7unit() {
            return (this.isVAPro7 || this.isNewMathTt) ? 'cm' : '°'
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
                    console.log(this.massInfo.scanMode, 88888)
                    this.isStatus = data.data.indexOf('010') > -1 && (this.massInfo.scanMode || (this.massInfo.scanId.split('-')[0].slice(0, 2) !== 'M6' && this.modelInfo.scanId.split('-')[0].slice(0, 2) !== 'M2' && this.modelInfo.scanId.split('-')[0].slice(0, 2) !== 'N2'))
                })
        },
        // 体态评估状态值
        findBsDataStateInfo() {
            this.$apollo
                .query({
                    query: findBsDataStateInfo,
                    variables: {
                        scanId: this.massInfo.scanId,
                    },
                    // fetchPolicy: 'network-only'
                })
                .then((res) => {
                    const data = res.data.findBsDataStateInfo
                    console.log(
                        data,
                        '我看看状态值>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
                    )
                    this.bsDataState = data.data
                    // this.loading = false
                    // console.log( this.bsDataState, "我看看状态值")
                })
        },
        // 体态评估
        findBsEvalContrastInfo() {
            this.$apollo
                .query({
                    query: findBsEvalContrastInfo,
                    variables: {
                        scanId: this.massInfo.scanId,
                        scanTime: this.massInfo.createTime,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const data = res.data.findBsEvalContrastInfo
                    const bsEvalContrastInfo = data.data
                    this.loading = false
                    if (data.code === 200 && bsEvalContrastInfo.length) {
                        let bsEvalInfo = JSON.parse(JSON.stringify(bsEvalContrastInfo[0]))
                        let evalInfo = {}
                        this.isNewDate = bsEvalInfo
                        for (let key in bsEvalInfo) {
                            if (Object.prototype.hasOwnProperty.call(bsEvalInfo, key)) {
                                if (typeof bsEvalInfo[key] === 'number') {
                                    let evalItem = {
                                        val: this.toDecimal(bsEvalInfo[key], 1),
                                        diff: '',
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
                        if (!this.isVAPro7 && !this.isNewMathTt) {
                            if (bsEvalInfo.headForward > 0) {
                                this.problemList.push(this.$t('shape.item.head'))
                            }
                            if (bsEvalInfo.headSlant > 0 || bsEvalInfo.headSlant < 0) {
                                this.problemList.push(this.$t('shape.item.headSlant'))
                            }
                            if (bsEvalInfo.roundShoulderLeft > 15) {
                                this.problemList.push(this.$t('shape.item.roundShoulderLeft'))
                            }
                            if (bsEvalInfo.roundShoulderRight > 15) {
                                this.problemList.push(this.$t('shape.item.roundShoulderRight'))
                            }
                            if (bsEvalInfo.highLowShoudler > 0 || bsEvalInfo.highLowShoudler < 0) {
                                this.problemList.push(this.$t('shape.item.highLowShoudler'))
                            }
                            if (bsEvalInfo.pelvisForward > 185) {
                                this.problemList.push(this.$t('shape.exception[4].title'))
                            } else if (bsEvalInfo.pelvisForward < 175) {
                                this.problemList.push(this.$t('shape.exception[5].title'))
                            }
                            if (bsEvalInfo.leftKneeCheck > 190) {
                                this.problemList.push(this.$t('shape.exception[6].title'))
                            } else if (bsEvalInfo.leftKneeCheck < 160) {
                                this.problemList.push(this.$t('shape.exception[7].title'))
                            }
                            if (bsEvalInfo.rightKneeCheck > 190) {
                                this.problemList.push(this.$t('shape.exception[8].title'))
                            } else if (bsEvalInfo.rightKneeCheck < 160) {
                                this.problemList.push(this.$t('shape.exception[9].title'))
                            }
                            if (bsEvalInfo.leftLegXo <= 190 && bsEvalInfo.leftLegXo >= 170) {
                                if (bsEvalInfo.rightLegXo >= 0 && bsEvalInfo.rightLegXo < 170) {
                                    this.problemList.push(this.$t('shape.exception[10].title'))
                                } else if (bsEvalInfo.rightLegXo > 190 && bsEvalInfo.rightLegXo <= 360) {
                                    this.problemList.push(this.$t('shape.exception[11].title'))
                                }
                            } else if (bsEvalInfo.leftLegXo >= 0 && bsEvalInfo.leftLegXo < 170) {
                                if (bsEvalInfo.rightLegXo <= 190 && bsEvalInfo.rightLegXo >= 170) {
                                    this.problemList.push(this.$t('shape.exception[10].title'))
                                } else if (bsEvalInfo.rightLegXo >= 0 && bsEvalInfo.rightLegXo < 170) {
                                    this.problemList.push(this.$t('shape.exception[12].title'))
                                }
                            } else if (bsEvalInfo.leftLegXo > 190 && bsEvalInfo.leftLegXo <= 360) {
                                if (bsEvalInfo.rightLegXo <= 190 && bsEvalInfo.rightLegXo >= 170) {
                                    this.problemList.push(this.$t('shape.exception[11].title'))
                                } else if (bsEvalInfo.rightLegXo > 190 && bsEvalInfo.rightLegXo <= 360) {
                                    this.problemList.push(this.$t('shape.exception[13].title'))
                                }
                            }
                            this.bsInfo = bsEvalInfo
                            this.$emit('assessProblem', bsEvalInfo)
                        } else {
                            this.$emit('assessProblem', bsEvalInfo, this.bsDataState)
                        }
                    } else {
                        this.isShow = true
                        this.$emit('isBsStatus', this.isShow)
                    }
                })
        },
        handelHelp(name) {
            console.log(this.form, '-------')
            this.form.name = name
            if (this.isVAPro7 || this.isNewMathTt) {
                if (name === '头前引') {
                    this.form.desc = '耳朵与人体重力线之间的垂直距离'
                } else if (name === '头侧歪') {
                    this.form.desc = '左右耳朵的连线与水平线之间的角度'
                } else if (name === '左圆肩') {
                    this.form.desc = '左肩峰位置与重力线的垂直距离'
                } else if (name === '右圆肩') {
                    this.form.desc = '右肩峰位置与重力线的垂直距离'
                } else if (name === '高低肩') {
                    this.form.desc = '两侧颈根与肩峰连线的差值'
                } else if (name === '骨盆前移') {
                    this.form.desc = '髋关节与人体重力线之间的垂直距离'
                } else if (name === '左膝评估') {
                    this.form.desc = '矢状面上，踝关节、左膝关节下1cm和髋关节的夹角'
                } else if (name === '右膝评估') {
                    this.form.desc = '矢状面上，踝关节、右膝关节下1cm和髋关节的夹角'
                } else if (name === '腿型') {
                    this.form.desc = '冠状面上，左右髋关节、膝关节以及踝关节之间的夹角'
                } else if (name === '骨盆前/后倾') {
                    this.form.desc = '左右髂前上棘点和耻骨联合处形成倒三角面，三角面与地面的垂线的夹角'
                } else if (name === '长短腿') {
                    this.form.desc = '背面对比两侧臀线最低点到地面的高度差'
                }
            } else {
                if (name === this.$t('shape.explain[0].title')) {
                    this.form.desc = this.$t('shape.explain[0].msg')
                }
                if (name === this.$t('shape.explain[1].title')) {
                    this.form.desc = this.$t('shape.explain[1].msg')
                }
                if (name === this.$t('shape.explain[2].title')) {
                    this.form.desc = this.$t('shape.explain[2].msg')
                }
                if (name === this.$t('shape.explain[3].title')) {
                    this.form.desc = this.$t('shape.explain[3].msg')
                }
                if (name === this.$t('shape.explain[4].title')) {
                    this.form.desc = this.$t('shape.explain[4].msg')
                }
                if (name === this.$t('shape.explain[5].title')) {
                    this.form.desc = this.$t('shape.explain[5].msg')
                }
                if (name === this.$t('shape.explain[6].title')) {
                    this.form.desc = this.$t('shape.explain[6].msg')
                }
                if (name === this.$t('shape.explain[7].title')) {
                    this.form.desc = this.$t('shape.explain[7].msg')
                }
                if (name === this.$t('shape.explain[8].title')) {
                    this.form.desc = this.$t('shape.explain[8].msg')
                }
                if (name === this.$t('shape.explain[9].title')) {
                    this.form.desc = this.$t('shape.explain[9].msg')
                }
                if (name === this.$t('shape.explain[10].title')) {
                    this.form.desc = this.$t('shape.explain[10].msg')
                }
            }
            this.popupAssess = true
        },
    },
}
</script>
<style lang="less" scoped>
.body-assessment-list {
    padding: 0 11px;
    margin-top: 20px;
    // background-color: #122349;
}

.data-list {
    width: 351px;
    height: 92px;
    text-align: left;
    background: url(../../../assets/images/new-report/report/bj31.png) center no-repeat;
    background-size: 100% 100%;
    margin-bottom: 10px;

    .thermal-item {
        padding-top: 12px;

        .name {
            img {
                width: 10px;
                height: 10px;
            }
        }
    }

    span {
        font-size: 12px;
        color: #ffffff;
    }

    i {
        font-style: normal;
        margin: 10px 10px;
        background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        padding: 0 0.01px;  /* 防止文本裁剪异常 */
    }
    .isDeviceReport{
         i{
            position: relative;
            top: -4px;
            display: inline-block;
            width: 2px;
            height: 10px;
            -webkit-background-clip: unset;
            background-clip: unset;
            -webkit-text-fill-color: unset;
            color: inherit;
        }
    }

    .shape-list {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;

        .title {
            font-size: 12px;
            color: #8aa3be;
            // padding-left: 28px;
        }

        img {
            width: 10px;
            height: 2px;
            margin: 0px 13px 3px 13px;
        }

        .symbol-ico {
            min-width: 10px;
            height: 2px;
            // margin-left: 16px;
            background: url('../../../assets/images/new-report/report/symbol_ico.png') repeat-x;
            background-size: cover;
        }

        .val-list {
            display: inline-block;
            width: 154px;
            height: 22px;
            font-size: 16px;
            line-height: 22px;
            text-align: center;
            // background-color: #CB4745;
            background-color: #33c070;
            border-radius: 10px;
        }

        .shape-status {
            text-align: left;
            width: 66px;
        }

        .status {
            font-size: 12px;
            color: #33c070;
        }

        .status-color {
            color: #e64444;
        }

        .val-color {
            background-color: #cb4745;
        }
    }

    /deep/.body-composition-popup .popup-container > h5 {
        padding: 16px 5px !important;
    }
}

&.en-US,
&.it-IT,
&.es-ES {
    .thermal-item {
        .name {
            img {
                width: 10px;
                height: 10px;
            }
        }
    }
}
</style>
<style>
.body-composition-popup .popup-container > h5 {
    word-break: break-word;
    padding: 16px 5px !important;
}
</style>

