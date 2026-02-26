<template>
    <!--围度信息图例-->
    <div class="body-roundness" :class="{ 'no-container-background': !isSupportWebgl.webgl }">
        <div class="person-img" :class="{ 'person-img-width': modelInfo.bdaStatus !== 1 }" v-if="isSupportWebgl.webgl">
            <img class="measure-top" src="@/assets/images/new-report/girth/fill@2x.png" />
            <img class="measure-bottom" src="@/assets/images/new-report/girth/fill2@2x.png" alt />
            <div class="model-container">
                <div class="model-container-box">
                    <measure-model
                    v-if="dispalyModel"
                    class="measure-model"
                    ref="model"
                    :tcScanId="tcScanIdCopt"
                    @statusDispaly="OnIsDispaly"
                    :show-girth="true"
                    ></measure-model>
                </div>

                <!-- 日期选择 -->
                <div class="data-time">
                    <date-select :type="2" :scanId="scanId" :isCreateTime="isCreateTime" @girthContras="onGirthContrasInfo"></date-select>
                </div>
            </div>
        </div>
        <!-- 判断浏览器支持 -->
        <version-tip v-else :tipMsg="isSupportWebgl.tipMsg" :title="isSupportWebgl.title" msgStyle="msg-style"></version-tip>
        <template v-if="isSupportWebgl.webgl && dispalyModel">
            <div
                :key="index"
                :class="{ 'hidden-roundness': modelInfo.bdaStatus !== 1 }"
                v-for="(item, index) in roundness"
            >
                <div class="right-roundness-slide" v-if="item.girth.delta === slideIndex">
                    <div class="roundness-data" v-if="isDispaly">
                        <p class="girth-value-top">{{ toDecimal(item.lastWidth, 1) > 0 ? toDecimal(item.lastWidth, 1) : '--'}}</p>
                        <p style="font-size: 3.467vw">cm</p>
                    </div>
                    <div class="model-right" v-if="isDispaly">
                        <p class="girth-value">{{ toDecimal(item.width, 1) }}</p>
                        <p>cm</p>
                    </div>
                    <div :class="['roundness-data', isDispaly ? '' : 'model-style']" v-else>
                        <p class="girth-value">{{ toDecimal(item.width, 1) }}</p>
                        <p>cm</p>
                    </div>
                </div>
            </div>
        </template>
        <!-- 数据对比 -->
        <div class="girth-box">
            <div class="girth-data">
                <girth-data v-if="roundStatus" :isRoundness="roundness"></girth-data>
            </div>
            <div v-if="isVAPro7 && !roundness[0].lastWidth > 0 && roundness[0].width > 0 && roundness[1].lastWidth > 0" class="girth-tip">由于对比当次的围度设置为9项，未设置的围度显示"--"</div>
        </div>
    </div>
</template>

<script>
import { bmGirthInfo, findBsScanTrueHistory, bmGirthContrasInfo, findUserInfoByScanId, bmGirthAnalysis } from '@/assets/js/apolloGql.js'
import isSupportWebgl from '@/assets/js/webgl.js'
import { _toDecimal } from '@/assets/js/util.js'
import MeasureModel from '@/components/model/new-report/Measure'
import VersionTip from '@/components/model/VersionTip.vue'
import DateSelect from '@/components/common/DateSelect'
import GirthData from './GirthData.vue'
import { isVAPro7 } from '@/types/device.js'
import { mapState } from 'vuex'
export default {
    components: {
        MeasureModel,
        VersionTip,
        DateSelect,
        GirthData
    },
    props: {
        isCreateTime: String
    },
    data() {
        return {
            isSupportWebgl,
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            roundness: [
                {
                    title: '颈围',
                    key: 'neckGirth',
                    girth: {
                        delta: 0,
                        curveName: 'neck_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 30,
                        high: 40
                    },
                    statusColor: 'blue',
                    percentage: 50
                },
                {
                    title: '左上臂围',
                    key: 'leftUpperArmGirth',
                    girth: {
                        delta: 1,
                        curveName: 'left_upper_arm_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 25,
                        high: 35
                    },
                    statusColor: 'blue',
                    percentage: 50
                },
                {
                    title: '右上臂围',
                    key: 'rightUpperArmGirth',
                    girth: {
                        delta: 2,
                        curveName: 'right_upper_arm_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 25,
                        high: 35
                    },
                    statusColor: 'blue',
                    percentage: 50
                },
                {
                    title: '胸围',
                    key: 'bustGirth',
                    girth: {
                        delta: 3,
                        curveName: 'bust_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 80,
                        high: 100
                    },
                    statusColor: 'blue',
                    percentage: 50
                },
                {
                    title: '高腰围',
                    key: 'waistGirth',
                    girth: {
                        delta: 4,
                        curveName: 'waist_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 70,
                        high: 90
                    },
                    statusColor: 'blue',
                    percentage: 50
                },
                {
                    title: '中腰围',
                    key: 'midWaistGirth',
                    girth: {
                        delta: 5,
                        curveName: 'mid_waist_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 70,
                        high: 90
                    },
                    statusColor: 'blue',
                    percentage: 50
                },
                {
                    title: '低腰围',
                    key: 'lowWaistGirth',
                    girth: {
                        delta: 13,
                        curveName: 'low_waist_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 70,
                        high: 90
                    },
                    statusColor: 'blue',
                    percentage: 50
                },
                {
                    title: '臀围',
                    key: 'hipGirth',
                    girth: {
                        delta: 6,
                        curveName: 'hip_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 80,
                        high: 100
                    },
                    statusColor: 'blue',
                    percentage: 50
                },
                {
                    title: '左大腿围',
                    key: 'leftThighGirth',
                    girth: {
                        delta: 7,
                        curveName: 'left_thigh_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 40,
                        high: 60
                    },
                    statusColor: 'blue',
                    percentage: 50
                },
                {
                    title: '左大腿最小围',
                    key: 'leftMinThighGirth',
                    girth: {
                        delta: 8,
                        curveName: 'left_min_thigh_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 35,
                        high: 55
                    },
                    statusColor: 'blue',
                    percentage: 50
                },
                {
                    title: '右大腿围',
                    key: 'rightThighGirth',
                    girth: {
                        delta: 9,
                        curveName: 'right_thigh_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 40,
                        high: 60
                    },
                    statusColor: 'blue',
                    percentage: 50
                },
                {
                    title: '右大腿最小围',
                    key: 'rightMinThighGirth',
                    girth: {
                        delta: 10,
                        curveName: 'right_min_thigh_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 35,
                        high: 55
                    },
                    statusColor: 'blue',
                    percentage: 50
                },
                {
                    title: '左小腿围',
                    key: 'leftCalfGirth',
                    girth: {
                        delta: 11,
                        curveName: 'left_calf_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 30,
                        high: 40
                    },
                    statusColor: 'blue',
                    percentage: 50
                },
                {
                    title: '右小腿围',
                    key: 'rightCalfGirth',
                    girth: {
                        delta: 12,
                        curveName: 'right_calf_girth'
                    },
                    beyondPeople: 0,
                    beyondPeopleRatio: 0,
                    rangeStatus: true,
                    rangeValues: {
                        low: 30,
                        high: 40
                    },
                    statusColor: 'blue',
                    percentage: 50
                }
            ],
            slideIndex: 0,
            createTime: '.',
            historyDate: [], // 历史数据
            scanId: '',
            unit: window.localStorage.getItem('unit'),
            isDispaly: true,
            dispalyModel: false,
            tcScanIdCopt: '',
            girthshownum: 1,
            isVAPro7: isVAPro7(),
            roundStatus: false
        }
    },
    computed: {
        ...mapState(['historyScanId', 'historyData'])
    },
    created() {
        if (this.historyScanId) {
            this.scanId = this.historyScanId
        } else {
            this.scanId = this.modelInfo.scanId
        }
    },
    mounted() {
        window.sessionStorage.removeItem('girthShowNumber')
        if (!this.historyScanId) {
            // this.onGirthContrasInfo()
        }
        // if (this.historyScanId) {
        //     this.scanId = this.historyScanId
        // } else {
        //     this.scanId = this.modelInfo.scanId
        // }
        if (this.isVAPro7) {
            this.getfindUserInfoByScanId()
        }
        this.getBmGirthInfo()
        this.getBmGirthAnalysis()
        this.findBsScanTrueHistory()
    },
    methods: {
        OnIsDispaly(data) {
            if (data === 2) {
                this.isDispaly = true
            } else {
                this.isDispaly = false
            }
        },
        getfindUserInfoByScanId() {
            console.log('getfindUserInfoByScanId')
            this.$apollo
                .query({
                    query: findUserInfoByScanId,
                    variables: {
                        scanId: this.scanId
                    }
                })
                .then(res => {
                    const data = res.data.findUserInfoByScanId
                    if (data && data.code === 200) {
                        this.girthshownum = data.data.girthShowNumber
                        console.log('girthshownum', this.girthshownum)
                        window.sessionStorage.setItem('girthShowNumber', data.data.girthShowNumber)
                    }
                })
        },
        // 根据当前scanId获取围度数据
        getBmGirthInfo() {
            this.$apollo
                .query({
                    query: bmGirthInfo,
                    variables: {
                        scanId: this.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.bmGirthInfo
                    if (data && data.code === 200) {
                        this.$lodash.each(this.roundness, () => {
                            this.roundness.forEach(element => {
                                element.width = data.data[element.key]
                            })
                        })
                        this.roundStatus = true
                        this.dispalyModel = true
                    }
                })
        },
        // 获取围度分析数据（标准范围、超越人群等）
        getBmGirthAnalysis() {
            this.$apollo
                .query({
                    query: bmGirthAnalysis,
                    variables: {
                        scanId: this.scanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const resp = res.data && res.data.bmGirthAnalysis
                    if (!resp || resp.code !== 200 || !resp.data) return
                    const analysis = resp.data
                    const mapping = {
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
                        leftMidThighGirth: 'leftMidThighAnalysis',
                        rightMidThighGirth: 'rightMidThighAnalysis',
                        leftMinThighGirth: 'leftMinThighAnalysis',
                        rightMinThighGirth: 'rightMinThighAnalysis',
                        leftCalfGirth: 'leftCalfAnalysis',
                        rightCalfGirth: 'rightCalfAnalysis'
                    }
                    this.roundness.forEach(item => {
                        const field = mapping[item.key]
                        if (!field || !analysis[field]) return
                        try {
                            const parsed = JSON.parse(analysis[field])
                            if (parsed && typeof parsed === 'object') {
                                if (item.rangeValues) {
                                    if (Object.prototype.hasOwnProperty.call(parsed, 'l')) item.rangeValues.low = parsed.l
                                    if (Object.prototype.hasOwnProperty.call(parsed, 'h')) item.rangeValues.high = parsed.h
                                }
                                if (Object.prototype.hasOwnProperty.call(parsed, 'over')) item.beyondPeople = parsed.over
                                if (Object.prototype.hasOwnProperty.call(parsed, 'over_ratio')) item.beyondPeopleRatio = parsed.over_ratio
                                if (Object.prototype.hasOwnProperty.call(parsed, 'value')) {
                                    item.percentage = parsed.value
                                    // 根据percentage计算statusColor
                                    if (item.percentage < 33) {
                                        item.statusColor = 'yellow'
                                    } else if (item.percentage < 66) {
                                        item.statusColor = 'blue'
                                    } else {
                                        item.statusColor = 'red'
                                    }
                                }
                            }
                        } catch (e) {
                            // 解析失败则保留默认配置
                        }
                    })
                    this.roundness = JSON.parse(JSON.stringify(this.roundness))
                })
        },
        // 获取测量对比的数据
        onGirthContrasInfo(tcScanId) {
            console.log(`获取对比数据${tcScanId}`)
            console.log(`现在的scanId${this.scanId}`)
            this.dispalyModel = false
            if (tcScanId != null) {
                window.localStorage.setItem('tcScanId', tcScanId)
                this.tcScanIdCopt = this.historyData.scanId
            } else {
                this.tcScanIdCopt = this.scanId
                window.localStorage.removeItem('tcScanId', tcScanId)
            }

            this.$apollo
                .query({
                    query: bmGirthContrasInfo,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: this.scanId,
                        tcScanId: tcScanId
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    this.dispalyModel = true
                    const data = res.data.bmGirthContrasInfo.data.contrastBmGirth
                    this.historyDate = []
                    if (data) {
                        this.$lodash.each(this.roundness, () => {
                            this.roundness.forEach(element => {
                                element.lastWidth = data[element.key]
                            })
                        })
                    } else {
                        this.$lodash.each(this.roundness, () => {
                            this.roundness.forEach(element => {
                                element.lastWidth = 0
                            })
                        })
                    }
                    this.roundness = JSON.parse(JSON.stringify(this.roundness))
                    if (this.girthshownum === 0 && this.isVAPro7) {
                        this.slideIndex = 1
                        const keysToRemove = [
                            'neckGirth',
                            'lowWaistGirth',
                            'midWaistGirth',
                            'leftMinThighGirth',
                            'rightMinThighGirth'
                        ]
                        this.roundness = this.roundness.filter(item => !keysToRemove.includes(item.key))
                    }
                    if (window.localStorage.getItem('healthPackageEnable') === '2') {
                        const keysToRemove = ['waistGirth', 'lowWaistGirth', 'midWaistGirth', 'neckGirth']
                        this.roundness = this.roundness.filter(item => !keysToRemove.includes(item.key))
                    }
                })
        },
        // 获取历史记录
        findBsScanTrueHistory() {
            this.$apollo
                .query({
                    query: findBsScanTrueHistory,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanTime: window.localStorage.getItem('createTime')
                            ? JSON.parse(window.localStorage.getItem('createTime'))
                            : this.modelInfo.createTime
                    },
                    fetchPolicy: 'network-only'
                })
                .then(res => {
                    const data = res.data.findBsScanTrueHistory
                    this.historyDate = []
                    if (data && data.code === 200) {
                        for (let index = 0; index < data.data.length; index++) {
                            for (let aa = 0; aa < data.data[index].data.length; aa++) {
                                this.historyDate.push(data.data[index].data[aa])
                            }
                        }
                    }
                    this.$store.commit('setDataArray', this.historyDate)
                })
        },
        slideTop() {
            if (this.slideIndex === 0) {
                this.slideIndex = this.roundness.length - 1
            } else {
                this.slideIndex -= 1
            }
            this.$refs.model.selectCurve(this.roundness[this.slideIndex].girth)
        },
        slideBottom() {
            this.slideIndex += 1
            if (this.slideIndex === this.roundness.length) {
                this.slideIndex = 0
            }
            this.$refs.model.selectCurve(this.roundness[this.slideIndex].girth)
        },
        setSlideIdx(idx) {
            this.slideIndex = idx
        },
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        }
    }
}
</script>

<style lang="less" scoped>
.hidden-roundness {
    // display: none;
}

.body-roundness {
    background-image: url('../../../assets/images/new-report/girth/Background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: left bottom;
    padding-top: 36px;
    margin: 12px;
    // display: flex;
    // justify-content: center;
    position: relative;
    height: auto;

    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }

    .girth-box {
        padding-bottom: 10px; /* 为 .girth-box 添加底部内边距 */
        .girth-data {
            margin-bottom: 10px; /* 保持 .girth-data 和 .girth-tip 之间的间距 */
        }
    }

    .model-container {
        position: relative;
        .model-container-box {
            min-height: 300px;
            position: absolute;
            width: 98%;
            left: 1% !important;
            top: -33px;
            left: 0;
        }
    }

    > div {
        // padding-top: 30px;

        .right-roundness-slide {
            background: none;
            position: absolute;
            top: 0px;
            right: 140px;
            // background-color: brown;

            .roundness-data {
                // position: relative;
                // top: 0px;
                // right: 0px;
                background-image: url('../../../assets/images/new-report/girth/jxing@2x.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                width: 89px;
                height: 79px;
                text-align: center;
                padding-top: 28px;
                margin-bottom: 6px;
                display: flex;
                flex-direction: column;

                p {
                    display: block;
                    font-size: 13px;
                    margin-left: 7px;
                    background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .girth-value-top {
                    display: block;
                    line-height: 15px;
                    font-size: 18px;
                    margin-left: 6px;
                }
                .girth-value {
                    display: block;
                    line-height: 15px;
                    font-size: 18px;
                    margin-right: 7px;
                }
            }

            .model-style {
                position: relative;
                top: 0px;
                right: -90px;
            }

            .model-right {
                position: relative;
                top: 0px;
                left: 12px;
                width: 89px;
                height: 79px;
                background-image: url(../../../assets/images/new-report/girth/jxing2@2x.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                text-align: center;
                // font-size: 36px;
                padding-top: 28px;

                p {
                    display: block;
                    font-size: 13px;
                    margin-right: 7px;
                    background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    padding: 0 0.01px; /* 防止文本裁剪异常 */
                }

                .girth-value {
                    display: block;
                    line-height: 15px;
                    font-size: 18px;
                    margin-right: 7px;
                }
            }
        }
    }

    > .person-img-width {
        width: 100% !important;
        background-position: center bottom !important;
    }

    > .person-img {
        // display: flex;
        // justify-content: center;
        // min-width: 215px;
        margin-bottom: 15px !important;
        background-repeat: no-repeat;
        background-position: 58px bottom;
        margin: 0 auto;
        min-height: 300px;

        .measure-top {
            position: absolute;
            left: 8px;
            right: 8px;
            top: 8px;
            width: 96%;
        }

        .measure-bottom {
            position: absolute;
            top: 245px;
            left: 8px;
            right: 8px;
            width: 96%;
        }

        .data-time {
            position: absolute;
            // bottom: -10px;
            right: 0;
            left: 0px;
            top: 260px;
            margin: auto 20px;
            height: 52px;
        }
    }

    .measure-model {
        padding-bottom: 30px;
        height: 300px;
    }
}
.girth-tip {
    position: relative;
    text-align: center;
    font-size: 10px;
    opacity: 0.5;
    color: white;
    margin: 0px 10px;
    height: 30px;
    line-height: 30px;
    &::before {
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: #ffffff;
        opacity: 0.2;
    }
}
</style>
