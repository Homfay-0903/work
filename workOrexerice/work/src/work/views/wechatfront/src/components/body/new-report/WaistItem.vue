<template>
    <!--围度信息图例-->
    <div>
        <div v-if="dataStatus === 1">
             <!-- 新算法产生的数据使用新逻辑 -->
            <new-waist-item :isCreateTime="isCreateTime" :oldUser="oldUser" />
        </div>
        <div v-else>
             <!-- 旧算法 产生的数据  -->
            <div class="body-roundness" :class="{ 'no-container-background': !isSupportWebgl.webgl }">
                <div class="person-img" :class="{ 'person-img-width': modelInfo.bdaStatus !== 1 }"
                    v-if="isSupportWebgl.webgl">
                    <img class="measure-top" src="@/assets/images/new-report/girth/fill@2x.png" />
                    <img class="measure-bottom" src="@/assets/images/new-report/girth/fill2@2x.png" alt />
                    <div class="model-container">
                        <measure-model-mld v-if="dispalyModel" class="measure-model" ref="waistmodel"
                            :tcScanId="tcScanIdCopt" @statusDispaly="OnIsDispaly" :show-girth="true" @modelLoadOver="modelLoadOver"></measure-model-mld>
                        <!-- 日期选择 -->
                        <div class="data-time">
                            <date-select :type="3" :scanId="scanId" :isCreateTime="isCreateTime"
                                @girthContras="onwaistContrasInfo"></date-select>
                        </div>
                    </div>
                </div>
                <!-- 判断浏览器支持 -->
                <version-tip v-else :tipMsg="isSupportWebgl.tipMsg" :title="isSupportWebgl.title"
                    msgStyle="msg-style"></version-tip>
                <template v-if="isSupportWebgl.webgl && dispalyModel">
                    <div :key="index" :class="{ 'hidden-roundness': modelInfo.bdaStatus !== 1 }"
                        v-for="(item, index) in roundness">
                        <div class="right-roundness-slide" v-if="item.girth.delta === slideIndex2">
                            <div class="roundness-data" v-if="isDispaly">
                                <p class="girth-value-top">{{ toDecimal(item.lastWidth, 1) > 0 ? toDecimal(item.lastWidth, 1) : '-'}}</p>
                                <p style="font-size: 3.467vw">cm</p>
                            </div>
                            <div class="model-right" v-if="isDispaly">
                                <p class="girth-value">{{ toDecimal(item.width, 1) > 0 ? toDecimal(item.width, 1) : '-' }}</p>
                                <p>cm</p>
                            </div>
                            <div :class="['roundness-data', isDispaly ? '' : 'model-style']" v-else>
                                <p class="girth-value">{{ toDecimal(item.width, 1) > 0 ? toDecimal(item.width, 1) : '-' }}</p>
                                <p>cm</p>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-if="isSupportWebgl.webgl">
                    <div :key="index" :class="{ 'hidden-roundness': modelInfo.bdaStatus !== 1 }"
                        v-for="(item, index) in waistarr1">
                        <div :class="['right-roundness-slide-2', tcScanIdtu === null ? 'tcScanIdCopt1' : '']"
                            v-if="index === slideIndex">
                            <p @click="slideTop" class="arrow">
                                <img src="@/assets/images/jiantou2.png" class="top-arrow" />
                            </p>
                            <div class="roundness-data">
                                <p>{{ item.title }}</p>
                            </div>
                            <p @click="slideBottom" class="arrow">
                                <img src="@/assets/images/jiantou.png" class="lower-arrow" />
                            </p>
                        </div>
                    </div>
                </template>
            </div>
            <div class="waist-data-item">
                <waist-data-item :name="'腰部'" :title="'腰部分数'" :arr="waistroundness" :unit="'分'"></waist-data-item>
                <waist-data-item :title="'腰围'" :arr="waistarr1" :unit="'cm'"></waist-data-item>
                <waist-data-item :title="'腰围间体积'" :arr="waistarr2" :unit="'cm³'"></waist-data-item>
                <waist-data-item :title="'腰臀比'" :arr="waistarr3"></waist-data-item>
                <waist-data-item :title="'轮廓分析'" :canvas="true" :arr="waistcanvas"></waist-data-item>
                <waist-data-item :name="'背部'" :arr="waistarr4" :unit="'L'"></waist-data-item>
                <waist-data-item :name="'臀部'" :arr="waistarr5" :unit="'cm'"></waist-data-item>
                <waist-assessment :obj="waistarr6"></waist-assessment>
            </div>
        </div>
    </div>
</template>

<script>
import { bmWaistInfo, bmwaistContrasInfo, findBmWaistScanTrueHistory } from '@/assets/js/apolloGql.js'
import isSupportWebgl from '@/assets/js/webgl.js'
import { _toDecimal } from '@/assets/js/util.js'
import MeasureModelMld from '@/components/model/new-report/MeasureMLD'
import VersionTip from '@/components/model/VersionTip.vue'
import DateSelect from '@/components/common/DateSelect'
import { mapState } from 'vuex'
import WaistDataItem from '@/components/common/new-report/WaistDataItem.vue'
import WaistAssessment from '../../common/new-report/WaistAssessment.vue'
import WaistCanvas from '../../common/new-report/Waistcanvas.vue'
import NewWaistItem from '@/components/body/new-report/NewWaistItem.vue'

export default {
    components: {
        MeasureModelMld,
        VersionTip,
        DateSelect,
        WaistDataItem,
        WaistAssessment,
        WaistCanvas,
        NewWaistItem
    },
    props: {
        isCreateTime: String,
    },
    data() {
        return {
            isSupportWebgl,
            modelInfo: JSON.parse(window.localStorage.getItem('modelInfo')),
            roundness: [
                {
                    title: '腰围1',
                    key: 'waistGirth1',
                    girth: {
                        delta: 0,
                        curveName: 'waist_girth',
                    },
                },
                {
                    title: '腰围2',
                    key: 'waistGirth2',
                    girth: {
                        delta: 1,
                        curveName: 'waist_girth_2',
                    },
                },
                {
                    title: '腰围3',
                    key: 'waistGirth3',
                    girth: {
                        delta: 2,
                        curveName: 'waist_girth_3',
                    },
                },
                {
                    title: '腰围4',
                    key: 'waistGirth4',
                    girth: {
                        delta: 3,
                        curveName: 'mid_waist_girth',
                    },
                },
                {
                    title: '腰围5',
                    key: 'waistGirth5',
                    girth: {
                        delta: 4,
                        curveName: 'waist_girth_5',
                    },
                },
                {
                    title: '腰围6',
                    key: 'waistGirth6',
                    girth: {
                        delta: 5,
                        curveName: 'waist_girth_6',
                    },
                },
                {
                    title: '腰围7',
                    key: 'waistGirth7',
                    girth: {
                        delta: 6,
                        curveName: 'low_waist_girth',
                    },
                },
                // {
                //     title: '臀围',
                //     key: 'hipGirth',
                //     girth: {
                //         delta: 6,
                //         curveName: 'hip_girth',
                //     },
                // },
                // {
                //     title: '左大腿围',
                //     key: 'leftThighGirth',
                //     girth: {
                //         delta: 7,
                //         curveName: 'left_thigh_girth',
                //     },
                // },
                // {
                //     title: '左大腿最小围',
                //     key: 'leftMinThighGirth',
                //     girth: {
                //         delta: 8,
                //         curveName: 'left_min_thigh_girth',
                //     },
                // },
                // {
                //     title: '右大腿围',
                //     key: 'rightThighGirth',
                //     girth: {
                //         delta: 9,
                //         curveName: 'right_thigh_girth',
                //     },
                // },
                // {
                //     title: '右大腿最小围',
                //     key: 'rightMinThighGirth',
                //     girth: {
                //         delta: 10,
                //         curveName: 'right_min_thigh_girth',
                //     },
                // },
                // {
                //     title: '左小腿围',
                //     key: 'leftCalfGirth',
                //     girth: {
                //         delta: 11,
                //         curveName: 'left_calf_girth',
                //     },
                // },
                // {
                //     title: '右小腿围',
                //     key: 'rightCalfGirth',
                //     girth: {
                //         delta: 12,
                //         curveName: 'right_calf_girth',
                //     },
                // },
            ],
            waistroundness: [],
            waistarr1: [],
            waistarr2: [],
            waistarr3: [],
            waistarr4: [],
            waistarr5: [],
            waistarr6: {},
            waistcanvas: [],
            slideIndex: 0,
            slideIndex2: -1,
            createTime: '.',
            historyDate: [], // 历史数据
            scanId: '',
            isDispaly: true,
            dispalyModel: false,
            tcScanIdCopt: '',
            tcScanIdtu: '',
            dataStatus: 0,  // 1 新算法发布产生的数据  0 老算法产生的数据
            oldUser: 0,  // 0 新用户 1 老用户（mld 新老数据兼容，第一条新数据视为新用户）
        }
    },
    computed: {
        ...mapState(['historyScanId', 'historyData']),
    },
    mounted() {
        // this.onGirthContrasInfo('M6C0123406789121-7666ba98-8568-4e49-a6e8-87cfe9f3e276')
        console.log(this.historyScanId, '>>>>>>>>>>>历史id')
        // if (!this.historyScanId) {
        //     this.onGirthContrasInfo()
        // }
        if (this.historyScanId) {
            this.scanId = this.historyScanId
        } else {
            this.scanId = this.modelInfo.scanId
        }
        this.getbmWaistInfo()
        this.findBmWaistScanTrueHistory()
        // this.findBsScanTrueHistory()
    },
    methods: {
        OnIsDispaly(data) {
            if (data === 2) {
                this.isDispaly = true
            } else {
                this.isDispaly = false
            }
        },
        // 根据当前scanId获取腰腹数据
        getbmWaistInfo() {
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
                        this.oldUser = data.data.oldUser
                        this.dataStatus = data.data.dataStatus
                        this.$lodash.each(this.roundness, () => {
                            this.roundness.forEach((element) => {
                                element.width = data.data[element.key]
                            })
                        })
                    }
                })
        },
        // 获取测量对比的数据
        onwaistContrasInfo(tcScanId) {
           // console.log(`获取对比数据id${tcScanId}`)
            this.dispalyModel = false
            if (tcScanId != null) {
                window.localStorage.setItem('tcScanId', tcScanId)
                this.tcScanIdCopt = this.historyData.scanId
            } else {
                this.tcScanIdCopt = this.scanId
                window.localStorage.removeItem('tcScanId', tcScanId)
            }
            this.tcScanIdtu = tcScanId
            this.$apollo
                .query({
                    query: bmwaistContrasInfo,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanId: this.modelInfo.scanId,
                        tcScanId: tcScanId,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    this.dispalyModel = true
                    console.log(res.data.bmwaistContrasInfo.data)
                    const data = res.data.bmwaistContrasInfo.data.contrastBmWaist
                    const data2 = res.data.bmwaistContrasInfo.data
                    // const data = { waistGirth1: '110.3', waistGirth2: '111.3', waistGirth3: '111.3', waistGirth4: '111.3', waistGirth5: '111.3', waistGirth6: '111.3', waistGirth7: '111.3', }
                    this.historyDate = []
                    if (data) {
                        this.$lodash.each(this.roundness, () => {
                            this.roundness.forEach((element) => {
                                element.lastWidth = data[element.key]
                            })
                        })
                    } else {
                        this.$lodash.each(this.roundness, () => {
                            this.roundness.forEach((element) => {
                                element.lastWidth = 0
                            })
                        })
                    }
                    this.roundness = JSON.parse(JSON.stringify(this.roundness))
                    this.isFirst(data2)
                    console.log(this.slideIndex, ' >>>>>>>>>>>>>>>>>this.slideIndex')
                })
        },
        isFirst(data) {
            if (!data.contrastBmWaist) {
                const arr1 = [{ 'lastvalue': '', 'value': data.latestBmWaist.waistScore }]
                this.waistroundness = arr1
                this.waistarr1 = Array.from({ length: 7 }, (_, index) => ({
                    title: `腰围${index + 1}`,
                    lastvalue: '',
                    value: data.latestBmWaist[`waistGirth${index + 1}`],
                    key: `waistGirth${index + 1}`,
                    girth: {
                        delta: index,
                        curveName: index === 0 ? 'waist_girth' : index === 3 ? 'mid_waist_girth' : index === 6 ? 'low_waist_girth' : `waist_girth_${index + 1}`
                    }
                }))
                this.waistarr2 = Array.from({ length: 3 }, (_, index) => ({
                    title: `区间${index + 1}`,
                    lastvalue: '',
                    value: data.latestBmWaist[`waistVolume${index + 1}`]
                }))
                this.waistarr3 = [{ 'lastvalue': '', 'value': data.latestBmWaist.waistHipRatio }]
                this.waistarr4 = [{ title: '背部体积', 'lastvalue': '', 'value': (data.latestBmWaist.backVolume / 1000).toFixed(2) }]
                this.waistarr5 = [{ title: '臀部', 'lastvalue': '', 'value': data.latestBmWaist.hipGirth }]
                this.waistarr6 = { value: data.latestBmWaist.waistHipRatio, gender: JSON.parse(window.localStorage.getItem('memberInfo')).sex }
                this.waistcanvas = Array.from({ length: 7 }, (_, index) => ({
                    title: `腰围${index + 1}`,
                    lastvalue: '',
                    value: data.latestBmWaist[`waistGirth${index + 1}`],
                    lastpoint: '',
                    point: data.latestBmWaist[`pointList${index + 1}`]
                }))
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>》|<<<<<<。waistcanvas', this.waistcanvas)
            } else {
                this.waistroundness = [{ 'lastvalue': data.contrastBmWaist.waistScore, 'value': data.latestBmWaist.waistScore }]
                this.waistarr1 = Array.from({ length: 7 }, (_, index) => ({
                    title: `腰围${index + 1}`,
                    lastvalue: data.contrastBmWaist[`waistGirth${index + 1}`],
                    value: data.latestBmWaist[`waistGirth${index + 1}`],
                    key: `waistGirth${index + 1}`,
                    girth: {
                        delta: index,
                        curveName: index === 0 ? 'waist_girth' : index === 3 ? 'mid_waist_girth' : index === 6 ? 'low_waist_girth' : `waist_girth_${index + 1}`
                    }
                }))
                this.waistarr1 = this.filter(this.waistarr1)
                this.waistarr2 = Array.from({ length: 3 }, (_, index) => ({
                    title: `区间${index + 1}`,
                    lastvalue: data.contrastBmWaist[`waistVolume${index + 1}`],
                    value: data.latestBmWaist[`waistVolume${index + 1}`]
                }))
                this.waistarr2 = this.filter(this.waistarr2)
                this.waistarr3 = [{ 'lastvalue': data.contrastBmWaist.waistHipRatio, 'value': data.latestBmWaist.waistHipRatio }]
                this.waistarr4 = [{ title: '背部体积', 'lastvalue': (data.contrastBmWaist.backVolume / 1000).toFixed(2), 'value': (data.latestBmWaist.backVolume / 1000).toFixed(2) }]
                this.waistarr5 = [{ title: '臀部', 'lastvalue': data.contrastBmWaist.hipGirth, 'value': data.latestBmWaist.hipGirth }]
                this.waistarr6 = { value: data.latestBmWaist.waistHipRatio, gender: JSON.parse(window.localStorage.getItem('memberInfo')).sex }
                this.waistcanvas = this.waistarr1.map(item => ({
                    title: item.title,
                    lastvalue: item.lastvalue,
                    value: item.value,
                    lastpoint: data.contrastBmWaist[`pointList${item.title[item.title.length - 1]}`],
                    point: data.latestBmWaist[`pointList${item.title[item.title.length - 1]}`]
                }))
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>》。waistcanvas', this.waistcanvas)
            }
            window.localStorage.setItem('waistarr1', JSON.stringify(this.waistarr1))
        },
        filter(data) {
            let arr = []
            data.forEach(item => {
                if (item.lastvalue > item.value) {
                    arr.push(item)
                }
            })
            arr.sort((a, b) => (b.lastvalue - b.value) - (a.lastvalue - a.value))
            if (arr.length > 3) {
                arr = arr.slice(0, 3)
            } else if (arr.length === 0) {
                const minDifference = Math.min(...data.map(item => Math.abs(item.lastvalue - item.value)))
                arr = data.filter(item => Math.abs(item.lastvalue - item.value) === minDifference)
                if (arr.length > 3) {
                    arr = arr.slice(0, 3)
                }
            }
            arr.sort((a, b) => a.title.slice(-1) - b.title.slice(-1))
            arr = arr.map((item, index) => {
                const prefix = item.title.slice(0, -1)
                item.title = prefix + (index + 1)
                return item
            })
            return arr
        },
        // 获取历史记录
        // findBsScanTrueHistory() {
        //     this.$apollo
        //         .query({
        //             query: findBsScanTrueHistory,
        //             variables: {
        //                 memberId: this.modelInfo.memberId,
        //                 scanTime: window.localStorage.getItem('createTime')
        //                     ? JSON.parse(window.localStorage.getItem('createTime'))
        //                     : this.modelInfo.createTime,
        //             },
        //             fetchPolicy: 'network-only',
        //         })
        //         .then((res) => {
        //             const data = res.data.findBsScanTrueHistory
        //             this.historyDate = []
        //             if (data && data.code === 200) {
        //                 for (let index = 0; index < data.data.length; index++) {
        //                     for (let aa = 0; aa < data.data[index].data.length; aa++) {
        //                         this.historyDate.push(data.data[index].data[aa])
        //                     }
        //                 }
        //             }
        //             this.$store.commit('setDataArray', this.historyDate)
        //         })
        // },
        findBmWaistScanTrueHistory() {
            this.$apollo
                .query({
                    query: findBmWaistScanTrueHistory,
                    variables: {
                        memberId: this.modelInfo.memberId,
                        scanTime: window.localStorage.getItem('createTime')
                            ? JSON.parse(window.localStorage.getItem('createTime'))
                            : this.modelInfo.createTime,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((res) => {
                    const data = res.data.findBmWaistScanTrueHistory
                    this.historyDate = []
                    if (data && data.code === 200) {
                        for (let index = 0; index < data.data.length; index++) {
                            for (let aa = 0; aa < data.data[index].data.length; aa++) {
                                this.historyDate.push(data.data[index].data[aa])
                            }
                        }
                    }
                    this.$store.commit('setwaistDataArray', this.historyDate)
                })
        },
        slideTop() {
            if (this.slideIndex === 0) {
                this.slideIndex = this.waistarr1.length - 1
                console.log(this.slideIndex, 'this.slideIndex')
            } else {
                this.slideIndex -= 1
            }
            this.$refs.waistmodel.selectCurve(this.waistarr1[this.slideIndex].girth)
        },
        slideBottom() {
            this.slideIndex += 1
            if (this.slideIndex === this.waistarr1.length) {
                this.slideIndex = 0
            }
            console.log('slideIndex', this.waistarr1[this.slideIndex].girth)
            this.$refs.waistmodel.selectCurve(this.waistarr1[this.slideIndex].girth)
        },
        setSlideIdx(idx) {
            this.slideIndex2 = idx
            this.slideIndex = this.waistarr1.findIndex(item => item.girth.delta === idx)
            console.log(this.slideIndex, 'this.slideIndex3')
        },
        toDecimal(num, digit) {
            return _toDecimal(num, digit)
        },
        modelLoadOver() {
            setTimeout(() => {
            //    this.slideTop()
            this.$refs.waistmodel.selectCurve(this.waistarr1[0].girth)
            }, 2000)
        }
    },
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
    font-family: PingFangSC, PingFang SC;

    // 禁止部分安卓机下图片自动放大
    img {
        pointer-events: none;
    }

    .girth-box {
        // margin-top: 74px
    }

    .model-container {
        position: relative;
    }

    >div {
        // padding-top: 30px;

        .right-roundness-slide {
            background: none;
            position: absolute;
            top: 0px;
            right: 140px;
            // background-color: brown;

            .roundness-data {
                position: relative;
                top: -40px;
                right: 40px;
                background-image: url('../../../assets/images/new-report/waist1.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                width: 69px;
                height: 69px;
                text-align: center;
                padding-top: 25px;
                margin-bottom: 6px;
                display: flex;
                flex-direction: column;

                p {
                    display: block;
                    font-size: 13px;
                    margin-left: 7px;
                    background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
                    -webkit-background-clip: text;
                    font-family: PingFangSC, PingFang SC;
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
                top: -115px;
                left: 42px;
                width: 69px;
                height: 69px;
                background-image: url(../../../assets/images/new-report/waist2.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                text-align: center;
                // font-size: 36px;
                padding-top: 25px;

                p {
                    display: block;
                    font-size: 13px;
                    margin-right: 7px;
                    font-family: PingFangSC, PingFang SC;
                    background: linear-gradient(90deg, #00e3c9 0%, #009fe8 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    padding: 0 0.01px;  /* 防止文本裁剪异常 */
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

    >.person-img-width {
        width: 100% !important;
        background-position: center bottom !important;
    }

    >.person-img {
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
            top: 225px;
            left: 8px;
            right: 8px;
            width: 96%;
        }

        .data-time {
            position: absolute;
            bottom: 0px;
            right: 0;
            left: 0px;
            margin: auto 20px;
            height: 52px;
        }
    }

    .measure-model {
        padding-bottom: 30px;
        height: 300px;
    }
}

.right-roundness-slide-2 {
    margin-left: 0;
    margin-top: 30px;
    background: none;
    position: absolute;
    z-index: 1;
    top: 50px;
    right: 138px;
    width: 70px;
    height: 200px;

    .roundness-data {
        color: white;
    }

    .arrow {
        text-align: center;
        padding: 30px 0;

        i {
            width: 8px;
            height: 8px;
            display: inline-block;
            transform-origin: center center;
            border-top: 2px solid #ffffff;
            border-right: 2px solid #ffffff;
        }

        .top-arrow {}

        .lower-arrow {
            margin-bottom: 3px;
        }
    }
}

.waist-data-item {
    margin: 20px auto;
    height: auto;
}

.tcScanIdCopt1 {
    right: 250px;
}
</style>
