<!--
 * @Descripttion: 体态评估报告
 * @Author: gaoyuanyuan
 * @Date: 2020-02-14 17:31:24
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @LastEditTime: 2025-05-26 15:03:37
 -->
 <template>
    <div class="bs-report" v-cloak>
        <div class="shape-model">
            <div class="item" v-for="(model, idx) in models" :key="idx">
                <span>{{ model.name }}</span>
                <img v-if="model.img" :src="model.img" @load="imageLoaded" @error="imageLoadError(model)" />
                <img class="default" v-else-if="isGetImg" @load="imageLoaded" src="@/assets/images/default_model.svg" />
            </div>
        </div>
        <div class="posture">
            <div class="posture-title">
                <h2>
                    体态评估概览
                    <em>*为保证数据准确性，需穿着紧身衣服、扎起头发</em>
                </h2>
                <span>*报告内容仅供参考，不作为诊断或医疗依据</span>
            </div>
            <div :class="['shape-table', { 'body-slope': bodySlope }, {'body-slope1': isShowFree}]">
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th></th>
                            <th>偏移值</th>
                            <th>与上次对比</th>
                            <th>评估结论</th>
                            <th>风险提示</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- 头前引 -->
                        <tr>
                            <td>
                                <span class="name">头前引</span>
                            </td>
                            <td>
                                <span v-if="headForward" class="val">{{ toDecimal(headForward.val, 1) }}cm</span>
                            </td>
                            <td>
                                <contrast v-if="headForward" :val="headForward.contrast" unit="cm"></contrast>
                            </td>
                            <td>
                                <span
                                    class="msg"
                                    v-if="headForward"
                                >{{ headForward.conclusion }}</span>
                            </td>
                            <td>
                                <span class="msg" v-if="headForward">{{ headForward.risk }}</span>
                            </td>
                        </tr>
                        <!-- 头侧歪 -->
                        <tr>
                            <td>
                                <span class="name">头侧歪</span>
                            </td>
                            <td>
                                <span v-if="headSlant" class="val">{{ toDecimal(headSlant.val, 1) }}°</span>
                            </td>
                            <td>
                                <contrast v-if="headSlant" :val="headSlant.contrast" unit="°"></contrast>
                            </td>
                            <td>
                                <span
                                    class="msg"
                                    v-if="headSlant"
                                >{{ headSlant.conclusion }}</span>
                            </td>
                            <td>
                                <span class="msg" v-if="headSlant">{{ headSlant.risk }}</span>
                            </td>
                        </tr>
                        <!-- 左圆肩 -->
                        <tr>
                            <td>
                                <span class="name">左圆肩</span>
                            </td>
                            <td>
                                <span
                                    v-if="roundShoulder && roundShoulder.left"
                                    class="val"
                                >{{ toDecimal(roundShoulder.left.val, 1) }}cm</span>
                            </td>
                            <td>
                                <contrast
                                    v-if="roundShoulder && roundShoulder.left"
                                    :val="roundShoulder.left.contrast"
                                    unit="cm"
                                ></contrast>
                            </td>
                            <td style="border-right-color: #ced7e0;">
                                <span
                                    class="msg"
                                    v-if="roundShoulder && roundShoulder.left"
                                >{{ roundShoulder.left.conclusion }}</span>
                            </td>
                            <td rowspan="2">
                                <span
                                    class="msg"
                                    v-if="roundShoulder"
                                >{{ roundShoulder.left.risk !== '--' ? roundShoulder.left.risk : roundShoulder.right.risk !== '--' ? roundShoulder.right.risk : '--' }}</span>
                            </td>
                        </tr>
                        <!-- 右圆肩 -->
                        <tr>
                            <td>
                                <span class="name">右圆肩</span>
                            </td>
                            <td>
                                <span
                                    v-if="roundShoulder && roundShoulder.right"
                                    class="val"
                                >{{ toDecimal(roundShoulder.right.val, 1) }}cm</span>
                            </td>
                            <td>
                                <contrast
                                    v-if="roundShoulder && roundShoulder.right"
                                    :val="roundShoulder.right.contrast"
                                    unit="cm"
                                ></contrast>
                            </td>
                            <td style="border-right: #ced7e0 1px solid;">
                                <span
                                    class="msg"
                                    v-if="roundShoulder && roundShoulder.right"
                                >{{ roundShoulder.right.conclusion }}</span>
                            </td>
                        </tr>
                        <!-- 高低肩 -->
                        <tr>
                            <td>
                                <span class="name">高低肩</span>
                            </td>
                            <td>
                                <span v-if="highLowShoudler" class="val">{{ toDecimal(highLowShoudler.val, 1) }}°</span>
                            </td>
                            <td>
                                <contrast v-if="highLowShoudler" :val="highLowShoudler.contrast" unit="°"></contrast>
                            </td>
                            <td>
                                <span
                                    class="msg"
                                    v-if="highLowShoudler"
                                >{{ highLowShoudler.conclusion }}</span>
                            </td>
                            <td>
                                <span class="msg" v-if="highLowShoudler">{{ highLowShoudler.risk }}</span>
                            </td>
                        </tr>
                        <!-- 骨盆前/后移 -->
                        <tr>
                            <td>
                                <span class="name">骨盆前移</span>
                            </td>
                            <td>
                                <span v-if="pelvisForward" class="val">{{ toDecimal(pelvisForward.val, 1) }}cm</span>
                            </td>
                            <td>
                                <contrast v-if="pelvisForward" :val="pelvisForward.contrast" unit="cm"></contrast>
                            </td>
                            <td>
                                <span
                                    class="msg"
                                    v-if="pelvisForward"
                                >{{ pelvisForward.conclusion }}</span>
                            </td>
                            <td>
                                <span class="msg" v-if="pelvisForward">{{ pelvisForward.risk }}</span>
                            </td>
                        </tr>
                        <!-- 骨盆前/后倾 -->
                        <tr v-if="isShowFree">
                            <td>
                                <span class="name">骨盆前/后倾</span>
                            </td>
                            <td>
                                <span v-if="pelvicForwardTilt && pelvicForwardTilt.status" class="val">{{ toDecimal(pelvicForwardTilt.val, 1) }}°</span>
                                <span class="val" v-else >--</span>
                            </td>
                            <td>
                                <contrast v-if="pelvicForwardTilt" :val="pelvicForwardTilt.contrast" unit="°"></contrast>
                            </td>
                            <td>
                                <span class="msg" v-if="pelvicForwardTilt && pelvicForwardTilt.status">{{ pelvicForwardTilt.conclusion}}</span>
                                    <span class="msg" v-else >--</span>
                            </td>
                            <td>
                                <span class="msg" v-if="pelvicForwardTilt && pelvicForwardTilt.status">{{ pelvicForwardTilt.risk }}</span>
                                <span class="msg" v-else></span>
                            </td>
                        </tr>
                        <!-- 左膝评估 -->
                        <tr>
                            <td>
                                <span class="name">左膝评估</span>
                            </td>
                            <td>
                                <span v-if="knee && knee.left" class="val">{{ toDecimal(knee.left.val, 1) }}°</span>
                            </td>
                            <td>
                                <contrast v-if="knee && knee.left" :val="knee.left.contrast" unit="°"></contrast>
                            </td>
                            <td style="border-right-color: #ced7e0;">
                                <span
                                    class="msg"
                                    v-if="knee && knee.left"
                                >{{ knee.left.conclusion}}</span>
                            </td>
                            <td rowspan="2">
                                <span
                                    class="msg"
                                    v-if="knee"
                                >{{ knee.left.risk !== '--' ? knee.left.risk : knee.right.risk !== '--' ? knee.right.risk : '--' }}</span>
                            </td>
                        </tr>
                        <!-- 右膝评估 -->
                        <tr>
                            <td>
                                <span class="name">右膝评估</span>
                            </td>
                            <td>
                                <span v-if="knee && knee.right" class="val">{{ toDecimal(knee.right.val, 1) }}°</span>
                            </td>
                            <td>
                                <contrast v-if="knee && knee.right" :val="knee.right.contrast" unit="°"></contrast>
                            </td>
                            <td style="border-right: #ced7e0 1px solid;">
                                <span
                                    class="msg"
                                    v-if="knee && knee.right"
                                >{{ knee.right.conclusion }}</span>
                            </td>
                        </tr>
                        <!-- 腿型 -->
                        <tr>
                            <td rowspan="2" :style="{ 'border-bottom-color': bodySlope ? '#ced7e0' : '#009fe8' }">
                                <span class="name">腿型</span>
                            </td>
                            <td style="border-bottom-color: transparent;">
                                <span
                                    :style="!isShowFree?'margin-top: 15px;':''"
                                    v-if="leg"
                                    class="val"
                                >左腿：{{ toDecimal(leg.leftVal, 1) }}°</span>
                            </td>
                            <td style="border-bottom-color: transparent;">
                                <contrast :style="!isShowFree?'margin-top: 15px;':''" v-if="leg" :val="leg.leftContrast" unit="°"></contrast>
                            </td>
                            <td rowspan="2" :style="{ 'border-bottom-color': bodySlope ? '#ced7e0' : '#009fe8' }">
                                <span
                                    class="msg"
                                    v-if="leg"
                                >{{ leg.conclusion }}</span>
                            </td>
                            <td rowspan="2" :style="{ 'border-bottom-color': bodySlope ? '#ced7e0' : '#009fe8' }">
                                <span class="msg" v-if="leg">{{ leg.risk }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span
                                    :style="!isShowFree ? 'margin-bottom: 15px;' : ''"
                                    v-if="leg"
                                    class="val"
                                >右腿：{{ toDecimal(leg.rightVal, 1) }}°</span>
                            </td>
                            <td style="border-right-color: transparent;">
                                <contrast :style="!isShowFree?'margin-bottom: 15px;':''" v-if="leg" :val="leg.rightContrast" unit="°"></contrast>
                            </td>
                        </tr>
                            <!-- 长短腿 -->
                            <tr v-if="isShowFree">
                            <td>
                                <span class="name">长短腿</span>
                            </td>
                            <td>
                                <span v-if="legLengthDiff && legLengthDiff.status" class="val">{{ toDecimal(legLengthDiff.val, 1) }}cm</span>
                                <span class="val" v-else>--</span>
                            </td>
                            <td>
                                <contrast v-if="legLengthDiff" :val="legLengthDiff.contrast" unit="cm"></contrast>
                            </td>
                            <td>
                                <span class="msg" v-if="legLengthDiff && legLengthDiff.status">{{ legLengthDiff.conclusion === '正常' ? '正常' :
                                    `${legLengthDiff.conclusion}` }}</span>
                                    <span v-else class="msg">--</span>
                            </td>
                            <td>
                                <span class="msg" v-if="legLengthDiff && legLengthDiff.status">{{ legLengthDiff.risk }}</span>
                                <span v-else class="msg">--</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <report-footer :scanId="reportInfo.scanId"></report-footer>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import Contrast from '@/components/Contrast'
import ReportFooter from '@/components/Footer'
import { getBsConclusion, bsScanFileInfos, weightOffset } from '@/assets/js/apolloGql.js'
import { _toDecimal } from '@/assets/js/util.js'

import ImageFootPrints from '@/assets/images/footPrints.svg'

export default {
    name: 'BsReport',
    components: {
        Contrast,
        ReportFooter
    },
    props: {
        reportInfo: Object,
        memberInfo: Object,
        isShowFree: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            // 体态评估数据
            bsInfo: {},
            models: [
                {
                    name: '正视图',
                    img: ''
                },
                {
                    name: '左视图',
                    img: ''
                },
                {
                    name: '后视图',
                    img: ''
                },
                {
                    name: '右视图',
                    img: ''
                },
                {
                    name: '顶视图',
                    img: ''
                }
            ],
            evalInfo: {},
            weightInfo: '',
            loadedImgNum: 0,
            isGetImg: false
        }
    },
    computed: {
        // 头前引
        headForward() {
            const info = this.evalInfo['headForward']
            if (!info) {
                return ''
            }
            return info
        },
        // 头侧歪
        headSlant() {
            const info = this.evalInfo['headSlant']
            if (!info) {
                return ''
            }
            return info
        },
        // 圆肩
        roundShoulder() {
            const leftInfo = this.evalInfo['roundShoulderLeft']
            const rightInfo = this.evalInfo['roundShoulderRight']
            if (!leftInfo || !rightInfo) {
                return ''
            }
            return {
                left: leftInfo,
                right: rightInfo
            }
        },
        // 高低肩
        highLowShoudler() {
            const info = this.evalInfo['highLowShoudler']
            if (!info) {
                return ''
            }
            return info
        },
        // 骨盆前/后移
        pelvisForward() {
            const info = this.evalInfo['pelvisForward']
            if (!info) {
                return ''
            }
            return info
        },
        // 骨盆前/后倾
        pelvicForwardTilt() {
            const info = this.evalInfo['pelvicForwardTilt']
            if (!info) {
                return ''
            }
            return info
        },
        // 膝盖评估
        knee() {
            const leftInfo = this.evalInfo['leftKneeCheck']
            const rightInfo = this.evalInfo['rightKneeCheck']
            if (!leftInfo || !rightInfo) {
                return ''
            }
            return {
                left: leftInfo,
                right: rightInfo
            }
        },
        // 腿型
        leg() {
            const info = this.evalInfo['legXo']
            if (!info) {
                return ''
            }
            return info
        },
        // 身体倾斜度
        bodySlope() {
            const info = this.evalInfo['bodySlope']
            if (!info || info.val === null) {
                return ''
            }
            return info
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
        },
        // 长短腿
        legLengthDiff() {
            const info = this.evalInfo['legLengthDiff']
            if (!info) {
                return ''
            }
            return info
        }
    },
    created() {
        this.getBsConclusion()
        this.getBsScanFileInfos()
    },
    methods: {
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        },
        // 获取体态评估数据
        async getBsConclusion() {
            const userinfo = {
                memberId: this.reportInfo.memberId,
                scanId: this.reportInfo.scanId,
                scanTime: this.reportInfo.scanTime
            }
            await this.$apollo
                .query({
                    query: getBsConclusion,
                    variables: userinfo
                })
                .then(res => {
                    const info = res.data.bsEvalConclusion
                    const shapeData = info.data
                    if (info.code === 200) {
                        this.evalInfo = shapeData
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 获取体重偏移数据
        async getWeightOffset() {
            const userinfo = {
                scanId: this.reportInfo.scanId
            }
            await this.$apollo
                .query({
                    query: weightOffset,
                    variables: userinfo
                })
                .then(res => {
                    const info = res.data.weightOffset
                    const weightData = info.data
                    if (info.code === 200) {
                        this.weightInfo = weightData
                        this.$nextTick(() => {
                            this.draw(this.objSort(weightData))
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 获取体态相关扫描模型文件
        async getBsScanFileInfos() {
            const userinfo = {
                scanId: this.reportInfo.scanId
            }
            await this.$apollo
                .query({
                    query: bsScanFileInfos,
                    variables: userinfo
                })
                .then(res => {
                    const data = res.data.bsScanFileInfos
                    if (data && data.code === 200) {
                        this.isGetImg = true
                        data.data.forEach((model, index) => {
                            // 正视图
                            if (model.fileType.id === 6) {
                                this.models[0].img = model.filePath
                                // 左视图
                            } else if (model.fileType.id === 7) {
                                this.models[1].img = model.filePath
                                // 后视图
                            } else if (model.fileType.id === 21) {
                                this.models[2].img = model.filePath
                                // 右视图
                            } else if (model.fileType.id === 8) {
                                this.models[3].img = model.filePath
                                // 顶视图
                            } else if (model.fileType.id === 19) {
                                this.models[4].img = model.filePath
                            }
                        })
                        this.isImgErr = this.frontImg && this.sideImg && this.backImg ? false : true
                    }
                })
                .catch(err => {
                    this.isImgErr = true
                    console.log(err)
                })
        },
        // 绘制脚部
        draw(weigthArr) {
            let footCanvas = document.getElementById('footPrint')
            if (!footCanvas.getContext) return
            let footCtx = footCanvas.getContext('2d')
            let that = this
            let footimg = new Image()
            footimg.src = ImageFootPrints
            footimg.onload = function() {
                footCtx.drawImage(footimg, 0, 0, footCanvas.width, footCanvas.height)
                footCtx.save()
                footCtx.globalCompositeOperation = 'source-atop'
                if (weigthArr[0].name === 'weightA') {
                    let weightA = footCtx.createRadialGradient(20, 66, 1, 20, 66, 17)
                    weightA.addColorStop(0, '#00399A')
                    weightA.addColorStop(0.4, '#045CF5')
                    weightA.addColorStop(0.5, '#045CF5')
                    weightA.addColorStop(1, '#9ED4FF')
                    // 左后  toDecimal(weightInfo.weightA, 1)
                    footCtx.beginPath()
                    footCtx.arc(20, 66, 20, 0, Math.PI * 2, false)
                    footCtx.closePath()
                    footCtx.fillStyle = weightA
                    footCtx.fill()
                } else if (weigthArr[0].name === 'weightB') {
                    let weightB = footCtx.createRadialGradient(64, 66, 1, 64, 66, 17)
                    weightB.addColorStop(0, '#00399A')
                    weightB.addColorStop(0.4, '#045CF5')
                    weightB.addColorStop(0.5, '#045CF5')
                    weightB.addColorStop(1, '#9ED4FF')
                    // 右后  toDecimal(weightInfo.weightB, 1)
                    footCtx.beginPath()
                    footCtx.arc(64, 66, 20, 0, Math.PI * 2, false)
                    footCtx.closePath()
                    footCtx.fillStyle = weightB
                    footCtx.fill()
                } else if (weigthArr[0].name === 'weightC') {
                    let weightC = footCtx.createRadialGradient(66, 28, 1, 66, 28, 17)
                    weightC.addColorStop(0, '#00399A')
                    weightC.addColorStop(0.5, '#045CF5')
                    weightC.addColorStop(1, '#9ED4FF')
                    // 右前  toDecimal(weightInfo.weightC, 1)
                    footCtx.beginPath()
                    footCtx.arc(66, 28, 20, 0, Math.PI * 2, false)
                    footCtx.closePath()
                    footCtx.fillStyle = weightC
                    footCtx.fill()
                } else {
                    let weightD = footCtx.createRadialGradient(18, 30, 1, 18, 30, 17)
                    weightD.addColorStop(0, '#00399A')
                    weightD.addColorStop(0.5, '#045CF5')
                    weightD.addColorStop(1, '#9ED4FF')
                    // 左前  toDecimal(weightInfo.weightD, 1)
                    footCtx.beginPath()
                    footCtx.arc(18, 30, 20, 0, Math.PI * 2, false)
                    footCtx.closePath()
                    footCtx.fillStyle = weightD
                    footCtx.fill()
                }

                if (weigthArr[1].name === 'weightA') {
                    let weightA = footCtx.createRadialGradient(20, 66, 1, 20, 66, 17)
                    if (weigthArr[0].number - weigthArr[1].number >= 2) {
                        weightA.addColorStop(0, '#045CF5')
                        weightA.addColorStop(0.7, '#9ED4FF')
                        weightA.addColorStop(1, '#9ED4FF')
                    } else {
                        weightA.addColorStop(0, '#00399A')
                        weightA.addColorStop(0.5, '#045CF5')
                        weightA.addColorStop(1, '#9ED4FF')
                    }
                    // 左后  toDecimal(weightInfo.weightA, 1)
                    footCtx.beginPath()
                    footCtx.arc(20, 66, 20, 0, Math.PI * 2, false)
                    footCtx.closePath()
                    footCtx.fillStyle = weightA
                    footCtx.fill()
                } else if (weigthArr[1].name === 'weightB') {
                    let weightB = footCtx.createRadialGradient(64, 66, 1, 64, 66, 17)
                    if (weigthArr[0].number - weigthArr[1].number >= 2) {
                        weightB.addColorStop(0, '#045CF5')
                        weightB.addColorStop(0.7, '#9ED4FF')
                        weightB.addColorStop(1, '#9ED4FF')
                    } else {
                        weightB.addColorStop(0, '#00399A')
                        weightB.addColorStop(0.5, '#045CF5')
                        weightB.addColorStop(1, '#9ED4FF')
                    }
                    // 右后  toDecimal(weightInfo.weightB, 1)
                    footCtx.beginPath()
                    footCtx.arc(64, 66, 20, 0, Math.PI * 2, false)
                    footCtx.closePath()
                    footCtx.fillStyle = weightB
                    footCtx.fill()
                } else if (weigthArr[1].name === 'weightC') {
                    let weightC = footCtx.createRadialGradient(66, 30, 1, 66, 30, 17)
                    if (weigthArr[0].number - weigthArr[1].number >= 2) {
                        weightC.addColorStop(0, '#045CF5')
                        weightC.addColorStop(0.7, '#9ED4FF')
                        weightC.addColorStop(1, '#9ED4FF')
                    } else {
                        weightC.addColorStop(0, '#00399A')
                        weightC.addColorStop(0.5, '#045CF5')
                        weightC.addColorStop(1, '#9ED4FF')
                    }
                    // 右前  toDecimal(weightInfo.weightC, 1)
                    footCtx.beginPath()
                    footCtx.arc(66, 30, 20, 0, Math.PI * 2, false)
                    footCtx.closePath()
                    footCtx.fillStyle = weightC
                    footCtx.fill()
                } else {
                    let weightD = footCtx.createRadialGradient(18, 30, 1, 18, 30, 17)
                    if (weigthArr[0].number - weigthArr[1].number >= 2) {
                        weightD.addColorStop(0, '#045CF5')
                        weightD.addColorStop(0.7, '#9ED4FF')
                        weightD.addColorStop(1, '#9ED4FF')
                    } else {
                        weightD.addColorStop(0, '#00399A')
                        weightD.addColorStop(0.5, '#045CF5')
                        weightD.addColorStop(1, '#9ED4FF')
                    }
                    // 左前  toDecimal(weightInfo.weightD, 1)
                    footCtx.beginPath()
                    footCtx.arc(18, 30, 20, 0, Math.PI * 2, false)
                    footCtx.closePath()
                    footCtx.fillStyle = weightD
                    footCtx.fill()
                }
                that.imageLoaded()
            }
        },
        // 对象排序
        // 当bigMinFlag 参数为true的时候 结果是从小到大，当bigMinFlag为flase时，结果时从大到小
        objSort(obj, bigMinFlag) {
            let arr = []
            for (let x in obj) {
                if (obj.hasOwnProperty(x)) {
                    let tmp = {
                        name: x,
                        number: obj[x]
                    }
                    arr.push(tmp)
                }
            }
            function compare(property) {
                return function(a, b) {
                    let value1 = a[property]
                    let value2 = b[property]
                    if (bigMinFlag) {
                        return value1 - value2
                    } else {
                        return value2 - value1
                    }
                }
            }
            arr.sort(compare('number')).map(item => {
                return item
            })
            return arr
        },
        imageLoaded() {
            this.loadedImgNum++
            this.$emit('bsImageLoaded')
            if (this.loadedImgNum === 4) {
                console.log('SHAPE_IMG_OVER')
                console.log('SHAPE_REPORT_OVER')
            }
        },
        imageLoadError(item) {
            item.img = ''
            console.log('SHAPE_IMG_LOAD_ERROR')
        }
    }
}
</script>

<style scoped lang="less">
[v-cloak] {
    display: none;
}
.bs-report {
    position: relative;
    width: 100%;
    padding: 15px 0 19px 0;
    .posture {
        height: 850px;
    }
    .posture-title {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        span {
            font-size: 12px;
            color: #9b9b9b;
            padding: 0 0 9px 0;
        }
    }
    h2 {
        margin: 0 0 5px 0;
        font-size: 24px;
        font-family: OPPOSans-R;
        font-weight: normal;
        color: #333333;
        line-height: 32px;
        em {
            font-size: 12px;
            font-family: OPPOSans-R;
            font-weight: normal;
            font-style: normal;
            color: #9b9b9b;
            line-height: 16px;
        }
    }
    .shape-model {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        .item {
            position: relative;
            width: 193px;
            height: 222px;
            text-align: center;
            background: url('../../assets/images/shape_bg.svg') no-repeat;
            background-size: cover;
            span {
                position: absolute;
                top: 6px;
                left: 6px;
                font-size: 15px;
                font-family: OPPOSans-R;
                font-weight: normal;
                color: #666666;
                line-height: 20px;
            }
            img {
                margin-top: 2%;
                width: auto;
                height: 96%;
                &.default {
                    width: 108px;
                    height: auto;
                    margin-top: 42px;
                }
            }
        }
    }
    .shape-table {
        margin-bottom: 17px;
        table {
            text-align: left;
            table-layout: auto;
            thead {
                tr {
                    th {
                        padding-left: 9px;
                    }
                }
            }
            tbody {
                tr {
                    height: 70px;
                    td {
                        border-bottom-color: #ced7e0;
                        span {
                            text-align: left;
                        }
                        .msg {
                            font-size: 12px;
                            font-family: OPPOSans-R;
                            font-weight: normal;
                            color: #666666;
                            line-height: 20px;
                        }

                        &:first-of-type {
                            width: 129px;
                            span {
                                display: block;
                                width: 98px;
                                margin-left: 9px;
                            }
                        }
                        &:nth-of-type(2) {
                            width: 117px;
                            span {
                                display: block;
                                width: 86px;
                                margin-left: 9px;
                            }
                        }
                        &:nth-of-type(3) {
                            width: 97px;
                            padding-left: 9px;
                            text-align: left;
                        }
                        &:nth-of-type(4) {
                            width: 183px;
                            span {
                                display: block;
                                width: 145px;
                                margin-left: 9px;
                            }
                        }
                        &:nth-of-type(5) {
                            width: 309px;
                            span {
                                display: block;
                                width: 290px;
                                margin-left: 12px;
                            }
                        }
                    }
                    // 左右腿型
                    &:last-of-type,
                    &:nth-of-type(9) {
                        height: 35px;
                    }
                    &:last-of-type {
                        td {
                            &:nth-of-type(2) {
                                width: 117px;
                                padding-left: 9px;
                                text-align: left;
                            }
                            border-bottom-color: #009fe8;
                        }
                    }
                }
            }
        }
        .contrast-item {
            max-width: 96px;
        }
    }
    .body-slope {
        table {
            tbody {
                tr {
                    height: 59px;
                }
            }
        }
    }
    .body-slope1 {
        table {
            tbody {
                tr {
                    height: 52px;
                    td {
                        .msg {
                            line-height: 16px;
                        }
                        height: 26px;
                    }
                    // 左右腿型
                    &:last-of-type,
                    &:nth-of-type(9) {
                        height: 52px !important;
                    }
                    &:nth-of-type(10),
                    &:nth-of-type(11) {
                        height: 25px;
                    }
                }
            }
        }
    }
    .footer-part {
        display: flex;
        justify-content: space-between;
        .plantar {
            display: flex;
            width: 565px;
            border: 1px solid #009fe8;
            .result {
                position: relative;
                width: 149px;
                height: 123px;
                span {
                    position: absolute;
                    font-size: 13px;
                    font-family: OPPOSans-M;
                    font-weight: normal;
                    color: black;
                    line-height: 19px;
                    text-shadow: #fff 1px 0 0, #fff 0 1px 0, #fff -1px 0 0, #fff 0 -1px 0;
                    z-index: 10;
                    &:first-of-type {
                        top: 35px;
                        right: 102px;
                    }
                    &:nth-of-type(2) {
                        top: 35px;
                        left: 102px;
                    }
                    &:nth-of-type(3) {
                        bottom: 24px;
                        right: 102px;
                    }
                    &:nth-of-type(4) {
                        bottom: 24px;
                        left: 102px;
                    }
                }
                .footPrintInfo {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: 0px;
                }

                img {
                    width: auto;
                    height: 116px;
                    margin: 3px 16px;
                    position: absolute;
                    top: 0px;
                }
            }
            table {
                width: 416px;
                border-color: transparent;
                thead {
                    tr {
                        height: 24px;
                        text-align: left;
                        border-right: none;
                        border-top: none;
                        border-left: 1px solid #009fe8;
                    }
                }
                tbody {
                    tr {
                        td {
                            height: 43px;
                            &:first-of-type {
                                border-left-color: #ced7e0;
                            }
                            &:last-of-type {
                                border-right-color: transparent;
                            }
                        }
                        &:first-of-type {
                            td {
                                text-align: left;
                                font-size: 12px;
                                font-family: OPPOSans-M;
                                font-weight: normal;
                                color: #5698f5;
                                line-height: 19px;
                                &:first-of-type {
                                    padding-left: 9px;
                                    font-size: 15px;
                                    font-family: OPPOSans-M;
                                    font-weight: normal;
                                    color: #333333;
                                    line-height: 20px;
                                }
                            }
                        }
                        &:last-of-type {
                            td {
                                font-size: 12px;
                                font-family: OPPOSans-R;
                                font-weight: normal;
                                color: #9b9b9b;
                                line-height: 18px;
                                padding: 5px 9px;
                                border-top: 1px solid #ced7e0;
                                border-bottom-color: transparent;
                            }
                        }
                    }
                }
            }
        }
    }
    .footer {
        position: absolute;
        width: 267px;
        bottom: 10px;
    }
}
canvas {
    width: 84px;
    height: 79px;
}
</style>
