<template>
    <div :class="['girth-box', 'zh-CN']">
        <!-- 水平排列的视图部分 -->
        <div class="girth-models" :style="xianshi ? 'margin-top: 20px' : ''">
            <p class="tipss" v-if="xianshi">{{ promptgirthage }}</p>
            <div class="models-container">
                <!-- 正视图 -->
                <div class="model">
                    <div class="model-left-tittle">正视图</div>
                    <div class="title">
                        <span>本次测量</span>
                        <span>上次测量</span>
                    </div>
                    <div class="img">
                        <template>
                            <div>
                                <canvas ref="nowcanvas" width="154" height="220"
                                    v-if="(isVAPro7() || healthPackageEnable === 2 || deviceVApro6 || deviceVALit6) && girthImgs.now"></canvas>
                                <img :src="girthImgs.now" @load="girthImgLoaded" v-else />
                            </div>
                            <div>
                                <canvas ref="lastcanvas" width="154" height="220"
                                    v-if="(isVAPro7() || healthPackageEnable === 2 || deviceVApro6 || deviceVALit6) && girthImgs.last"></canvas>
                                <img v-else-if="girthImgs.last && healthPackageEnable !== 2 && !isVAPro7()"
                                    :src="girthImgs.last" @load="girthImgLoaded" />
                                <default-model v-else :txt="getTxt" @load="girthImgLoaded" />
                            </div>
                        </template>
                    </div>
                </div>
                <!-- 左侧面 -->
                <div class="model">
                    <div class="model-left-tittle">左视图</div>
                    <div class="title">
                        <span>本次测量</span>
                        <span>上次测量</span>
                    </div>
                    <div class="img">
                        <template>
                            <div>
                                <img :src="girthImgs.nowLeft" @load="girthImgLoaded" />
                            </div>
                            <div>
                                <img v-if="girthImgs.lastLeft" :src="girthImgs.lastLeft" @load="girthImgLoaded" />
                                <default-model v-else :txt="getTxt" @load="girthImgLoaded" />
                            </div>
                        </template>
                    </div>
                </div>
                <!-- 右侧面 -->
                <div class="model">
                    <div class="model-left-tittle">右视图</div>
                    <div class="title">
                        <span>本次测量</span>
                        <span>上次测量</span>
                    </div>
                    <div class="img">
                        <template>
                            <div>
                                <img :src="girthImgs.nowRight" style="transform: scaleX(-1)" @load="girthImgLoaded" />
                            </div>
                            <div>
                                <img v-if="girthImgs.lastRight" :src="girthImgs.lastRight" style="transform: scaleX(-1)"
                                    @load="girthImgLoaded" />
                                <default-model v-else :txt="getTxt" @load="girthImgLoaded" />
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="girth-right">
            <!-- 体围头部 -->
            <div class="girth-title1">
                <h2>
                    体围测量
                    <em class="unit">cm</em>
                </h2>
                <p class="tipss">
                    *为保证数据准确性，需穿着紧身衣服、扎起头发
                </p>
            </div>
            <!-- 体围报告对比信息 -->
            <div class="girth-part">
                <table border="1" cellspacing="0" cellpadding="0">
                    <thead border="1" cellspacing="0" cellpadding="0">
                        <tr>
                            <!-- 测量项目 -->
                            <th>测量项目</th>
                            <th>本次测量</th>
                            <th class="tpl">与上次对比</th>
                            <th>超越人群</th>
                            <th>超越人群比例</th>
                            <th>低 | 标准 | 高</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(girth, key) in girthData" :key="key"
                            :style="healthPackageEnable === 2 ? 'height:103px' : ''">
                            <td>{{ girth.title }}</td>
                            <td>
                                <span v-if="girth.val !== '' && unit === 'imperial' && girth.val !== '0.0' && girth.val > 0"
                                    class="val">{{
                                        girth.val
                                    }}</span>
                                <span v-else-if="girth.val !== '' && unit === 'metric' && girth.val !== '0.0' && girth.val > 0"
                                    class="val">{{
                                        girth.val
                                    }}</span>
                                <span v-else class="val">--</span>
                            </td>
                            <td>
                                <contrast v-if="girth.diff !== '' && girth.val > 0 && girth.last > 0" :val="girth.diff" :type="1"></contrast>
                                <span v-else class="val noval">--</span>
                            </td>
                            <!-- 超越人群 -->
                            <td>
                                <span v-if="girth.abovePopulation !== ''" class="val">{{ girth.abovePopulation }}</span>
                                <span v-else class="val noval">--</span>
                            </td>
                            <!-- 超越人群比例 -->
                            <td>
                                <span v-if="girth.abovePopulationRate !== ''" class="val">{{ girth.abovePopulationRate }}%</span>
                                <span v-else class="val noval">--</span>
                            </td>
                            <!-- 低 | 标准 | 高 -->
                            <td>
                                <div v-if="girth.rangeStatus" class="range-slider-container">
                                    <!-- 刻度数值 (上浮) -->
                                    <div class="tick-labels">
                                      <div class="tick-label" style="left: 33%">{{ girth.rangeValues.low }}</div>
                                      <div class="tick-label" style="left: 66%">{{ girth.rangeValues.high }}</div>
                                    </div>

                                    <!-- 进度条主体 -->
                                    <div class="range-track">
                                      <!-- 背景分段层 (3段) -->
                                      <div class="track-bg-layer">
                                        <div class="bg-segment"></div>
                                        <div class="bg-gap"></div>
                                        <div class="bg-segment"></div>
                                        <div class="bg-gap"></div>
                                        <div class="bg-segment"></div>
                                      </div>

                                      <!-- 实际值进度条 (悬浮在背景层之上) -->
                                      <div class="active-track" :class="girth.statusColor" :style="{ width: girth.percentage + '%' }"></div>

                                      <!-- 指示圆圈 -->
                                      <div class="indicator-dot" :class="girth.statusColor" :style="{ left: girth.percentage + '%' }"></div>
                                    </div>
                                </div>
                                <span v-else class="val noval">--</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import { bmGirthContrastInfo, bmScanFileInfos, bmBdaPointInfos, bmGirthAnalysis } from '@/assets/js/apolloGql.js'
import { _toDecimal, _contrastVal } from '@/assets/js/util.js'
import DefaultModel from '@/components/DefaultModelGirth'
import { promptgirthage } from '@/assets/js/config.js'
import Contrast from '@/components/Contrast'
export default {
    components: {
        DefaultModel,
        Contrast
    },
    props: {
        reportInfo: Object,
        memberInfo: Object,
        deviceVApro6: {
            type: Boolean,
            default: false
        },
        deviceVApro5: {
            type: Boolean,
            default: false
        },
        deviceVApro3: {
            type: Boolean,
            default: false
        },
        deviceVALit6: {
            type: Boolean,
            default: false
        },
        // 麦兰德模式
        healthPackageEnable: Number
    },
    data() {
        return {
            // 围度图片
            promptgirthage,
            isNewMath: true,
            girthImgs: {
                now: '',
                nowLeft: '', // 左斯圖
                nowRight: '', // 右斯圖
                last: '',
                lastLeft: '', // 左斯圖
                lastRight: '', // 右斯圖
                isGetData: false,
                // 是否获取到本次扫描的侧面图片
                isGetNowImg: false,
                // 是否获取到上次扫描的侧面图片
                isGetLastImg: false,
                // BDA是否失败
                isScanFailed: false,
                imgNum: 0,
                // 是否是首次测量
                isFirstScan: 1
            },
            girthTpl: [
                {
                    title: '颈围',
                    key: 'neckGirth'
                },
                {
                    title: '左上臂围',
                    key: 'leftUpperArmGirth'
                },
                {
                    title: '右上臂围',
                    key: 'rightUpperArmGirth'
                },
                {
                    title: '胸围',
                    key: 'bustGirth'
                },
                {
                    title: '高腰围',
                    key: 'waistGirth'
                },
                {
                    title: '中腰围',
                    key: 'midWaistGirth'
                },
                {
                    title: '低腰围',
                    key: 'lowWaistGirth'
                },
                {
                    title: '臀围',
                    key: 'hipGirth'
                },
                {
                    title: '左大腿围',
                    key: 'leftThighGirth'
                },
                {
                    title: '左大腿最小围',
                    key: 'leftMinThighGirth'
                },
                {
                    title: '右大腿围',
                    key: 'rightThighGirth'
                },
                {
                    title: '右大腿最小围',
                    key: 'rightMinThighGirth'
                },
                {
                    title: '左小腿围',
                    key: 'leftCalfGirth'
                },
                {
                    title: '右小腿围',
                    key: 'rightCalfGirth'
                }
            ],
            girthData: [],
            unit: 'metric',
            getTxt: '',
            bodypoints: {},
            bodypoints1: {}
        }
    },
    computed: {
        xianshi() {
            return this.isNewMath && (this.deviceVApro3 || this.deviceVApro5 || this.deviceVApro6 || this.deviceVALit6)
        }
    },
    created() {
        // 获取模型提示信息
        if (this.reportInfo.bdaStatus === 1) {
            this.getTxt = '模型获取失败'
        } else {
            this.getTxt = '未测量'
        }

        // this.unit = window.localStorage.getItem('unit')
        // BDA成功 获取围度信息
        if (this.reportInfo.bdaStatus === 1) {
            this.getGirthSideViewImg(this.reportInfo.scanId).then(data => {
                // 正視圖
                const file = data.find((model, index, arr) => {
                    return model.fileType.id === 18
                })
                if (file) {
                    this.girthImgs.isGetNowImg = true
                    this.girthImgs.now = file.filePath
                    if (this.healthPackageEnable === 2 || this.isVAPro7() || this.deviceVApro6 || this.deviceVALit6) {
                        this.bmBdaPointInfos(this.reportInfo.scanId, 1)
                        setTimeout(() => {
                            this.drawImage(this.girthImgs.now, 'nowcanvas')
                        }, 1000)
                    }
                }
                // 左視圖
                const fileLeft = data.find((model, index, arr) => {
                    return model.fileType.id === 20
                })
                if (fileLeft) {
                    this.girthImgs.isGetNowImg = true
                    this.girthImgs.nowLeft = fileLeft.filePath
                }
                // 右視圖
                const fileRight = data.find((model, index, arr) => {
                    return model.fileType.id === 20
                })
                if (fileRight) {
                    this.girthImgs.isGetNowImg = true
                    this.girthImgs.nowRight = fileRight.filePath
                }
            })
            this.bmGirthContrastInfo()
        } else {
            this.girthImgs.isScanFailed = true
            this.girthTpl.forEach(girth => {
                const item = {
                    ...girth,
                    val: '',
                    last: '',
                    diff: '',
                    abovePopulation: '',
                    abovePopulationRate: '',
                    rangeStatus: null,
                    currentLevel: 0,
                    rangeValues: {
                        low: '',
                        high: ''
                    }
                }
                this.girthData.push(item)
            })
            if (this.healthPackageEnable === 2) {
                const keysToRemove = ['neckGirth', 'waistGirth', 'midWaistGirth', 'lowWaistGirth']
                this.girthTpl = this.girthTpl.filter(item => !keysToRemove.includes(item))
            }
        }
    },
    methods: {
        safeJsonParse(str) {
            if (!str || typeof str !== 'string') return null
            try {
                return JSON.parse(str)
            } catch (e) {
                return null
            }
        },

        async fetchGirthAnalysis(scanId) {
            try {
                const res = await this.$apollo.query({
                    query: bmGirthAnalysis,
                    variables: { scanId },
                    fetchPolicy: 'network-only',
                })
                const resp = res && res.data && res.data.bmGirthAnalysis
                if (!resp || resp.code !== 200 || !resp.data) return null
                return resp.data
            } catch (e) {
                console.log(e)
                return null
            }
        },
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        },
        isVAPro7() {
            // return true
            return this.reportInfo.scanId.slice(0, 2) === 'M7' || this.reportInfo.scanId.slice(0, 2) === 'N7'
        },
        // 获取BDA 模型侧视图
        async getGirthSideViewImg(scanId) {
            return new Promise((ok, no) => {
                const userinfo = {
                    scanId
                }
                this.$apollo
                    .query({
                        query: bmScanFileInfos,
                        variables: userinfo
                    })
                    .then(res => {
                        const data = res.data.bmScanFileInfos
                        if (data && data.code === 200) {
                            // const file = data.data.find((model, index, arr) => {
                            //     return model.fileType.id === 18
                            // })
                            if (data.data) {
                                ok(data.data)
                                return
                            } else {
                                ok('')
                                return
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        no(err)
                        return
                    })
            })
        },
        // 围度数据
        async bmBdaPointInfos(scanId, num) {
            const userInfo = {
                memberId: this.reportInfo.memberId,
                scanId: scanId,
                scanTime: this.reportInfo.scanTime
            }
            await this.$apollo
                .query({
                    query: bmBdaPointInfos,
                    variables: userInfo
                })
                .then(res => {
                    const info = res.data.bmBdaPointInfos
                    if (num === 1) {
                        this.bodypoints = JSON.parse(JSON.stringify(info.data))
                        let keysToRemove = [
                            'leftUpperArmGirthPoint',
                            'rightUpperArmGirthPoint',
                            'bustGirthPoint',
                            'waistGirthPoint',
                            'hipGirthPoint',
                            'leftThighGirthPoint',
                            'rightThighGirthPoint',
                            'leftCalfGirthPoint',
                            'rightCalfGirthPoint',
                            'neckGirthPoint',
                            'leftMinThighGirthPoint',
                            'rightMinThighGirthPoint',
                            'lowWaistGirthPoint',
                            'midWaistGirthPoint'
                        ]
                        delete this.bodypoints.__typename
                        // console.log(this.bodypoints , '>>>>???')
                        // eslint-disable-next-line guard-for-in
                        for (let key in this.bodypoints) {
                            if (typeof this.bodypoints[key] === 'string') {
                                this.bodypoints[key] = JSON.parse(this.bodypoints[key])
                            }
                        }
                        if (this.isVAPro7()) {
                            let newpoints = {}
                            keysToRemove.forEach(key => {
                                if (this.bodypoints.hasOwnProperty(key)) {
                                    newpoints[key] = this.bodypoints[key]
                                }
                            })
                            this.bodypoints = newpoints
                        } else if (this.healthPackageEnable === 2) {
                            delete this.bodypoints.waistGirth2Point
                            delete this.bodypoints.waistGirth3Point
                            delete this.bodypoints.waistGirth6Point
                            delete this.bodypoints.waistGirth5Point
                            delete this.bodypoints.waistGirth4Point
                            delete this.bodypoints.waistGirth7Point
                            delete this.bodypoints.waistGirth8Point
                            delete this.bodypoints.waistGirth9Point
                            delete this.bodypoints.waistGirth10Point
                            delete this.bodypoints.dataStatus
                        }
                        // console.log(this.bodypoints , '>>>>???')
                    } else {
                        this.bodypoints1 = JSON.parse(JSON.stringify(info.data))
                        // console.log(this.bodypoints , '>>>>???')
                        let keysToRemove = [
                            'leftUpperArmGirthPoint',
                            'rightUpperArmGirthPoint',
                            'bustGirthPoint',
                            'waistGirthPoint',
                            'hipGirthPoint',
                            'leftThighGirthPoint',
                            'rightThighGirthPoint',
                            'leftCalfGirthPoint',
                            'rightCalfGirthPoint',
                            'neckGirthPoint',
                            'leftMinThighGirthPoint',
                            'rightMinThighGirthPoint',
                            'lowWaistGirthPoint',
                            'midWaistGirthPoint'
                        ]

                        delete this.bodypoints1.__typename
                        // eslint-disable-next-line guard-for-in
                        for (let key in this.bodypoints1) {
                            if (typeof this.bodypoints1[key] === 'string') {
                                this.bodypoints1[key] = JSON.parse(this.bodypoints1[key])
                            }
                        }
                        if (this.isVAPro7()) {
                            let newpoints = {}
                            keysToRemove.forEach(key => {
                                if (this.bodypoints1.hasOwnProperty(key)) {
                                    newpoints[key] = this.bodypoints1[key]
                                }
                            })
                            this.bodypoints1 = newpoints
                        } else if (this.healthPackageEnable === 2) {
                            delete this.bodypoints1.waistGirth2Point
                            delete this.bodypoints1.waistGirth3Point
                            delete this.bodypoints1.waistGirth6Point
                            delete this.bodypoints1.waistGirth5Point

                            delete this.bodypoints1.waistGirth4Point
                            delete this.bodypoints1.waistGirth7Point
                            delete this.bodypoints1.waistGirth8Point
                            delete this.bodypoints1.waistGirth9Point
                            delete this.bodypoints1.waistGirth10Point
                            delete this.bodypoints1.dataStatus
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 围度数据
        async bmGirthContrastInfo() {
            const userInfo = {
                memberId: this.reportInfo.memberId,
                scanId: this.reportInfo.scanId,
                scanTime: this.reportInfo.scanTime
            }
            await this.$apollo
                .query({
                    query: bmGirthContrastInfo,
                    variables: userInfo
                })
                .then(async res => {
                    const info = res.data.bmGirthContrastInfo
                    const girthData = info.data
                    if (info.code === 200 && girthData.length !== 0) {
                        // this.girthImgs.isFirstScan = info.data.firstScan
                        this.isNewMath = girthData[0].isNewMath
                        this.girthImgs.isGetData = true
                        // 获取上一次围度图片
                        if (girthData[1] && girthData[1]['scanId']) {
                            this.getGirthSideViewImg(girthData[1]['scanId']).then(data => {
                                this.girthImgs.isGetLastImg = true
                                // 正视图
                                const file = data.find((model, index, arr) => {
                                    return model.fileType.id === 18
                                })
                                if (file) {
                                    this.girthImgs.isGetNowImg = true
                                    this.girthImgs.last = file.filePath
                                    if (
                                        this.healthPackageEnable === 2 ||
                                        this.isVAPro7() ||
                                        this.deviceVApro6 ||
                                        this.deviceVALit6
                                    ) {
                                        this.bmBdaPointInfos(girthData[1]['scanId'], 2)
                                        setTimeout(() => {
                                            this.drawImage(this.girthImgs.last, 'lastcanvas')
                                        }, 1000)
                                    }
                                }
                                // 左视图
                                const fileLeft = data.find((model, index, arr) => {
                                    return model.fileType.id === 20
                                })
                                if (fileLeft) {
                                    this.girthImgs.isGetNowImg = true
                                    this.girthImgs.lastLeft = fileLeft.filePath
                                }
                                // 右视图
                                const fileRight = data.find((model, index, arr) => {
                                    return model.fileType.id === 20
                                })
                                if (fileRight) {
                                    this.girthImgs.isGetNowImg = true
                                    this.girthImgs.lastRight = fileRight.filePath
                                }
                            })
                        } else {
                            this.getTxt = '无历史数据'
                        }

                        // 获取本次 scanId 的围度分析数据（用于超越人群/比例/标准范围/等级）
                        const analysis = await this.fetchGirthAnalysis(this.reportInfo.scanId)
                        const analysisFieldMap = {
                            neckGirth: 'neckAnalysis',
                            leftUpperArmGirth: 'leftUpperArmAnalysis',
                            rightUpperArmGirth: 'rightUpperArmAnalysis',
                            bustGirth: 'bustAnalysis',
                            waistGirth: 'waistAnalysis',
                            midWaistGirth: 'midWaistAnalysis',
                            lowWaistGirth: 'lowWaistAnalysis',
                            hipGirth: 'hipAnalysis',
                            leftThighGirth: 'leftThighAnalysis',
                            rightThighGirth: 'rightThighAnalysis',
                            leftMinThighGirth: 'leftMinThighAnalysis',
                            rightMinThighGirth: 'rightMinThighAnalysis',
                            leftCalfGirth: 'leftCalfAnalysis',
                            rightCalfGirth: 'rightCalfAnalysis',
                        }

                        this.girthTpl.forEach(girth => {
                            const item = { ...girth }
                            // 测量值
                            item.val = this.toDecimal(girthData[0][girth.key], 1)
                            // 对比值
                            if (girthData[1] && girthData[1][girth.key]) {
                                item.last = this.toDecimal(girthData[1][girth.key], 1)
                                if (this.unit === 'metric') {
                                    const diff = _contrastVal(girthData[0][girth.key], girthData[1][girth.key])
                                    item.diff = diff
                                } else {
                                    const diff = _contrastVal(girthData[0][girth.key], girthData[1][girth.key])
                                    item.diff = diff
                                }
                                if (girthData[0][girth.key] <= 0 || girthData[1][girth.key] <= 0) {
                                    // 低腰围兼容旧数据  防止对比值极大
                                    item.diff = ''
                                }
                            } else {
                                item.last = ''
                                item.diff = ''
                            }
                            // 使用接口返回的 bm_girth_analysis JSON 数据
                            const analysisField = analysisFieldMap[item.key]
                            const parsed = analysis && analysisField ? this.safeJsonParse(analysis[analysisField]) : null
                            if (parsed) {
                                item.abovePopulation = parsed.over != null ? String(parsed.over) : ''
                                item.abovePopulationRate =
                                    parsed.over_ratio != null ? String(parsed.over_ratio) : ''
                                item.currentLevel = parsed.status != null ? Number(parsed.status) : 0
                                item.rangeValues = {
                                    low: parsed.l != null ? parsed.l : '',
                                    high: parsed.h != null ? parsed.h : '',
                                }
                                item.rangeStatus = { low: 33, standard: 34, high: 33 }
                                // 根据实际值计算进度条位置和颜色
                                if (parsed.value != null && item.rangeValues.low && item.rangeValues.high) {
                                    const actualValue = parsed.value
                                    // 计算标准范围的宽度
                                    const standardRange = item.rangeValues.high - item.rangeValues.low
                                    // 推断总进度条的范围：左端点 = 标准下限 - 标准范围宽度，右端点 = 标准上限 + 标准范围宽度
                                    const totalMin = item.rangeValues.low - standardRange
                                    const totalMax = item.rangeValues.high + standardRange
                                    const totalRange = totalMax - totalMin
                                    // 计算实际值在总范围内的位置，确保在0-100之间
                                    item.percentage = Math.max(0, Math.min(100, ((actualValue - totalMin) / totalRange) * 100))
                                    // 根据实际值所在的范围段设置颜色
                                    if (actualValue < item.rangeValues.low) {
                                        // 第一段：低于标准下限
                                        item.statusColor = 'yellow'
                                    } else if (actualValue < item.rangeValues.high) {
                                        // 第二段：在标准范围内
                                        item.statusColor = 'blue'
                                    } else {
                                        // 第三段：高于标准上限
                                        item.statusColor = 'red'
                                    }
                                } else {
                                    item.statusColor = 'blue'
                                    item.percentage = 50
                                }
                            } else {
                                item.abovePopulation = ''
                                item.abovePopulationRate = ''
                                item.currentLevel = 0
                                item.statusColor = 'blue'
                                item.percentage = 50
                                item.rangeValues = { low: '', high: '' }
                                item.rangeStatus = null
                            }
                            if (item.key === 'lowWaistGirth' && item.val === '0.0') {
                                return
                            }
                            this.girthData.push(item)
                        })
                    }
                    console.log(this.healthPackageEnable, 'this.healthPackageEnable')
                    if (this.healthPackageEnable === 2) {
                        console.log('this.healthPackageEnable === 2')
                        const keysToRemove = ['neckGirth', 'waistGirth', 'midWaistGirth', 'lowWaistGirth']
                        this.girthData = this.girthData.filter(item => !keysToRemove.includes(item.key))
                        console.log(this.girthData, 'this.girthData')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 围度图片加载完成
        girthImgLoaded() {
            console.log(this.girthImgs)
            this.girthImgs.imgNum++
            // 本次已失败 或 只有首次测量
            if (this.girthImgs.imgNum === 1 && (this.girthImgs.isScanFailed || this.girthImgs.isFirstScan)) {
                console.log('GIRTH_IMG_OVER')
                this.loadModuleOver()
                // 已获取到上次图片 或 非首次
            } else if (this.girthImgs.imgNum === 2 && (this.girthImgs.isGetLastImg || !this.girthImgs.isFirstScan)) {
                console.log('GIRTH_IMG_OVER')
                this.loadModuleOver()
            }
        },
        // 围度图片加载失败
        girthImgLoadError(type) {
            if (type === 'last') {
                this.girthImgs.last = ''
                console.log('LAST_GIRTH_IMG_LOAD_ERROR')
            } else {
                this.girthImgs.now = ''
                console.log('NOW_GIRTH_IMG_LOAD_ERROR')
            }
        },
        // 模型图片加载完成
        loadModuleOver() {
            this.moduleNum++
            // 模块加载完成
            if (this.moduleNum === 2) {
                console.log('SHAPE_REPORT_OVER')
            }
        },
        drawImage(url, name) {
            if (!this.$refs[name]) {
                console.error('Canvas元素未找到')
                return
            }
            const canvas = this.$refs[name]
            const ctx = canvas.getContext('2d')

            // 创建一个新的Image对象
            const img = new Image()
            img.src = url // 替换为你的图片路径
            // const scaleFactor = 0.38;
            img.onload = () => {
                // 将图片绘制到canvas上
                console.log(
                    '>>>>>图片《《《《《',
                    img.width,
                    canvas.width,
                    canvas.width / img.width,
                    img.width * (canvas.width / img.width)
                )
                const scaleFactor = parseFloat((canvas.width / img.width).toFixed(2))
                ctx.drawImage(img, 0, 0, 154, img.height * scaleFactor)
                const bodypoints = name === 'nowcanvas' ? this.bodypoints : this.bodypoints1
                // console.log(this.bodypoints.neckGirthPoint, '>>>>>>>>>>>>>>>>')
                console.log(bodypoints, '>》》》》》girthdata')
                if (this.healthPackageEnable === 2) {
                    delete bodypoints.neckGirthPoint
                    delete bodypoints.lowWaistGirthPoint
                    delete bodypoints.midWaistGirthPoint
                    delete bodypoints.waistGirthPoint
                }
                if (name === 'lastcanvas' && this.girthData[0].last === '' && this.isVAPro7()) {
                    delete bodypoints.neckGirthPoint
                    delete bodypoints.lowWaistGirthPoint
                    delete bodypoints.midWaistGirthPoint
                    delete bodypoints.leftMinThighGirthPoint
                    delete bodypoints.rightMinThighGirthPoint
                }
                if (bodypoints && bodypoints.neckGirthPoint) {
                    ctx.beginPath()
                    let isFirstPoint = true
                    const points = bodypoints.neckGirthPoint.point_list
                    for (let key in points) {
                        if (points.hasOwnProperty(key)) {
                            const point = points[key]
                            if (isFirstPoint) {
                                ctx.moveTo(point.x * scaleFactor, point.y * scaleFactor)
                                isFirstPoint = false
                            } else {
                                ctx.lineTo(point.x * scaleFactor, point.y * scaleFactor)
                            }
                            // ctx.arc(point.x, point.y, 2, 0, Math.PI * 2); // 绘制点
                        }
                    }

                    ctx.strokeStyle = '#FFFFFF'
                    ctx.lineWidth = 1
                    ctx.stroke() // 绘制曲线
                    ctx.fillStyle = 'red'
                    // ctx.fill(); // 填充点
                    delete bodypoints.neckGirthPoint
                }
                for (let part in bodypoints) {
                    if (bodypoints.hasOwnProperty(part)) {
                        console.log(`部位: ${part}`)
                        const { start, end } = bodypoints[part]
                        // 定义点的坐标和颜色
                        const points = [
                            { x: start.x * scaleFactor, y: start.y * scaleFactor },
                            { x: end.x * scaleFactor, y: end.y * scaleFactor }
                        ]

                        // 在图片上打点
                        points.forEach(point => {
                            ctx.beginPath()
                            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2)
                            // ctx.fillStyle = pointColor;
                            // ctx.fill();
                            ctx.closePath()
                        })

                        // 定义线的起点和终点
                        const lineStart = points[0]
                        const lineEnd = points[1]
                        const lineColor = '#FFFFFF'

                        // 在图片上画线
                        ctx.beginPath()
                        ctx.moveTo(lineStart.x, lineStart.y)
                        ctx.lineTo(lineEnd.x, lineEnd.y)
                        ctx.strokeStyle = lineColor
                        ctx.lineWidth = 1
                        ctx.stroke()
                        ctx.closePath()
                    }
                }
            }
        }
    }
}
</script>
<style lang="less">
.girth-box {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.girth-models {
    width: 100%;
    margin-top: 20px;

    .tipss {
        font-size: 12px;
        font-family: OPPOSans R, OPPOSans;
        font-weight: normal;
        color: #1f1e1e;
        line-height: 18px;
        margin-bottom: 10px;
    }

    .models-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .model {
        flex: 1;
        margin-right: 10px;
        border: 1px solid #009fe8;
        font-family: OPPOSans M, OPPOSans;
        font-weight: normal;
        position: relative;

        &:last-child {
            margin-right: 0;
        }

        .model-left-tittle {
            position: absolute;
            top: 42px;
            left: 6px;
            font-size: 15px;
            font-family: OPPOSans R, OPPOSans;
            font-weight: normal;
            color: #1f1e1e;
            line-height: 20px;
        }

        .title {
            font-size: 12px;
            color: #1f1e1e;
            line-height: 35px;
            height: 35px;
            display: flex;
            justify-content: space-around;
            text-align: center;
            margin: 0;
            border-bottom: 1px solid #009fe8;
            background: #f2f8ff;

            span {
                min-width: 100px;
                height: 24px;
                line-height: 35px;
                font-size: 12px;
                font-family: 'OPPOSans M', 'Noto Kufi Arabic SemiBold';
                font-weight: normal;
                color: #1f1e1e;
                border: none;
            }
        }

        .img {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: url('../../assets/images/girth.svg') no-repeat;
            background-size: 100% 100%;
            width: 100%;
            height: 315px;

            div {
                flex: 1;
                display: flex;
                justify-content: center;
            }

            img {
                height: 220px;
            }

            .get-error-model {
                margin-top: 28px;
                margin-right: 10px;
            }

            .failed-model {
                width: 50px;
                margin-right: 10px;
                margin-top: 5px;
            }
        }
    }
}

.girth-right {
    width: 100%;
    margin-top: 20px;

    .girth-title1 {
        position: relative;
        top: 0;
        height: 53px;

        h2,
        p {
            display: inline-block;
        }

        h2 {
            font-size: 25px;
            font-family: OPPOSans M, OPPOSans;
            font-weight: normal;
            color: #1f1e1e;

            .unit {
                font-size: 12px;
                font-family: OPPOSans R, OPPOSans;
                font-weight: normal;
                color: #1f1e1e;
                line-height: 21px;
                font-style: normal;
            }
        }

        .tips {
            span {
                min-width: 50px;
                height: 18px;
                background: #009fe8;
                font-size: 12px;
                font-family: OPPOSans R, OPPOSans;
                font-weight: normal;
                color: #1f1e1e;
                line-height: 16px;
                padding: 0 3px;
                margin-left: 24px;
            }
        }

        .tipss {
            margin-left: 100px;
            font-size: 12px;
            font-family: OPPOSans R, OPPOSans;
            font-weight: normal;
            color: #1f1e1e;
            line-height: 18px;

            span {
                min-width: 50px;
                height: 18px;
                background: #009fe8;
                font-size: 12px;
                font-family: OPPOSans R, OPPOSans;
                font-weight: normal;
                color: #1f1e1e;
                line-height: 16px;
                padding: 0 3px;
                margin-left: 24px;
            }
        }
    }

    .girth-part {
        width: 100%;
        height: auto;

        table {
            margin-top: 6px;
            width: 100%;

            thead {
                tr {
                    height: 36px;
                    font-size: 12px;
                    font-family: OPPOSans M, OPPOSans;
                    font-weight: normal;
                    color: #1f1e1e;
                    line-height: 16px;

                    th {
                        text-align: left;
                        color: #1f1e1e;

                        &:nth-child(1) {
                            width: 150px;
                            padding-left: 31px;
                        }
                        &:nth-child(2) {
                            width: 100px;
                        }
                        &:nth-child(3) {
                            width: 100px;
                        }
                        &:nth-child(4) {
                            width: 100px;
                        }
                        &:nth-child(5) {
                            width: 120px;
                        }
                        &:nth-child(6) {
                            width: 180px;
                            text-align: center;
                        }
                    }
                }
            }

            tbody {
                tr {
                    height: 74.4px;
                    border-bottom: 1px solid #ced7e0;

                    td {
                        &:first-child {
                            padding-left: 31px;
                            text-align: left;
                        }

                        text-align: left;
                        font-size: 15px;
                        font-family: OPPOSans M, OPPOSans;
                        font-weight: 500;
                        color: #1f1e1e;
                        line-height: 20px;

                        &:nth-child(2n),
                        &:nth-child(3n) {
                            font-size: 12px;
                            font-family: OPPOSans-B, OPPOSans;
                            font-weight: normal;
                            color: #5698f5;
                            line-height: 19px;
                        }
                    }

                    &:last-child {
                        border-bottom: 1px solid #009fe8;
                    }
                }
            }
        }
    }
}
.noval {
    margin-left: 24px;
}

.range-slider-container {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 10px; // 防止圆圈在0%或100%时被截断

    // 1. 顶部的数值
    .tick-labels {
        position: relative;
        height: 20px;
        margin-bottom: 4px;

        .tick-label {
            position: absolute;
            top: 0;
            transform: translateX(-50%);
            font-size: 10px;
            color: #1f1e1e; // @text-sub
            font-family: 'Inter';
        }
    }

    // 2. 进度条轨道区
    .range-track {
        position: relative;
        height: 3px; // 加粗轨道
        width: 100%;
        margin-bottom: 8px;

        // 背景分段层
        .track-bg-layer {
            display: flex;
            width: 100%;
            height: 100%;
            //gap: 6px; // 关键：控制断点间隙大小

            .bg-segment {
                flex: 1;
                background-color: #dedede; // 浅灰背景
                border-radius: 2px; // 轻微圆角
            }
            .bg-gap {
                flex: 0 0 3px; // 关键：控制断点间隙大小
                background-color: #ffffff; // 白色间隙
                z-index: 2;
            }
        }

        // 有色进度条
        .active-track {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            border-radius: 2px;
            z-index: 1; // 位于背景之上

            &.red {
                background: #dc3545;
            }
            &.yellow {
                background: #ffc107;
            }
            &.blue {
                background: #009fe8;
            }
            &.green {
                background: #28a745;
            }
        }

        // 指示圆圈
        .indicator-dot {
            width: 6px; // 稍微加大
            height: 6px;
            background: #fff;
            border: 3px solid; // 加粗边框
            border-radius: 50%;
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.1); // 增加一点立体感

            &.red {
                border-color: #dc3545;
            }
            &.yellow {
                border-color: #ffc107;
            }
            &.blue {
                border-color: #009fe8;
            }

            &.green {
                border-color: #28a745;
            }
        }
    }
}

/* 调整表格列宽以适应新字段 */
.girth-part table th:nth-child(5),
.girth-part table th:nth-child(6) {
    width: 100px;
    //text-align: center !important;
}

.girth-part table th:nth-child(7) {
    width: 180px;
    text-align: center !important;
}

/* 调整表格内容对齐 */
.girth-part table td:nth-child(5),
.girth-part table td:nth-child(6),
.girth-part table td:nth-child(7) {
    text-align: center;
}

/* 调整表格行高以适应进度条 */
table tbody tr {
    height: 90px !important;
}
</style>
